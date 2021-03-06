import { expect } from "chai";
import { GamesRoute } from "./games.route";
import { Mongo } from "../../services/mongo/mongo";

describe("Games route", () => {
    // set up fixtures
    const games: GamesRoute = new GamesRoute(new Mongo());

    it("should generate game id", async () => {
        const id: string = games["generateId"]();

        expect(id).to.be.a("string");
    });

});
