import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";

import { AbstractServerService, Endpoints, Query } from "./abstract-server.service";
import { Coordinates } from "../../../../common/game/coordinates";
import { ImageView } from "../../../../common/game/image-view";

@Injectable()

export class ImgDiffService extends AbstractServerService {

    public getDiff(id: number, imageView: ImageView, x: number, y: number): Observable<Array<Coordinates>> {
        return this.getRequest<Array<Coordinates>>(
            Endpoints.ImgDiff,
            null,
            new Query("id", id),
            new Query("imageView", imageView),
            new Query("x", Math.round(x)),
            new Query("y", Math.round(y)));
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
