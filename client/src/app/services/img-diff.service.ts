import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";

import { AbstractServerService, Endpoints, Query } from "./abstract-server.service";

@Injectable()

export class ImgDiffService extends AbstractServerService {

    public getDiff(x: number, y: number): Observable<Array<[number, number]>> {
        return this.getRequest<Array<[number, number]>>(Endpoints.ImgDiff, undefined, new Query("x", x), new Query("y", y));
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

        return throwError("Something bad happened; please try again later.");
    }

}
