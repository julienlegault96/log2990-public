import { HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";

import { AbstractServerService, Endpoints, Query } from "./abstract-server.service";

class NotSoAbstractServerService extends AbstractServerService {
    public getServerHost(): string {
        return "http://localhost:3000";
    }

    public getUrlFromParent(serverEndpoint: Endpoints, pathParam?: string, ...queryParams: Query[]): string {
        return this.getUrl(serverEndpoint, pathParam, ...queryParams);
    }

    public handleError(error: HttpErrorResponse): Observable<never> {
        return throwError("error handled");
    }
}

// tslint:disable-next-line:no-any Used to mock the http call
let httpClientSpy: any;
let abstractServerService: NotSoAbstractServerService;

describe("AbstractServerService", () => {
    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj("HttpClient", ["get"]);
        abstractServerService = new NotSoAbstractServerService(httpClientSpy);
    });

    it("should return expected url if no path or query params", () => {
        const url: string = abstractServerService.getUrlFromParent(Endpoints.Games);
        const expectedUrl: string = `${abstractServerService.getServerHost()}/${Endpoints.Games}`;
        expect(url).toEqual(expectedUrl);
    });

    it("should return expected url if path param is provided", () => {
        const url: string = abstractServerService.getUrlFromParent(Endpoints.Users, "TLF2134RG");
        const expectedUrl: string = `${abstractServerService.getServerHost()}/${Endpoints.Users}/TLF2134RG`;
        expect(url).toEqual(expectedUrl);
    });

    it("should return expected url if query params are provided", () => {
        const url: string = abstractServerService.getUrlFromParent(
            Endpoints.Games, "", new Query("test", "testValue"), new Query("numTest", Number("1234")));
        const expectedUrl: string = `${abstractServerService.getServerHost()}/${Endpoints.Games}?test=testValue&numTest=1234`;
        expect(url).toEqual(expectedUrl);
    });

    it("should return expected url if path param and query params are provided", () => {
        const url: string = abstractServerService.getUrlFromParent(
            Endpoints.Games, "TLF2134RG", new Query("test", "testValue"), new Query("numTest", Number("1234")));
        const expectedUrl: string = `${abstractServerService.getServerHost()}/${Endpoints.Games}/TLF2134RG?test=testValue&numTest=1234`;
        expect(url).toEqual(expectedUrl);
    });
});
