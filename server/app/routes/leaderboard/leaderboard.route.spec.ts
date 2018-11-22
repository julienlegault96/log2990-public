import { expect } from "chai";
import { LeaderboardRoute } from "./leaderboard.route";
import { Mongo } from "../../services/mongo/mongo";
import { LeaderboardRequest } from "../../../../common/communication/leaderboard-request";
import { GamePartyMode } from "../../../../common/game/game-party-mode";
import { GAMES } from "../../../../common/game/mock-games";
import { Score } from "../../../../common/game/leaderboard";
import { Socket } from "../../socket";
import { UserSocket } from "../../sockets/user/user.socket";
import { MessageSocket } from "../../sockets/message/message.socket";

describe("Leaderboard route", () => {
    // set up fixtures
    let leaderboardRoute: LeaderboardRoute;
    beforeEach(() => {
        const mongo: Mongo = new Mongo();
        const userSocket: UserSocket = new UserSocket(mongo);
        const messageSocket: MessageSocket = new MessageSocket();
        const socket: Socket = new Socket(userSocket, messageSocket);
        leaderboardRoute = new LeaderboardRoute(socket, mongo);
    });

    it("should not update scores", async () => {
        const leaderboardRequest: LeaderboardRequest = {
            id: "1",
            partyMode: GamePartyMode.Solo,
            time: 200,
            playerName: "Anon"
        };

        const scores: Array<Score> = await leaderboardRoute["getUpdatedScores"](GAMES[0], leaderboardRequest);
        const expectedScores: Array<Score> = [
            { username: "test", time: 54 },
            { username: "test2", time: 66 },
            { username: "test3", time: 89 }
        ];

        expect(scores.length).to.equal(expectedScores.length);
        expect(scores).to.be.eql(expectedScores);
    });

    it("should update scores", async () => {
        const leaderboardRequest: LeaderboardRequest = {
            id: "1",
            partyMode: GamePartyMode.Solo,
            time: 20,
            playerName: "Anon"
        };

        const scores: Array<Score> = await leaderboardRoute["getUpdatedScores"](GAMES[0], leaderboardRequest);
        const expectedScores: Array<Score> = [
            { username: "Anon", time: 20 },
            { username: "test", time: 54 },
            { username: "test2", time: 66 },
        ];

        expect(scores.length).to.equal(expectedScores.length);
        expect(scores).to.be.eql(expectedScores);
    });

});
