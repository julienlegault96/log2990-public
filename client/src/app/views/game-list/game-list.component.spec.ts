import { TestBed, ComponentFixture, fakeAsync, tick } from "@angular/core/testing";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";
import { TestHelper } from "../../../test.helper";

import { GameType } from "../../../../../common/game/game-type";
import { GAMES, SINGLE_VIEW_GAME_COUNT, DOUBLE_VIEW_GAME_COUNT } from "../../../../../common/game/mock-games";

import { GameListComponent } from "./game-list.component";
import { GameCardComponent } from "./game-card/game-card.component";
import { LeaderboardComponent } from "./leaderboard/leaderboard.component";

import { GameService } from "../../services/game/game.service";
import { SocketService } from "src/app/services/socket/socket.service";
import { UserService } from "src/app/services/user/user.service";
import { MessageService } from "src/app/services/message/message.service";

describe("GameListComponent", () => {
    let component: GameListComponent;
    let fixture: ComponentFixture<GameListComponent>;
    let httpClientSpy: jasmine.SpyObj<HttpClient>;
    let gameService: GameService;
    let socketServiceSpy: jasmine.SpyObj<SocketService>;

    let userServiceSpy: UserService;

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj("HttpClient", ["get", "pipe", "detectChanges"]);
        httpClientSpy.get.and.callFake(() => TestHelper.asyncData(null));
        gameService = new GameService(httpClientSpy);
        socketServiceSpy = jasmine.createSpyObj("SocketService", ["registerFunction"]);

        userServiceSpy = new UserService(httpClientSpy, socketServiceSpy);

        TestBed.configureTestingModule({
            declarations: [
                GameListComponent,
                GameCardComponent,
                LeaderboardComponent,
            ],
            providers: [
                { provide: GameService, useValue: gameService },
                { provide: SocketService, useValue: socketServiceSpy },
                { provide: UserService, useValue: userServiceSpy },
                MessageService
            ],
            imports: [
                HttpClientModule,
                RouterTestingModule,
            ]
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

        expect(component.singleViewGames.length).toEqual(SINGLE_VIEW_GAME_COUNT.valueOf());
        for (const singleViewGame of component.singleViewGames) {
            expect(singleViewGame.type).toEqual(GameType.SingleView);
        }

        expect(component.doubleViewGames.length).toEqual(DOUBLE_VIEW_GAME_COUNT.valueOf());
        for (const doubleViewGame of component.doubleViewGames) {
            expect(doubleViewGame.type).toEqual(GameType.DoubleView);
        }

    }));
});
