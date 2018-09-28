import { TestBed, inject } from "@angular/core/testing";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { TestHelper } from "../../test.helper";

import { GameService } from "./game.service";
import { Endpoints } from "./abstract-server.service";

import { BLANK_LEADERBOARDS } from "../../../../common/game/leaderboard";
import { Game } from "../../../../common/game/game";
import { GAMES } from "../../../../common/game/mock-games";

describe("GameService", () => {
    // setting  up fixtures
    let httpClientSpy: HttpClient;
    let gameService: GameService;

    beforeEach( () => {
        httpClientSpy = HttpClient.prototype;
        gameService = new GameService(httpClientSpy);

        TestBed.configureTestingModule({
            providers: [GameService],
            imports: [HttpClientModule]
        });
    });

    it("should be created", inject([GameService], (service: GameService) => {
        expect(service).toBeTruthy();
    }));

    it("should return expected data on get", () => {
        // setup fake server response
        spyOn(httpClientSpy, "get").and.callFake( () => TestHelper.asyncData(GAMES));

        // check the content of the mocked call
        gameService.getGames().subscribe(
            (games: Game[]) => {
                expect(games).toEqual(jasmine.any(Array));
                expect(games).toEqual(GAMES, "games check");
            }
        );

        // check if only one call was made
        expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
    });

    it("should reset the leaderboard", () => {
        // setup fake server response
        spyOn(httpClientSpy, "put").and.callFake(
            (endpoint: Endpoints, resetGame: Game) => TestHelper.asyncData(resetGame)
            );

        // check the content of the mocked call
        gameService.resetLeaderboard(GAMES[0]).subscribe(
            (returnedGame: Game) => {
                expect(returnedGame.leaderboards).toEqual(BLANK_LEADERBOARDS);
            }
        );

        // check if only one call was made
        expect(httpClientSpy.put).toHaveBeenCalledTimes(1);
    });
});
