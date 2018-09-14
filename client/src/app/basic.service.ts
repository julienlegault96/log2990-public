import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";

import { Message } from "../../../common/communication/message";

@Injectable()
export class BasicService {

    protected readonly BASE_URL: string = "http://localhost:3000/";
    public constructor(protected http: HttpClient) { }

    public basicGet(): Observable<Message> {
        return this.http.get<Message>(this.BASE_URL).pipe(
            catchError(this.handleError<Message>("basicGet"))
        );
    }

    protected handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return (error: Error): Observable<T> => {
            return of(result as T);
        };
    }
}
