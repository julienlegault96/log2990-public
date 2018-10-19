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
    private readonly FIRST_VIEW_RAW_INDEX: number = 0;
    private readonly FIRST_VIEW_MODIFIED_INDEX: number = 1;
    private readonly SECOND_VIEW_RAW_INDEX: number = 2;
    private readonly SECOND_VIEW_MODIFED_INDEX: number = 3;

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
            });

        await (imgurPromise);

        return super.post(req, res, next);
    }

    private async singleViewUpload(req: Request): Promise<string[]> {
        const imgur: Imgur = new Imgur();
        const imgurPromise1: Promise<string> = imgur.uploadImage(req.body.imageUrl[this.FIRST_VIEW_RAW_INDEX]);
        const imgurPromise2: Promise<string> = imgur.uploadImage(req.body.imageUrl[this.FIRST_VIEW_MODIFIED_INDEX]);
        // Appel du generateur d'image de difference et creation d'une Promise

        return Promise.all([
            imgurPromise1,
            imgurPromise2/*,
            base64Promise*/]).catch();
    }

    private async doubleViewUpload(req: Request): Promise<string[]> {
        const imgur: Imgur = new Imgur();
        const imgurPromise1: Promise<string> = imgur.uploadImage(req.body.imageUrl[this.FIRST_VIEW_RAW_INDEX]);
        const imgurPromise2: Promise<string> = imgur.uploadImage(req.body.imageUrl[this.FIRST_VIEW_RAW_INDEX]);
        // Appel du generateur d'image de difference et creation d'une Promise

        const imgurPromise3: Promise<string> = imgur.uploadImage(req.body.imageUrl[this.SECOND_VIEW_RAW_INDEX]);
        const imgurPromise4: Promise<string> = imgur.uploadImage(req.body.imageUrl[this.SECOND_VIEW_MODIFED_INDEX]);
        // Appel du generateur d'image de difference et creation d'une Promise

        return Promise.all([
            imgurPromise1,
            imgurPromise2,
            /*base64Promise1, */
            imgurPromise3,
            imgurPromise4/*,
            base64Promise2 */]);
    }

    private generateId(): number {
        return Math.floor(Math.random() * this.ID_RANGE);
    }

}
