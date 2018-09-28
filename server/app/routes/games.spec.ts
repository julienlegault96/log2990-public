import { expect } from "chai";
import { Game } from "../../../common/game/game";
import { GAMES } from "../../../common/game/mock-games";
import { Games } from "./games";
import { Mongo } from "../services/mongo";
import { InsertOneWriteOpResult, DeleteWriteOpResultObject } from "mongodb";

describe("Games db services", () => {
    // set up fixtures
    const games: Games = new Games(new Mongo());
    let serverGames: Game[];

    it("should fetch and delete all games", async () => {
        serverGames = await games.findGames();
        for (const iterator of serverGames) {
            await games.removeGame(iterator);
        }

        const getResponse: Game[] = await games.findGames();
        expect(getResponse.length).to.equal(0);
    });

    it("should create mock game", async () => {
        // insert
        const insResponse: InsertOneWriteOpResult = await games.insertGame(GAMES[0]);

        expect(insResponse.insertedCount).to.equal(1);
    });

    it("shouldn't create mock game a second time", async () => {
        // insert
        try {
            await games.insertGame(GAMES[0]);
        } catch (err) {
            expect(String(err).includes("duplicate key error")).to.equal(true);
        }
    });

    it("should fetch mock game", async () => {
        // get
        const getResponse: Game[] = await games.findGames();

        expect(getResponse.length).to.equal(1);
        expect(getResponse[0].title).to.equal(GAMES[0].title);
    });

    it("should delete mock game", async () => {
        // delete
        const delResponse: DeleteWriteOpResultObject = await games.removeGame(GAMES[0]);

        expect(Number(delResponse.deletedCount)).to.equal(1);
    });

    it("should create back all serverGames", async () => {
        for (const iterator of serverGames) {
            await games.insertGame(iterator);
        }

        const getResponse: Game[] = await games.findGames();
        expect(getResponse.length).to.equal(serverGames.length);

    });
});
