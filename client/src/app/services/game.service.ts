import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";

import { AbstractServerService, Endpoints } from "./abstract-server.service";

import { Game, generateGameTemplate } from "../../../../common/game/game";
import { generateSoloLeaderboard, generateDuoLeaderboard, Leaderboard } from "../../../../common/game/leaderboard";
import { GameType } from "../../../../common/game/game-type";
import { GenMultiParameters } from "../../../../common/communication/gen-multi-parameters";
import { GameCreationRequest } from "../../../../common/communication/game-creation-request";

@Injectable()

export class GameService extends AbstractServerService {

    public getGame(gameId: string): Observable<Game> {
        return this.getRequest<Game>(Endpoints.Games, gameId);
    }

    public getGames(): Observable<Game[]> {
        return this.getRequest<Game[]>(Endpoints.Games);
    }

    public createMultipleViewGame(options: GenMultiParameters): Observable<GameCreationRequest> {
        const newGame: Game = generateGameTemplate();
        newGame.type = GameType.DoubleView;
        const request: GameCreationRequest = { newGame, options };

        return this.postRequest<GameCreationRequest>(Endpoints.Games, request);
    }

    public createSingleViewGame(newGame: Game): Observable<{} | GameCreationRequest> {
        return this.postRequest<GameCreationRequest>(Endpoints.Games, { newGame });
    }

    public resetLeaderboard(toReset: Game): Observable<Leaderboard[]> {
        const leaderboards: Leaderboard[] = [
            generateSoloLeaderboard(),
            generateDuoLeaderboard()
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

    protected handleError(error: HttpErrorResponse): Observable<never> {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error("An error occurred:", error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }

        return throwError({ message: "Something bad happened; please try again later.", httpError: error });
    }

}
