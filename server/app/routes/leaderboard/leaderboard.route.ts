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
import { SocketManager } from "../../socket";
import { SocketEvents } from "../../../../common/communication/sockets/socket-requests";
import { SocketMessageType } from "../../../../common/communication/sockets/socket-message-type";
import { SocketMessage, MessageOptions } from "../../../../common/communication/sockets/socket-message";
import { SocketHighscore } from "../../../../common/communication/sockets/socket-highscore";

@injectable()
export class LeaderboardRoute extends AbstractRoute<Game> {
    private readonly DISPLAYED_SCORES: number = 3;

    public constructor(
        @inject(Types.SocketIo) private io: SocketManager,
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
        // get top 3 + your score
        const updatedScores: Array<Score> = this.getUpdatedScores(game, leaderboardRequest);
        const position: number = this.getHighscorePosition(updatedScores, leaderboardRequest);
        //
        if (position !== 0 ) {
            // construct emited message with explicit types to avoid having the emit's "any" type introducing errors
            const messageHighscore: SocketHighscore = {
                position: position,
                gameMode: leaderboardRequest.partyMode,
                gameName: game.title
            };
            const messageInfo: MessageOptions = { highScore: messageHighscore };
            const message: SocketMessage = {
                userId: leaderboardRequest.playerName,
                type: SocketMessageType.Highscore,
                timestamp: Date.now(),
                extraMessageInfo: messageInfo
            };

            this.io.ioServer.sockets.emit( SocketEvents.Message, message );
        }

        game.leaderboards[leaderboardRequest.partyMode].scores = updatedScores;

        return this.update(game._id, game);
    }

    /**
     * returns 1, 2 or 3 depending on the Highscore's position
     */
    private getHighscorePosition(updatedScores: Array<Score>, leaderboardRequest: LeaderboardRequest): number {
        const thirdPlaceIndex: number = 2;
        const secondPlaceIndex: number = 1;
        const firstPlaceIndex: number = 0;
        if (updatedScores[thirdPlaceIndex].username === leaderboardRequest.playerName
            && updatedScores[thirdPlaceIndex].time === leaderboardRequest.time) {
            return thirdPlaceIndex + 1;
        } else if (updatedScores[secondPlaceIndex].username === leaderboardRequest.playerName
            && updatedScores[secondPlaceIndex].time === leaderboardRequest.time) {
            return secondPlaceIndex + 1;
        } else if (updatedScores[firstPlaceIndex].username === leaderboardRequest.playerName
            && updatedScores[firstPlaceIndex].time === leaderboardRequest.time) {
            return firstPlaceIndex + 1;
        } else {
            return 0;
        }
    }

    private getUpdatedScores(game: Game, elem: LeaderboardRequest): Array<Score> {
        const scores: Array<Score> = game.leaderboards[elem.partyMode].scores;
        scores.push({ username: elem.playerName, time: elem.time });

        scores.sort((a: Score, b: Score) => a.time - b.time);

        return scores.slice(0, this.DISPLAYED_SCORES);
    }

}
