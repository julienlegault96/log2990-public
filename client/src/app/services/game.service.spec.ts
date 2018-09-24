import { GameService } from "./game.service";
import { TestBed, inject } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { Game } from "../../../../common/game/game";
import { GameType } from "../../../../common/game/game-type";
import { TestHelper } from "../../test.helper";
import { Leaderboard, defaultLeaderboards } from "../../../../common/game/leaderboard";

// tslint:disable-next-line:no-any Used to mock the http call
let httpClientSpy: any;
let gameService: GameService;
const returnedGames: Game[] = [
    {
        "_id": 1,
        "type": GameType.DoubleView,
        "title": "DoubleViewGame 1",
        "imageUrl": ["double-view-game-1.bmp"],
        "leaderboards": [
            {
                "title": "Solo",
                "scores": [
                    {
                        username: "test",
                        time: 54
                    },
                    {
                        username: "test2",
                        time: 66
                    },
                    {
                        username: "test3",
                        time: 89
                    }
                ]
            },
            {
                "title": "One versus One",
                "scores": [
                    {
                        username: "test",
                        time: 33
                    },
                    {
                        username: "test2",
                        time: 14
                    },
                    {
                        username: "test3",
                        time: 24
                    }
                ]
            }
        ]
    }
];
describe("GameService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                GameService
            ],
            imports: [
                HttpClientModule
            ]
        });
        httpClientSpy = jasmine.createSpyObj("HttpClient", ["get", "put"]);
        gameService = new GameService(httpClientSpy);
    });

    it("should return expected message (HttpClient called once)", () => {
        httpClientSpy.get.and.returnValue(TestHelper.asyncData(returnedGames));

        // check the content of the mocked call
        gameService.getGames().subscribe(
            (games: Game[]) => {
                expect(games).toEqual(jasmine.any([]));
                expect(games).toEqual(returnedGames, "games check");
            },
            fail
        );

        // check if only one call was made
        expect(httpClientSpy.get.calls.count()).toBe(1, "one call");
    });

    it("should reset the leaderboard", () => {

        httpClientSpy.put.and.returnValue(TestHelper.asyncData(returnedGames));

        // check the content of the mocked call
        gameService.resetLeaderboard(returnedGames[0]).subscribe(
            (game: Game) => {
                expect(game.leaderboards[0]).toEqual(defaultLeaderboards[0]);
                expect(game.leaderboards[1]).toEqual(defaultLeaderboards[1]);
            },
            fail
        );

        // check if only one call was made
        expect(httpClientSpy.put.calls.count()).toBe(1, "one call");
    });
});
