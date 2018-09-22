// tslint:disable:no-any les attributs sont des types any
// tslint:disable:no-floating-promises pour le before each
import { TestBed, async, ComponentFixture } from "@angular/core/testing";
import { AppComponent } from "./app.component";
import { HttpClientModule } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";
import { SoloGameComponent } from "./game/solo-game/solo-game.component";
import { ChronoComponent } from "./game/chrono/chrono.component";
import { UserComponent } from "./User/user-component/user.component";
import { AbstractServerService } from "./services/abstract-server.service";
import { GameListComponent } from "./game/game-list-menu/game-list/game-list.component";
import { GameCardComponent } from "./game/game-list-menu/game-card/game-card.component";
import { LeaderboardComponent } from "./game/game-list-menu/leaderboard/leaderboard.component";
import { CreateGameComponent } from "./game/create-game/create-game.component";
import { GameService } from "./services/game.service";
import { CreateGameService } from "./services/create-game.service";
import { FormsModule } from "@angular/forms";

describe("AppComponent", () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent,
                SoloGameComponent,
                ChronoComponent,
                GameListComponent,
                GameCardComponent,
                LeaderboardComponent,
                UserComponent,
                CreateGameComponent,
            ],
            imports: [
                HttpClientModule,
                RouterTestingModule,
                FormsModule,
            ],
            providers: [
                AbstractServerService,
                GameService,
                CreateGameService,
            ]
        }).compileComponents();
    }));
    it("should create the app", async(() => {
        const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(AppComponent);
        const app: any = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));
});
