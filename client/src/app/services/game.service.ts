import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

import { AbstractServerService, Endpoints } from "./abstract-server.service";
import { Game } from "../../../../common/game/game";
import {
    generateSoloLeaderboard,
    generateDuoLeaderboard,
    Leaderboard,
    SINGLE_VIEW_BASE_TIME,
    MULTIPLE_VIEW_BASE_TIME
} from "../../../../common/game/leaderboard";
import { GameType } from "../../../../common/game/game-type";
import { GameCreationRequest } from "../../../../common/communication/game-creation-request";

@Injectable()

export class GameService extends AbstractServerService {

    public getGame(gameId: string): Observable<Game> {
        return this.getRequest<Game>(Endpoints.Games, gameId);
    }

    public getGames(): Observable<Game[]> {
        return this.getRequest<Game[]>(Endpoints.Games);
    }

    public postMultipleViewGame(newGameRequest: GameCreationRequest): Observable<GameCreationRequest> {
        return this.postRequest<GameCreationRequest>(Endpoints.Games, newGameRequest);
    }

    public postSingleViewGame(newGame: Game): Observable<{} | GameCreationRequest> {
        return this.postRequest<GameCreationRequest>(Endpoints.Games, { newGame });
    }

    public resetLeaderboard(toReset: Game): Observable<Leaderboard[]> {
        const baseTime: number = toReset.type === GameType.SingleView ? SINGLE_VIEW_BASE_TIME : MULTIPLE_VIEW_BASE_TIME;
        const leaderboards: Leaderboard[] = [
            generateSoloLeaderboard(baseTime),
            generateDuoLeaderboard(baseTime)
        ];
        toReset.leaderboards = leaderboards;

        return this.putRequest<Leaderboard[]>(Endpoints.Leaderboard, leaderboards, toReset._id);
    }

    public isJoinable(game: Game): Observable<boolean> {
        return of(false);
    }

    public deleteGame(game: Game): Observable<{} | Game> {
        return this.deleteRequest<Game>(Endpoints.Games, game._id);
    }

}
