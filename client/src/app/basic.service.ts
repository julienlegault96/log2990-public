import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable, of } from "rxjs";

@Injectable()
export class BasicService {

    protected readonly BASE_URL: string = "http://localhost:3000/";
    public constructor(protected http: HttpClient) { }

    protected handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return (error: Error): Observable<T> => {
            return of(result as T);
        };
    }
}
