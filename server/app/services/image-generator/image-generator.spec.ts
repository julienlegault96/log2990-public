import { expect } from "chai";
import { ImageGenerator } from "./image-generator";

describe("GameCreator service", () => {

    let gameCreator: ImageGenerator;
    beforeEach(() => {
        gameCreator = new ImageGenerator();
    });

    it("should not have valid generated images", async () => {
        const result: boolean = await gameCreator["isValidGeneratedImages"](["", "", "", "", "", ""]);
        expect(result).to.equal(false);
    });

    it("should have valid generated images", async () => {
        const result: boolean = await gameCreator["isValidGeneratedImages"](["", "", "a", "", "", "a"]);
        expect(result).to.equal(true);
    });

});
