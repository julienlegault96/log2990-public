import { expect } from "chai";
import { DifferenceCounter } from "./difference-counter";

describe("Difference counter service", () => {

    let differenceCounter: DifferenceCounter;
    beforeEach(() => {
        const differencesRequired: number = 7;
        differenceCounter = new DifferenceCounter(differencesRequired);
    });

    it("should not have valid error count", async () => {
        const result: boolean = await differenceCounter["hasValidDifferenceCount"]("./test_assets/oneError.bmp");
        expect(result).to.equal(false);
    });

    it("should have valid error count", async () => {
        const result: boolean = await differenceCounter["hasValidDifferenceCount"]("./test_assets/sevenErrors.bmp");
        expect(result).to.equal(true);
    });

});
