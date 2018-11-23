import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";

import Types from "../../types";
import { Mongo, Collections } from "../../services/mongo/mongo";
import { AbstractRoute } from "../abstract-route/abstract-route";

import { Game } from "../../../../common/game/game";
import { Score, Leaderboard } from "../../../../common/game/leaderboard";
import { UpdateWriteOpResult } from "mongodb";
import { CODES } from "../../../../common/communication/response-codes";
import { LeaderboardRequest } from "../../../../common/communication/leaderboard-request";
import { Socket } from "../../socket";
import { SocketEvents } from "../../../../common/communication/sockets/socket-requests";
import { SocketMessage } from "../../../../common/communication/sockets/socket-message";
import { SocketMessageType } from "../../../../common/communication/sockets/socket-message-type";

@injectable()
export class LeaderboardRoute extends AbstractRoute<Game> {

    public constructor(
        @inject(Types.Socket) private socket: Socket,
        @inject(Types.Mongo) mongo: Mongo,
    ) {
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

    public async put(req: Request, res: Response, next: NextFunction): Promise<void> {
        const leaderboards: Leaderboard[] = req.body;
        const game: Game = await this.getOne(req.params.id);

        game.leaderboards = leaderboards;
        req.body = game;

        await this.updateById(req, res, next, req.params.id);
    }

    private async updateScores(leaderboardRequest: LeaderboardRequest): Promise<UpdateWriteOpResult> {
        const game: Game = await this.getOne(leaderboardRequest.id);
        const updatedScores: Array<Score> = await this.getUpdatedScores(game, leaderboardRequest);

        if (this.hasHighscore(game.leaderboards[leaderboardRequest.partyMode].scores, updatedScores)) {
            const socketMessage: SocketMessage = {
                userId: leaderboardRequest.playerName,
                type: SocketMessageType.Highscore,
            };
            this.socket.emitToUser<SocketMessage>({ _id: leaderboardRequest.playerName }, SocketEvents.Message, socketMessage);
        }

        game.leaderboards[leaderboardRequest.partyMode].scores = updatedScores;

        return this.update(game._id, game);
    }

    private hasHighscore(scores: Array<Score>, updatedScores: Array<Score>): boolean {
        const firstScoreIndex: number = 0;
        const secondScoreIndex: number = 1;
        const thirdScoreIndex: number = 2;

        return scores[firstScoreIndex].time !== updatedScores[firstScoreIndex].time
            || scores[secondScoreIndex].time !== updatedScores[secondScoreIndex].time
            || scores[thirdScoreIndex].time !== updatedScores[thirdScoreIndex].time;
    }

    private async getUpdatedScores(game: Game, elem: LeaderboardRequest): Promise<Array<Score>> {
        const scores: Array<Score> = game.leaderboards[elem.partyMode].scores;
        scores.push({ username: elem.playerName, time: elem.time });

        const scoresToDisplay: number = 3;
        scores.sort((a: Score, b: Score) => a.time - b.time);

        return scores.slice(0, scoresToDisplay);
    }

}
