import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";

import Types from "../types";
import { Game } from "../../../common/game/game";
import { Mongo, Collections } from "../services/mongo";
import { InsertOneWriteOpResult } from "mongodb";

const OK_CODE: number = 200;
const INVALID_FORMAT_CODE: number = 400;
const FAILED_INSERT_CODE: number = 500;

@injectable()
export class Games {
    public constructor(@inject(Types.Mongo) private mongo: Mongo) { }

    public async getGames(req: Request, res: Response, next: NextFunction): Promise<void> {
        const response: Game[] = await this.mongo.findDocuments<Game>(Collections.Games);
        res.status(OK_CODE).send(JSON.stringify(response));
    }

    public async addGame(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const game: Game = Object.assign(new Game, req.body);
            const response: InsertOneWriteOpResult = await this.mongo.insertDocument<Game>(Collections.Games, game);

            if (response.result.ok) {
                res.status(OK_CODE).send();
            } else {
                res.status(FAILED_INSERT_CODE).send("Failed to insert game into Mongo");
            }
        } catch (e) {
            res.status(INVALID_FORMAT_CODE).send("Game provided does not follow the valid format");
        }
    }
}