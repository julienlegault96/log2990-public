import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";

import Types from "../types";
import { Game } from "../../../common/game/game";
import { Mongo, Collections } from "../services/mongo";

@injectable()
export class Games {

    public constructor(@inject(Types.Mongo) private mongo: Mongo) { }

    public async getGames(req: Request, res: Response, next: NextFunction): Promise<void> {
        var response = await this.mongo.findDocuments<Game>(Collections.Games);
        res.status(200).send(JSON.stringify(response));
    }

    public async addGame(req: Request, res: Response, next: NextFunction): Promise<void> {
        var response = await this.mongo.insertDocument<Game>(Collections.Games, JSON.parse(req.body));
        if (response.result.ok) {
            res.sendStatus(200);
        } else {
            res.status(500).send("Failed to insert game into Mongo");
        }
    }
}