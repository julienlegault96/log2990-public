import { TestBed, ComponentFixture, fakeAsync, tick } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";

import { TestHelper } from "../../../../test.helper";
import { GameListComponent } from "./game-list.component";
import { GameCardComponent } from "../game-card/game-card.component";
import { LeaderboardComponent } from "../leaderboard/leaderboard.component";
import { GameService } from "../../../services/game.service";

import { GameType } from "../../../../../../common/game/game-type";
import { GAMES, SINGLE_VIEW_GAME_COUNT, DOUBLE_VIEW_GAME_COUNT } from "../../../../../../common/game/mock-games";

describe("GameListComponent", () => {
    let component: GameListComponent;
    let fixture: ComponentFixture<GameListComponent>;
    // tslint:disable-next-line:no-any Used to mock the http call
    let httpClientSpy: any;
    let gameService: GameService;

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj("HttpClient", ["get"]);
        gameService = new GameService(httpClientSpy);

        TestBed.configureTestingModule({
            declarations: [
                GameListComponent,
                GameCardComponent,
                LeaderboardComponent,
            ],
            providers: [{ provide: GameService, useValue: gameService }],
            imports: [HttpClientModule]
        });

        fixture = TestBed.createComponent(GameListComponent);
        component = fixture.componentInstance;
    });

    it("should filter games", fakeAsync(() => {
        // set retrieved data onInit as the mocked data
        httpClientSpy.get.and.returnValue(TestHelper.asyncData(GAMES));

        // force onInit()
        fixture.detectChanges();

        // flush the component's setTimeout()
        tick();

        // update errorMessage within setTimeout()
        fixture.detectChanges();

        expect(component.singleViewGames.length).toEqual(SINGLE_VIEW_GAME_COUNT);
        for (const singleViewGame of component.singleViewGames) {
            expect(singleViewGame.type).toEqual(GameType.SingleView);
        }

        expect(component.doubleViewGames.length).toEqual(DOUBLE_VIEW_GAME_COUNT);
        for (const doubleViewGame of component.doubleViewGames) {
            expect(doubleViewGame.type).toEqual(GameType.DoubleView);
        }

    }));
});
