import { TestBed, inject } from "@angular/core/testing";
import { TestHelper } from "../../test.helper";
import { GameService } from "./game.service";
import { defaultLeaderboards } from "../../../../common/game/leaderboard";
import { Game } from "../../../../common/game/game";
import { GAMES } from "../../../../common/game/mock-games";
import { HttpClientModule, HttpClient } from "@angular/common/http";

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
        // setup stub
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

        spyOn(httpClientSpy, "put").and.returnValue(TestHelper.asyncData(GAMES));

        // check the content of the mocked call
        gameService.resetLeaderboard(GAMES[0]).subscribe(
            (game: Game) => {
                expect(game.leaderboards[0]).toEqual(defaultLeaderboards[0]);
                expect(game.leaderboards[1]).toEqual(defaultLeaderboards[1]);
            },
            fail
        );

        // check if only one call was made
        expect(httpClientSpy.put).toHaveBeenCalledTimes(1);
    });
});
