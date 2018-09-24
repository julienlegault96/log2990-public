import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { GameCardComponent } from "./game-card.component";
import { LeaderboardComponent } from "../leaderboard/leaderboard.component";
import { GAMES } from "../../../../../../common/game/mock-games";
import { GameService } from "../../../services/game.service";
import { TestHelper } from "../../../../test.helper";

describe("GameCardComponent", () => {
    let component: GameCardComponent;
    let fixture: ComponentFixture<GameCardComponent>;
    // tslint:disable-next-line:no-any Used to mock the http call
    let httpClientSpy: any;
    let gameService: GameService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GameCardComponent,
                           LeaderboardComponent],
            providers: [{ provide: GameService, useValue: gameService }]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj("HttpClient", ["get"]);
        httpClientSpy.get.and.returnValue(TestHelper.asyncData(GAMES));
        gameService = new GameService(httpClientSpy);

        fixture = TestBed.createComponent(GameCardComponent);
        component = fixture.componentInstance;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("game should change on input", () => {
        component.game = GAMES[0];
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector("h4").innerText).toEqual(GAMES[0].title);
    });
});