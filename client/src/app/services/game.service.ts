import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";

import { AbstractServerService, Endpoints } from "./abstract-server.service";

import { Game } from "../../../../common/game/game";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable()
export class GameService extends AbstractServerService {

    public getGames(): Observable<Game[]> {
        return this.getRequest<Game[]>(Endpoints.Games);
    }

    public addGame(newGame: Game): Observable<{} | Game> {
        return this.postRequest<Game>(Endpoints.Games, newGame);
    }

    public isJoinable(game: Game): Observable<boolean> {
        return of(false);
    }

    protected handleError (error: HttpErrorResponse): Observable<never>{
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

        return throwError("Something bad happened; please try again later.");
    }
}
