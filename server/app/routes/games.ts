import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import Types from "../types";
import { Game } from "../../../common/game/game";
import { Mongo, Collections, } from "../services/mongo";

@injectable()
export class Games {

    public constructor(@inject(Types.Mongo) private mongo: Mongo) { }

    public async getGames(req: Request, res: Response, next: NextFunction): Promise<void> {
        let response = await this.mongo.findDocuments<Game>(Collections.Games);
        res.status(200).send(JSON.stringify(response));
    }

    public async addGame(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            let game: Game = Object.assign(new Game, req.body);
            let response = await this.mongo.insertDocument<Game>(Collections.Games, game);

            if (response.result.ok) {
                res.sendStatus(200);
            } else {
                res.status(500).send("Failed to insert game into Mongo");
            }
        }
        catch (e) {
            res.status(400).send("Game provided does not follow the valid format");
        }
    }

    public async resetLeaderboard(req: Request, res: Response, next: NextFunction): Promise<void> {
        console.log("Appel");       
        try {
            let game: Game = Object.assign(new Game, req.body);
            // tslint:disable-next-line:prefer-for-of
            for ( let index = 0; index < game.leaderboards.length; index++ ) {
                game.leaderboards[index].scores[0].time = 5;
                
            }
            let response = await this.mongo.updateDocument<Game>(Collections.Games, game, {_id: game._id});
            console.log(response);
            if (response.result.ok) {
                res.sendStatus(200);
            } else {
                res.status(500).send("Failed to insert game into Mongo");
            }
        }
        catch (e) {
            res.status(400).send("Game provided does not follow the valid format");
        }
    }
}