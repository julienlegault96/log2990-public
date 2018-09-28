import { Validator } from "./validator";

let validator: Validator;

describe("Validator", () => {
    beforeEach(() => {
        validator = new Validator();
    });

    it("should reject empty names", () => {
        expect(validator.isValidAlphanumericSymbols("")).toBeFalsy();
    });

    it("should accept alphanumeric names", () => {
        expect(validator.isValidAlphanumericSymbols("qawsedrftyhuji12345")).toBeTruthy();
    });

    it("should reject non alphanumeric names", () => {
        expect(validator.isValidAlphanumericSymbols("#@%&*()^^$++{}////")).toBeFalsy();
    });

    it("should reject names with non alphanumeric and alphanumeric characters", () => {
        expect(validator.isValidAlphanumericSymbols("#@%ait96)^^ab467/")).toBeFalsy();
    });

    it("should accept names with 1 caracter", () => {
        expect(validator.isValidUsernameLength("H")).toBeTruthy();
    });

    it("should accept names with 20 caracters", () => {
        expect(validator.isValidUsernameLength("1234567890abcdefghij")).toBeTruthy();
    });

    it("should reject names with 21 caracters", () => {
        expect(validator.isValidUsernameLength("1234567890abcdefghijK")).toBeFalsy();
    });

    it("should reject invalid images", () => {
        // set up fixtures
        const file: File = new File(new Array<Blob>(), "image.jpg");

        expect(validator.isValidImage(file)).toBeFalsy();
    });

    it("should accept valid images", () => {
        // set up fixtures
        const file: File = new File(new Array<Blob>(), "image.bmp");

        expect(validator.isValidImage(file)).toBeTruthy();
    });
});
