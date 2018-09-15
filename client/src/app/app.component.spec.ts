// tslint:disable:no-any les attributs sont des types any
// tslint:disable:no-floating-promises pour le before each
import { TestBed, async, ComponentFixture } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { AbstractServerService } from "./abstract-server.service";
import { GameListComponent } from "./game-list-menu/game-list/game-list.component";
import { GameCardComponent } from "./game-list-menu/game-card/game-card.component";
import { LeaderboardComponent } from "./game-list-menu/leaderboard/leaderboard.component";

describe("AppComponent", () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent,
                GameListComponent,
                GameCardComponent,
                LeaderboardComponent
            ],
            imports: [
                HttpClientModule,
            ],
            providers: [AbstractServerService]
        }).compileComponents();
    }));

    it("should create the app", async(() => {
        const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(AppComponent);
        const app: any = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));
});
