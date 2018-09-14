import { TestBed, inject } from "@angular/core/testing";
import { User } from "./user";
import { USERS } from "./mock-users";
import { UserService } from "./user.service";

describe("UserService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [UserService]
        });
    });

    it("should be created", inject([UserService], (service: UserService) => {
        expect(service).toBeTruthy();
    }));

    it("should reject empty names", () => {
        expect(UserService.prototype.validateUsername("")).toBe(false);
    });

    it("should accept alphanumeric names", () => {
        expect(UserService.prototype.validateUsername("qawsedrftyhuji12345")).toBe(true);
    });

    it("should reject non alphanumeric names", () => {
        expect(UserService.prototype.validateUsername("#@%&*()^^$++{}////")).toBe(false);
    });

    it("should reject names with non alphanumeric and alphanumeric characters", () => {
        expect(UserService.prototype.validateUsername("#@%ait96)^^ab467/")).toBe(false);
    });

    it("should accept names with 1 caracter", () => {
        expect(UserService.prototype.validateUsername("H")).toBe(true);
    });

    it("should accept names with 20 caracters", () => {
        expect(UserService.prototype.validateUsername("1234567890abcdefghij")).toBe(true);
    });

    it("should reject names with 21 caracters", () => {
        expect(UserService.prototype.validateUsername("1234567890abcdefghijK")).toBe(false);
    });

    it("should reject names with non alphanumeric and alphanumeric characters", () => {
        expect(UserService.prototype.validateUsername("#@%ait96)^^$5467/")).toBe(false);
    });

    it("should fetch the existing usernames", () => {
        // setting up fixtures
        let receivedUsers: User[] = [];
        UserService.prototype.getUsernames().subscribe((users: User[]) => receivedUsers = users );
        // test
        expect(receivedUsers).toBe(USERS);
    });
});
