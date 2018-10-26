import { expect } from "chai";
import { GamesRoute } from "./games.route";
import { Mongo } from "../../services/mongo";

describe("Games db services", () => {
    // set up fixtures
    const games: GamesRoute = new GamesRoute(new Mongo());

    it("should generate game id", async () => {
        const id: string = games["generateId"]();

        expect(id).to.be.a("number");
        expect(id).to.be.at.least(0);
        expect(id).to.be.at.most(games["ID_RANGE"]);
    });

    it("should not have valid error count", async () => {
        const result: boolean = await games["hasValidDifferenceCount"]("./test_assets/oneError.bmp");
        expect(result).to.equal(false);
    });

    it("should have valid error count", async () => {
        const result: boolean = await games["hasValidDifferenceCount"]("./test_assets/sevenErrors.bmp");
        expect(result).to.equal(true);
    });

});
