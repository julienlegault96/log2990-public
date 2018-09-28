import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import Types from "../types";
import { Game } from "../../../common/game/game";
import { Mongo, Collections } from "../services/mongo";
import { CODES } from "../../../common/communication/response-codes";
import { InsertOneWriteOpResult, UpdateWriteOpResult, DeleteWriteOpResultObject, ObjectID } from "mongodb";

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
            const randomRange: number = 1000000;
            game._id = Math.floor(Math.random() * randomRange);
            const response: InsertOneWriteOpResult = await this.mongo.insertDocument<Game>(Collections.Games, game);

            if (response.result.ok) {
                res.status(CODES.OK).send();
            } else {
                res.status(CODES.SERVER_ERROR).send("Failed to insert game into Mongo");
            }
        } catch (e) {
            res.status(CODES.BAD_REQUEST).send("Game provided does not follow the valid format");
        }
    }

    public async resetLeaderboard(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const game: Game = Object.assign(new Game, req.body);
            const response: UpdateWriteOpResult =
                await this.mongo.updateDocumentById<Game>(Collections.Games, game._id, { $set: { "leaderboards": game.leaderboards } });

            if (response.result.ok) {
                res.sendStatus(CODES.OK);
            } else {
                res.status(CODES.SERVER_ERROR).send("Failed to insert game into Mongo");
            }
        } catch (e) {
            res.status(CODES.BAD_REQUEST).send("Game provided does not follow the valid format");
        }
    }

    public async deleteGame(req: Request, res: Response): Promise<void> {
        try {
            const game: Game = Object.assign(new Game, req.body);
            const response: DeleteWriteOpResultObject = await this.mongo.removeDocument<Game>(Collections.Games, game);

            if (response.result.ok) {
                res.sendStatus(CODES.OK);
            } else {
                res.status(CODES.SERVER_ERROR).send("Failed to delete game into Mongo");
            }
        } catch (e) {
            res.status(CODES.BAD_REQUEST).send("Game provided does not follow the valid format");
        }
    }
}
