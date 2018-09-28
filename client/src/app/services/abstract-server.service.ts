import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError, tap } from "rxjs/operators";

@Injectable()

export abstract class AbstractServerService {

    private readonly SERVER_HOST_URL: string = "http://localhost:3000";

    public constructor(protected http: HttpClient) { }

    protected getUrl(serverEndpoint: Endpoints, pathParam?: string | null, ...queryParams: Query[]): string {
        let url: string = this.appendEndpoint(serverEndpoint);
        url += this.formatPathParam(url, pathParam);
        url += this.formatQueryParams(...queryParams);

        return url;
    }

    private appendEndpoint(serverEndpoint: Endpoints): string {
        return `${this.SERVER_HOST_URL}/${serverEndpoint}`;
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

    protected postRequest<T>(serverEndpoint: Endpoints, body: T): Observable<T> {
        const options: {} = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };

        return this.http.post<T>(this.getUrl(serverEndpoint), body, options).pipe(
            catchError(this.handleError)
        );
    }

    protected putRequest<T>(serverEndpoint: Endpoints, body: T): Observable<T> {
        const options: {} = {
            headers: new HttpHeaders({ "Content-Type": "application/json" })
        };

        return this.http.put<T>(this.getUrl(serverEndpoint), body, options).pipe(
            tap(),
            catchError(this.handleError)
        );
    }

    protected deleteRequest<T>(serverEndpoint: Endpoints, deleteBody: T): Observable<{} | T> {
        const options: {} = {
            headers: new HttpHeaders({ "Content-Type": "application/json" }),
            body: deleteBody
        };

        return this.http.delete<T>(this.getUrl(serverEndpoint), options).pipe(
            catchError(this.handleError)
        );
    }

    protected abstract handleError(error: HttpErrorResponse): Observable<never>;
}

export enum Endpoints {
    Games = "games",
    Users = "users",
    Leaderboard = "leaderboard"
}

export class Query {
    public tag: string;
    public value: string | number;

    public constructor(tag: string, value: string | number) {
        this.tag = tag;
        this.value = value;
    }
}
