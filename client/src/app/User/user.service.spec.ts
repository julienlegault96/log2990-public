import { TestBed, inject } from "@angular/core/testing";

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


});
