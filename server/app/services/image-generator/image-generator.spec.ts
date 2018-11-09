import { expect } from "chai";
import { ImageGenerator } from "./image-generator";

describe("GameCreator service", () => {

    let imageGenerator: ImageGenerator;
    beforeEach(() => {
        imageGenerator = new ImageGenerator();
    });

    it("should not have valid generated images", async () => {
        const result: boolean = await imageGenerator["isValidDifferenceImages"](["", "", "", "", "", ""]);
        expect(result).to.equal(false);
    });

    it("should have valid generated images", async () => {
        const result: boolean = await imageGenerator["isValidDifferenceImages"](["", "", "a", "", "", "a"]);
        expect(result).to.equal(true);
    });

});
