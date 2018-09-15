import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError } from 'rxjs/operators';

@Injectable()
export abstract class AbstractServerService {

    protected readonly serverUrl: string = 'http://localhost:3000/';

    public constructor(protected http: HttpClient) { }

    protected getUrl(serverUri: string): string {
        return this.serverUrl + serverUri;
    }

    protected getRequest<T>(serverUri: string, request: string): Observable<T> {
        return this.http.get<T>(this.getUrl(serverUri)).pipe(
            catchError(this.handleError<T>(request))
        );
    }

    // Pas encore fonctionnel
    protected postRequest<T>(serverUri: string, body: T, request: string): Observable<{} | T> {
        const options = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };
        return this.http.post<T>(this.getUrl(serverUri), body, options).pipe(
            catchError(this.handleError(request))
        );
    }

    protected handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return (error: Error): Observable<T> => {
            return of(result as T);
        };
    }


}
