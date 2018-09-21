import { TestBed, inject } from "@angular/core/testing";
import { TestHelper } from "../../test.helper";
import { User } from "../../../../common/user/user";
import { USERS } from "../../../../common/user/mock-users";
import { UserService } from "./user.service";
import { HttpClientModule } from "@angular/common/http";

// tslint:disable-next-line:no-any Used to mock the http call
let httpClientSpy: any;
let userService: UserService;

describe("UserService", () => {
    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj("HttpClient", ["get"]);
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
        expect(userService.validateUsername("")).toBe(false);
    });

    it("should accept alphanumeric names", () => {
        expect(userService.validateUsername("qawsedrftyhuji12345")).toBe(true);
    });

    it("should reject non alphanumeric names", () => {
        expect(userService.validateUsername("#@%&*()^^$++{}////")).toBe(false);
    });

    it("should reject names with non alphanumeric and alphanumeric characters", () => {
        expect(userService.validateUsername("#@%ait96)^^ab467/")).toBe(false);
    });

    it("should accept names with 1 caracter", () => {
        expect(userService.validateUsername("H")).toBe(true);
    });

    it("should accept names with 20 caracters", () => {
        expect(userService.validateUsername("1234567890abcdefghij")).toBe(true);
    });

    it("should reject names with 21 caracters", () => {
        expect(userService.validateUsername("1234567890abcdefghijK")).toBe(false);
    });

    it("should fetch the existing usernames", () => {
        // setting up fixtures
        httpClientSpy.get.and.returnValue(TestHelper.asyncData(USERS));

        // check the content of the mocked call
        userService.getUsers().subscribe(
            (users: User[]) => {
                expect(users).toEqual(jasmine.any([]));
                expect(users).toEqual(USERS, "users check");
            },
            fail
        );
        // check if only one call was made
        expect(httpClientSpy.get.calls.count()).toBe(1, "one call");
    });

});
