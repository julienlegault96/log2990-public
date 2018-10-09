import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";

import Types from "../types";
import { Mongo, Collections } from "../services/mongo";
import { AbstractRoute } from "./abstract-route/abstract-route";
import { Imgur } from "./imgur/imgur";

import { Game } from "../../../common/game/game";
import { CODES } from "../../../common/communication/response-codes";

@injectable()

export class Games extends AbstractRoute<Game> {

    public constructor(@inject(Types.Mongo) mongo: Mongo) {
        super(mongo);
        this.collection = Collections.Games;
    }

    public async resetLeaderboard(req: Request, res: Response, next: NextFunction): Promise<void> {
        const elem: Game = req.body;
        await this.updateById(req, res, next, elem._id);
    }

    public async post(req: Request, res: Response, next: NextFunction): Promise<void> {
        const randomRange: number = 1000000;
        const randomNumber: number = Math.floor(Math.random() * randomRange);
        req.body._id = randomNumber;

        const imgur: Imgur = new Imgur();
        imgur.uploadImage(req.body.imageUrl[0])
            .then((imgurUrl: string) => {
                console.log(imgurUrl);
                req.body.imageUrl[0] = imgurUrl;
            })
            .catch((err: string) => {
                res.status(CODES.SERVER_ERROR).send(err);
            });

        imgur.uploadImage(req.body.imageUrl[1])
            .then((imgurUrl: string) => {
                req.body.imageUrl[1] = imgurUrl;
            })
            .catch((err: string) => {
                res.status(CODES.SERVER_ERROR).send(err);
            });

        console.log(req.body.imageUrl);

        return super.post(req, res, next);
    }

}
