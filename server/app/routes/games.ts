import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";

import Types from "../types";
import { Mongo, Collections } from "../services/mongo";
import { AbstractRoute } from "./abstract-route/abstract-route";
import { Imgur } from "./imgur/imgur";

import { Game } from "../../../common/game/game";
import { GameType } from "../../../common/game/game-type";

@injectable()

export class Games extends AbstractRoute<Game> {

    private readonly ID_RANGE: number = 1000000;

    public constructor(@inject(Types.Mongo) mongo: Mongo) {
        super(mongo);
        this.collection = Collections.Games;
    }

    public async resetLeaderboard(req: Request, res: Response, next: NextFunction): Promise<void> {
        const elem: Game = req.body;
        await this.updateById(req, res, next, elem._id);
    }

    public async post(req: Request, res: Response, next: NextFunction): Promise<void> {
        req.body._id = this.generateId();

        const imgurPromise: Promise<string[]> =
            (req.body.type === GameType.SingleView)
                ? this.singleViewUpload(req)
                : this.doubleViewUpload(req);

        imgurPromise
            .then((imagesUrl: string[]) => {
                req.body.imageUrl = imagesUrl;
            })
            .catch((err: string) => {
                //console.log(err);
            });

        await (imgurPromise);

        return super.post(req, res, next);
    }

    private async singleViewUpload(req: Request): Promise<string[]> {
        const imgur: Imgur = new Imgur();
        const imgurPromise1: Promise<string> = imgur.uploadImage(req.body.imageUrl[0]);
        const imgurPromise2: Promise<string> = imgur.uploadImage(req.body.imageUrl[1]);

        return Promise.all([imgurPromise1, imgurPromise2]);
    }

    private async doubleViewUpload(req: Request): Promise<string[]> {
        const imgur: Imgur = new Imgur();
        const imgurPromise1: Promise<string> = imgur.uploadImage(req.body.imageUrl[0]);
        const imgurPromise2: Promise<string> = imgur.uploadImage(req.body.imageUrl[1]);
        const imgurPromise3: Promise<string> = imgur.uploadImage(req.body.imageUrl[2]);
        const imgurPromise4: Promise<string> = imgur.uploadImage(req.body.imageUrl[3]);

        return Promise.all([imgurPromise1, imgurPromise2, imgurPromise3, imgurPromise4]);
    }

    private generateId(): number {
        return Math.floor(Math.random() * this.ID_RANGE);
    }

}
