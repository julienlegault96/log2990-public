import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";

import Types from "../types";
import { Game } from "../../../common/game/game";
import { CODES } from "../../../common/communication/response-codes";
import { Mongo, Collections } from "../services/mongo";
import { InsertOneWriteOpResult } from "mongodb";

@injectable()
export class Games {
    public constructor(@inject(Types.Mongo) private mongo: Mongo) { }

    public async getGames(req: Request, res: Response, next: NextFunction): Promise<void> {
        const response: Game[] = await this.mongo.findDocuments<Game>(Collections.Games);
        res.status(CODES.OK).send(JSON.stringify(response));
    }

    public async addGame(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const game: Game = Object.assign(new Game, req.body);
            const response: InsertOneWriteOpResult = await this.mongo.insertDocument<Game>(Collections.Games, game);

            if (response.result.ok) {
                res.status(CODES.OK).send();
            } else {
                res.status(CODES.FAILED_INSERT).send("Failed to insert game into Mongo");
            }
        } catch (e) {
            res.status(CODES.INVALID_FORMAT).send("Game provided does not follow the valid format");
        }
    }
}