import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";

import Types from "../types";
import { Game } from "../../../common/game/game";
import { CODES } from "../../../common/communication/response-codes";
import { Mongo, Collections } from "../services/mongo";
import { InsertOneWriteOpResult, DeleteWriteOpResultObject } from "mongodb";

@injectable()
export class Games {
    public constructor(@inject(Types.Mongo) private mongo: Mongo) { }

    public async findGames(): Promise<Game[]> {
        return this.mongo.findDocuments<Game>(Collections.Games);
    }

    public async insertGame(game: Game): Promise<InsertOneWriteOpResult> {
        return this.mongo.insertDocument<Game>(Collections.Games, game);
    }

    public async removeGame(game: Game): Promise<DeleteWriteOpResultObject> {
        return this.mongo.removeDocument<Game>(Collections.Games, game);
    }

    public async getGames(req: Request, res: Response, next: NextFunction): Promise<void> {
        res.status(CODES.OK).send(JSON.stringify(await this.findGames()));
    }

    public async addGame(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const response: InsertOneWriteOpResult = await this.insertGame(Object.assign(new Game, req.body));

            if (response.result.ok) {
                res.status(CODES.OK).send();
            } else {
                res.status(CODES.SERVER_ERROR).send("Failed to insert game into Mongo");
            }
        } catch (e) {
            res.status(CODES.BAD_REQUEST).send("Game provided does not follow the valid format");
        }
    }

    public async deleteGames(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const response: DeleteWriteOpResultObject = await this.removeGame(Object.assign(new Game, req.body));

            if (response.result.ok) {
                res.sendStatus(CODES.OK);
            } else {
                res.status(CODES.SERVER_ERROR).send("Failed to remove game from Mongo");
            }
        } catch (e) {
            res.status(CODES.BAD_REQUEST).send("Game provided does not follow the valid format");
        }
    }
}
