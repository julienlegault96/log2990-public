import { TestBed, inject } from "@angular/core/testing";
import { TestHelper } from "../../test.helper";
import { USERS } from "../../../../common/user/mock-users";
import { UserService } from "./user.service";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { User } from "../../../../common/user/user";

let httpClientSpy: HttpClient;
let userService: UserService;

describe("UserService", () => {
    beforeEach(() => {
        httpClientSpy = HttpClient.prototype;
        userService = new UserService(httpClientSpy);
        TestBed.configureTestingModule({
            providers: [UserService],
            imports: [HttpClientModule]
        });
    });

    it("should be created", inject([UserService], (service: UserService) => {
        expect(service).toBeTruthy();
    }));

    it("should reject existing usernames", () => {
        // setup fixtures
        userService.asyncUserList = USERS;

        // test
        expect(userService.validateUsername(USERS[0]._id)).toBeFalsy();
    });

    it("should fetch the existing usernames", () => {
        // setup fake server response
        spyOn(httpClientSpy, "get").and.callFake( () => TestHelper.asyncData(USERS) );

        userService.getUsers().subscribe( (users: User[] ) => {
            expect(users).toEqual(jasmine.any(Array));
            expect(users).toEqual(USERS, "users check");
        });

        // check if only one call was made
        expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
    });

    it("should submit the existing usernames", () => {
        // setup fake server response
        spyOn(httpClientSpy, "post").and.callFake( () => TestHelper.asyncData(USERS[0]));

        userService.submitUsername(USERS[0]._id);

        // check if only one call was made
        expect(httpClientSpy.post).toHaveBeenCalledTimes(1);
    });

    it("should delete the submited username", () => {
        // setup fake server response
        spyOn(httpClientSpy, "delete").and.callFake( () => TestHelper.asyncData("delete done") );

        userService.removeUser(USERS[0]);

        // check if only one call was made
        expect(httpClientSpy.delete).toHaveBeenCalledTimes(1);
    });
});
