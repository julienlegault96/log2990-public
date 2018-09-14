import { GameService } from './game.service';

import { Game } from "../../../../common/game/game";
import { TestHelper } from "../../test.helper";

// tslint:disable-next-line:no-any Used to mock the http call
let httpClientSpy: any;
let gameService: GameService;

describe('GameService', () => {
    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj("HttpClient", ["get"]);
        gameService = new GameService(httpClientSpy);
    });

    it("should return expected message (HttpClient called once)", () => {
        const expectedGames: Game[] = [
            {
                "type": 1,
                "title": "DoubleViewGame 1",
                "imageUrl": ["https://www.techworm.net/wp-content/uploads/2018/03/google-is-shutting-down-URL-shortner-service-Goo.gl_.png"],
                "leaderboards": [
                    {
                        "title": "Solo",
                        "times": [54, 66, 89]
                    },
                    {
                        "title": "One versus One",
                        "times": [33, 144, 200]
                    }
                ]
            }
        ];

        httpClientSpy.get.and.returnValue(TestHelper.asyncData(expectedGames));

        // check the content of the mocked call
        gameService.getGames().subscribe(
            (games: Game[]) => {
                expect(games).toEqual(jasmine.any([]));
                expect(games).toEqual(expectedGames, "games check");
            },
            fail
        );

        // check if only one call was made
        expect(httpClientSpy.get.calls.count()).toBe(1, "one call");
    });
});
