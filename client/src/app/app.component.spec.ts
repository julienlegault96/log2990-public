// tslint:disable:no-any les attributs sont des types any
import { TestBed, ComponentFixture, fakeAsync } from "@angular/core/testing";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { TestHelper } from "src/test.helper";

import { AppComponent } from "./app.component";
import { SoloGameComponent } from "./views/game-view/solo-game/solo-game.component";
import { MultiplayerGameComponent } from "./views/game-view/multiplayer-game/multiplayer-game.component";
import { ChronoComponent } from "./views/game-view/chrono/chrono.component";
import { UserComponent } from "./views/home-page/user/user.component";
import { HomePageComponent } from "./views/home-page/home-page.component";
import { GameListComponent } from "./views/game-list/game-list.component";
import { GameCardComponent } from "./views/game-list/game-card/game-card.component";
import { ImageDiffComponent } from "./views/game-view/image-diff/image-diff.component";
import { ImgDiffService } from "./services/img-diff/img-diff.service";
import { DiffCounterComponent } from "./views/game-view/diff-counter/diff-counter.component";
import { LeaderboardComponent } from "./views/game-list/leaderboard/leaderboard.component";
import { GameViewComponent } from "./views/game-view/game-view.component";
import { MessageBarComponent } from "./views/message-bar/message-bar.component";
import { MessageComponent } from "./views/message-bar/message/message.component";
import { AdminViewComponent } from "./views/admin/admin-view.component";
import { AdminViewCardComponent } from "./views/admin/admin-view-card/admin-view-card.component";
import { CreateMultipleViewComponent } from "./views/admin/create-game/create-multiple-view/create-multiple-view.component";
import { CreateSingleViewComponent } from "./views/admin/create-game/create-single-game/create-single-view.component";

import { GameService } from "./services/game/game.service";
import { CreateGameService } from "./services/create-game/create-game.service";
import { MessageService } from "./services/message/message.service";
import { SocketService } from "./services/socket/socket.service";
import { UserService } from "./services/user/user.service";

describe("AppComponent", () => {
    let socketServiceSpy: jasmine.SpyObj<SocketService>;
    let httpClientSpy: jasmine.SpyObj<HttpClient>;
    let neuteredUserService: UserService;
    let neuteredGameService: GameService;

    // tslint:disable-next-line:max-func-body-length
    beforeEach(fakeAsync(() => {
        socketServiceSpy = jasmine.createSpyObj("SocketService", ["registerFunction"]);

        httpClientSpy = jasmine.createSpyObj("HttpClient", ["get", "post", "delete"]);
        httpClientSpy.get.and.callFake(() => TestHelper.asyncData(null));
        httpClientSpy.post.and.callFake(() => TestHelper.asyncData(null));
        httpClientSpy.delete.and.callFake(() => TestHelper.asyncData(null));

        neuteredUserService = new UserService(httpClientSpy, socketServiceSpy);
        neuteredGameService = new GameService(httpClientSpy);

        TestBed.configureTestingModule({
            declarations: [
                AppComponent,
                SoloGameComponent,
                MultiplayerGameComponent,
                ChronoComponent,
                GameListComponent,
                GameCardComponent,
                GameViewComponent,
                MessageBarComponent,
                MessageComponent,
                UserComponent,
                LeaderboardComponent,
                HomePageComponent,
                DiffCounterComponent,
                AdminViewComponent,
                AdminViewCardComponent,
                ImageDiffComponent,
                CreateMultipleViewComponent,
                CreateSingleViewComponent,
            ],
            imports: [
                HttpClientModule,
                RouterTestingModule,
                FormsModule,
                FontAwesomeModule,
            ],
            providers: [
                { provide: UserService, useValue: neuteredUserService },
                { provide: GameService, useValue: neuteredGameService },
                CreateGameService,
                ImgDiffService,
                MessageService,
                { provide: SocketService, useValue: socketServiceSpy },
            ]
        }).compileComponents();
    }));

    it("should create the app", fakeAsync(() => {
        const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(AppComponent);
        const app: any = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));
});
