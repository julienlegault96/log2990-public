// tslint:disable:no-any les attributs sont des types any
// tslint:disable:no-floating-promises pour le before each
import { TestBed, async, ComponentFixture } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";

import { AppComponent } from "./app.component";
import { SoloGameComponent } from "./game/game-view/solo-game/solo-game.component";
import { ChronoComponent } from "./game/game-view/chrono/chrono.component";
import { UserComponent } from "./home-page/user/user.component";
import { HomePageComponent } from "./home-page/home-page.component";
import { GameListComponent } from "./game/game-list-menu/game-list/game-list.component";
import { GameCardComponent } from "./game/game-list-menu/game-card/game-card.component";

import { AbstractServerService } from "./services/abstract-server.service";
import { GameService } from "./services/game.service";
import { CreateGameService } from "./services/create-game.service";
import { LeaderboardComponent } from "./game/game-list-menu/leaderboard/leaderboard.component";
import { DiffCounterComponent } from "./game/game-view/diff-counter/diff-counter.component";
import { GameViewComponent } from "./game/game-view/game-view.component";
import { MessageBarComponent } from "./game/game-view/message-bar/message-bar.component";
import { MessageComponent } from "./game/game-view/message/message.component";

import { AdminViewComponent } from "./admin/admin-view/admin-view.component";
import { AdminViewCardComponent } from "./admin/admin-view-card/admin-view-card.component";

import { ImageDiffComponent } from "./game/game-view/image-diff/image-diff.component";
import { ImgDiffService } from "./services/img-diff.service";
import { CreateMultipleViewComponent } from "./game/create-game/create-multiple-view/create-multiple-view.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { CreateSingleViewComponent } from "./game/create-game/create-single-game/create-single-view.component";

describe("AppComponent", () => {
    // tslint:disable-next-line:max-func-body-length
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent,
                SoloGameComponent,
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
                AbstractServerService,
                GameService,
                CreateGameService,
                ImgDiffService,
            ]
        }).compileComponents();
    }));

    it("should create the app", async(() => {
        const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(AppComponent);
        const app: any = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));
});
