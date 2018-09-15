import { GameService } from './game.service';

import { Game } from "../../../../common/game/game";
import { GameType } from '../../../../common/game/game-type';
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
        const returnedGames: Game[] = [
            {
                "type": GameType.DoubleView,
                "title": "DoubleViewGame 1",
                "imageUrl": ["double-view-game-1.bmp"],
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
});
