import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";

import Types from "../types";
import { Mongo, Collections } from "../services/mongo";
import { AbstractRoute } from "./abstract-route/abstract-route";

import { Game } from "../../../common/game/game";
import { Score } from "../../../common/game/leaderboard";
import { GamePartyMode } from "../../../common/game/game-party-mode";
import { UpdateWriteOpResult } from "mongodb";
import { CODES } from "../../../common/communication/response-codes";

@injectable()

export class LeaderboardRoute extends AbstractRoute<Game> {

    public constructor(@inject(Types.Mongo) mongo: Mongo) {
        super(mongo);
        this.collection = Collections.Games;
    }

    public async post(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const leaderboardRequest: LeaderboardRequest = req.body;
            const response: UpdateWriteOpResult = await this.updateScores(leaderboardRequest);

            if (response.result.ok) {
                res.status(CODES.OK).send();
            } else {
                res.status(CODES.SERVER_ERROR).send("Failed to update scores");
            }
        } catch (e) {
            res.status(CODES.BAD_REQUEST).send("Element provided does not follow the valid format...");
        }
    }

    private async updateScores(leaderboardRequest: LeaderboardRequest): Promise<UpdateWriteOpResult> {
        const game: Game = await this.getOne(leaderboardRequest.id);
        const updatedScores: Array<Score> = await this.getUpdatedScores(game, leaderboardRequest);
        game.leaderboards[leaderboardRequest.partyMode].scores = updatedScores;

        return this.update(game._id, game);
    }

    private async getUpdatedScores(game: Game, elem: LeaderboardRequest): Promise<Array<Score>> {
        const scores: Array<Score> = game.leaderboards[elem.partyMode].scores;
        scores.push({ username: elem.playerName, time: elem.time });

        const scoresToDisplay: number = 3;
        scores.sort((a: Score, b: Score) => a.time - b.time);

        return scores.slice(0, scoresToDisplay);
    }

}

interface LeaderboardRequest {
    id: number;
    partyMode: GamePartyMode;
    time: number;
    playerName: string;
}
