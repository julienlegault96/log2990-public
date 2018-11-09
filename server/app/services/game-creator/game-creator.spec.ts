import { expect } from "chai";
import { GameCreator } from "./game-creator";

describe("GameCreator service", () => {

    let gameCreator: GameCreator;
    beforeEach(() => {
        gameCreator = new GameCreator();
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
