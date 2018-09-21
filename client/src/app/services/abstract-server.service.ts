import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable()
export abstract class AbstractServerService {

    private readonly serverHost: string = "http://localhost:3000";

    public constructor(protected http: HttpClient) { }

    protected getUrl(serverEndpoint: Endpoints, pathParam?: string | null, ...queryParams: Query[]): string {
        let url: string = this.appendEndpoint(serverEndpoint);
        url += this.formatPathParam(url, pathParam);
        url += this.formatQueryParams(...queryParams);

        return url;
    }

    private appendEndpoint(serverEndpoint: Endpoints): string {
        return `${this.serverHost}/${serverEndpoint}`;
    }

    private formatPathParam(url: string, pathParam?: string | null): string {
        return pathParam ? `/${pathParam}` : "";
    }

    private formatQueryParams(...queryParams: Query[]): string {
        let query: string = "";

        if (queryParams.length > 0) {
            query += `?${queryParams[0].tag}=${queryParams[0].value}`;

            for (let i: number = 1; i < queryParams.length; i++) {
                query += `&${queryParams[i].tag}=${queryParams[i].value}`;
            }
        }

        return query;
    }

    protected getRequest<T>(serverEndpoint: Endpoints, pathParam?: string, ...queryParams: Query[]): Observable<T> {
        return this.http.get<T>(this.getUrl(serverEndpoint, pathParam, ...queryParams)).pipe(
            catchError(this.handleError)
        );
    }

    protected postRequest<T>(serverEndpoint: Endpoints, body: T): Observable<{} | T> {
        const options: {} = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };

        return this.http.post<T>(this.getUrl(serverEndpoint), body, options).pipe(
            catchError(this.handleError)
        );
    }

    protected deleteRequest<T>(serverEndpoint: Endpoints, pathParam?: string): Observable<{} | T> {
        return this.http.delete<T>(this.getUrl(serverEndpoint, pathParam)).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
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

export enum Endpoints {
    Games = "games",
    Users = "users"
}

export class Query {
    public tag: string;
    public value: string | number;

    public constructor(tag: string, value: string | number) {
        this.tag = tag;
        this.value = value;
    }
}
