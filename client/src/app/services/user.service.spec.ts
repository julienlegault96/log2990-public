import { TestBed, inject } from "@angular/core/testing";
import { TestHelper } from "../../test.helper";
import { User } from "../../../../common/user/user";
import { USERS } from "../../../../common/user/mock-users";
import { UserService } from "./user.service";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { throwError } from "rxjs";

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

    it("should reject empty names", () => {
        expect(userService.validateUsername("")).toBeFalsy();
    });

    it("should accept alphanumeric names", () => {
        expect(userService.validateUsername("qawsedrftyhuji12345")).toBeTruthy();
    });

    it("should reject non alphanumeric names", () => {
        expect(userService.validateUsername("#@%&*()^^$++{}////")).toBeFalsy();
    });

    it("should reject names with non alphanumeric and alphanumeric characters", () => {
        expect(userService.validateUsername("#@%ait96)^^ab467/")).toBeFalsy();
    });

    it("should accept names with 1 caracter", () => {
        expect(userService.validateUsername("H")).toBeTruthy();
    });

    it("should accept names with 20 caracters", () => {
        expect(userService.validateUsername("1234567890abcdefghij")).toBeTruthy();
    });

    it("should reject names with 21 caracters", () => {
        expect(userService.validateUsername("1234567890abcdefghijK")).toBeFalsy();
    });

    it("should fetch the existing usernames", () => {
        // setup fake server response
        spyOn(httpClientSpy, "get").and.callFake( () => TestHelper.asyncData(USERS) );

        // check the content of the mocked call
        userService.getUsers().subscribe(
            (users: User[]) => {
                expect(users).toEqual(jasmine.any(Array));
                expect(users).toEqual(USERS, "users check");
            },
            fail
        );

        // check if only one call was made
        expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
    });

    it("should submit the existing usernames", () => {
        // setup fake server response
        spyOn(httpClientSpy, "post").and.callFake( () => TestHelper.asyncData("post done"));

        // check the content of the mocked call
        userService.submitUsername(USERS[0]._id);

        // check if only one call was made
        expect(httpClientSpy.post).toHaveBeenCalledTimes(1);
    });

    it("should handle errors", () => {
        // setup fake server response
        spyOn(httpClientSpy, "post").and
        .callFake( () => throwError("Invalid username"));

        // check the content of the mocked call
        userService.submitUsername(USERS[0]._id);

        // check if only one call was made
        expect(httpClientSpy.post).toHaveBeenCalledTimes(1);
    });

    /*it("should delete the submited username", () => {
        spyOn(httpClientSpy, "delete").and.callThrough();
        userService.removeUser(USERS[0]._id);
        expect(httpClientSpy.delete).toHaveBeenCalledTimes(1);
    });*/
});
