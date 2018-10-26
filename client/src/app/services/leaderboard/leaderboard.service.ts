import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";

import { AbstractServerService, Endpoints } from "../abstract-server.service";

import { LeaderboardRequest } from "../../../../../common/communication/leaderboard-request";

@Injectable()

export class LeaderboardService extends AbstractServerService {

    public sendGameScore(leaderboardRequest: LeaderboardRequest): void {
        this.postRequest<LeaderboardRequest>(Endpoints.Score, leaderboardRequest)
            .subscribe();
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
