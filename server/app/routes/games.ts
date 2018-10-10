import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";

import Types from "../types";
import { Mongo, Collections } from "../services/mongo";
import { AbstractRoute } from "./abstract-route/abstract-route";
import { Imgur } from "./imgur/imgur";

import { Game } from "../../../common/game/game";

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

        const imgur: Imgur = new Imgur();
        const promise1: Promise<string> = imgur.uploadImage(req.body.imageUrl[0]);
        const promise2: Promise<string> = imgur.uploadImage(req.body.imageUrl[1]);

        Promise.all([promise1, promise2]).then((imageUrls: Array<string>) => {
            req.body.imageUrl[0] = imageUrls[0];
            req.body.imageUrl[1] = imageUrls[1];
        });

        return super.post(req, res, next);
    }

    private generateId(): number {
        return Math.floor(Math.random() * this.ID_RANGE);
    }

}
