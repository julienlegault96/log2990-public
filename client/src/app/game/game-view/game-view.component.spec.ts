import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { GameViewComponent } from "./game-view.component";
import { ChronoComponent } from "./chrono/chrono.component";
import { MessageBarComponent } from "./message-bar/message-bar.component";
import { SoloGameComponent } from "./solo-game/solo-game.component";
import { MessageComponent } from "./message/message.component";
import { DiffCounterComponent } from "./diff-counter/diff-counter.component";

describe("SoloGameComponent", () => {
    let component: GameViewComponent;
    let fixture: ComponentFixture<GameViewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                GameViewComponent,
                ChronoComponent,
                MessageBarComponent,
                MessageComponent,
                SoloGameComponent,
                DiffCounterComponent
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GameViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
