import { TestBed, inject } from "@angular/core/testing";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { TestHelper } from "../../../test.helper";

import { UserService } from "./user.service";

import { USERS } from "../../../../../common/user/mock-users";
import { User } from "../../../../../common/user/user";
import { Endpoints } from "../abstract-server/abstract-server.service";

let httpClientSpy: HttpClient;
let userService: UserService;
let getMethodSpy: jasmine.Spy;

describe("UserService", () => {
    beforeEach(() => {
        httpClientSpy = HttpClient.prototype;
        // setup fake server responses
        getMethodSpy = spyOn(httpClientSpy, "get").and.callFake( () => TestHelper.asyncData(USERS) );

        spyOn(httpClientSpy, "post").and.callFake(
            (endpoint: Endpoints, postedUser: User) => TestHelper.asyncData(null)
            );

        spyOn(httpClientSpy, "delete").and.callFake( () => TestHelper.asyncData("delete done") );
        userService = new UserService(httpClientSpy);
        TestBed.configureTestingModule({
            providers: [UserService],
            imports: [HttpClientModule]
        });
    });

    it("should be created", inject([UserService], (service: UserService) => {
        expect(service).toBeTruthy();
        jasmine.getEnv().randomizeTests(true);
    }));

    it("should reject existing usernames", () => {
        // setup fixtures
        userService.asyncUserList = USERS;

        // test
        expect(userService.validateUsername(USERS[0]._id)).toBeFalsy();
    });

    it("should fetch the existing usernames", () => {
        // ignore calls done in constructor
        getMethodSpy.calls.reset();

        userService.getUsers().subscribe( (users: User[] ) => {
            expect(users).toEqual(jasmine.any(Array));
            expect(users).toEqual(USERS, "users check");
        });

        expect(getMethodSpy).toHaveBeenCalledTimes(1);
    });

    it("should submit usernames", () => {
        userService.submitUsername(USERS[0]._id);

        // should have called login
        expect(httpClientSpy.post).toHaveBeenCalledTimes(1);
        expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
    });

    it("should delete the submited username", () => {
        userService.removeUser(USERS[0]);

        // check if only one call was made
        expect(httpClientSpy.delete).toHaveBeenCalledTimes(1);
    });
});
