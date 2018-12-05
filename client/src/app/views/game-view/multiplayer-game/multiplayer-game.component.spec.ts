import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";

import { MultiplayerGameComponent } from "./multiplayer-game.component";
import { ChronoComponent } from "../chrono/chrono.component";
import { DiffCounterComponent } from "../diff-counter/diff-counter.component";
import { ImageDiffComponent } from "../image-diff/image-diff.component";

import { ImgDiffService } from "src/app/services/img-diff/img-diff.service";
import { LeaderboardService } from "src/app/services/leaderboard/leaderboard.service";
import { SocketService } from "src/app/services/socket/socket.service";

describe("MultiplayerGameComponent", () => {
    let component: MultiplayerGameComponent;
    let fixture: ComponentFixture<MultiplayerGameComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                MultiplayerGameComponent,
                ChronoComponent,
                DiffCounterComponent,
                ImageDiffComponent,
            ],
            providers: [
                ImgDiffService,
                LeaderboardService,
                SocketService
            ],
            imports: [
                HttpClientModule,
                RouterTestingModule,
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MultiplayerGameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
