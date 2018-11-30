import { TestBed, inject } from "@angular/core/testing";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { TestHelper } from "../../../test.helper";

import { GameService } from "./game.service";
import { Endpoints } from "../abstract-server/abstract-server.service";

import { Game } from "../../../../../common/game/game";
import { GAMES } from "../../../../../common/game/mock-games";

describe("GameService", () => {
    // setting  up fixtures
    let httpClientSpy: jasmine.SpyObj<HttpClient>;
    let gameService: GameService;

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj("HttpClient", ["get", "put"]);
        httpClientSpy.get.and.callFake(() => TestHelper.asyncData(GAMES));
        httpClientSpy.put.and.callFake((endpoint: Endpoints, resetGame: Game) => TestHelper.asyncData(resetGame));
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
        // check the content of the mocked call
        gameService.resetLeaderboard(GAMES[0]).subscribe();

        // check if only one call was made
        expect(httpClientSpy.put).toHaveBeenCalledTimes(1);
    });
});
