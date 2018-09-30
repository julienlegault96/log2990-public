import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";

import Types from "../types";
import { Mongo, Collections } from "../services/mongo";
import { AbstractRoute } from "./abstract-route/abstract-route";

import { Game } from "../../../common/game/game";

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

        return super.post(req, res, next);
    }

}
