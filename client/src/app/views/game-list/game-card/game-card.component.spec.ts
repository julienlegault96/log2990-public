import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { TestHelper } from "../../../../test.helper";

import { GAMES } from "../../../../../../common/game/mock-games";

import { GameService } from "../../../services/game/game.service";
import { SocketService } from "src/app/services/socket/socket.service";
import { MessageService } from "src/app/services/message/message.service";

import { GameCardComponent } from "./game-card.component";
import { LeaderboardComponent } from "../leaderboard/leaderboard.component";

describe("GameCardComponent", () => {
    let component: GameCardComponent;
    let fixture: ComponentFixture<GameCardComponent>;
    let httpClientSpy: jasmine.SpyObj<HttpClient>;
    let gameService: GameService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                GameCardComponent,
                LeaderboardComponent,
            ],
            providers: [
                { provide: GameService, useValue: gameService },
                SocketService,
                MessageService
            ],
            imports: [
                RouterTestingModule,
                HttpClientModule,
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj("HttpClient", ["get"]);
        httpClientSpy.get.and.callFake(() => TestHelper.asyncData(GAMES));
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
