// tslint:disable:no-any les attributs sont des types any
// tslint:disable:no-floating-promises pour le before each
import { TestBed, async, ComponentFixture } from "@angular/core/testing";
import { AppComponent } from "./app.component";
import { BasicService } from "./basic.service";
import { HttpClientModule } from "@angular/common/http";
import { GamesComponent } from "./game-list/games/games.component";
import { GameComponent } from "./game-list/game/game.component";
import { LeaderboardComponent } from "./game-list/leaderboard/leaderboard.component";
describe("AppComponent", () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent,
                GamesComponent,
                GameComponent,
                LeaderboardComponent
            ],
            imports: [
                HttpClientModule,
            ],
            providers: [BasicService]
        }).compileComponents();
    }));
    it("should create the app", async(() => {
        const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(AppComponent);
        const app: any = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));
    //   it(`should have as title 'client'`, async(() => {
    //     const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(AppComponent);
    //     const app: any = fixture.debugElement.componentInstance;
    //     expect(app.title).toEqual("LOG2990");
    //   }));
});
