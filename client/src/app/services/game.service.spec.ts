import { TestBed, inject } from "@angular/core/testing";
import { TestHelper } from "../../test.helper";
import { GameService } from "./game.service";
import { Game } from "../../../../common/game/game";
import { GAMES } from "../../../../common/game/mock-games";
import { HttpClientModule } from "@angular/common/http";

// tslint:disable-next-line:no-any Used to mock the http call
let httpClientSpy: any;
let gameService: GameService;

describe("GameService", () => {
    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj("HttpClient", ["get"]);
        gameService = new GameService(httpClientSpy);
        TestBed.configureTestingModule({
            providers: [GameService],
            imports: [HttpClientModule]
        });
    });

    it("should be created", inject([GameService], (service: GameService) => {
        expect(service).toBeTruthy();
    }));

    it("should return expected message (HttpClient called once)", () => {
        httpClientSpy.get.and.returnValue(TestHelper.asyncData(GAMES));

        // check the content of the mocked call
        gameService.getGames().subscribe(
            (games: Game[]) => {
                expect(games).toEqual(jasmine.any([]));
                expect(games).toEqual(GAMES, "games check");
            },
            fail
        );

        // check if only one call was made
        expect(httpClientSpy.get.calls.count()).toBe(1, "one call");
    });
});
