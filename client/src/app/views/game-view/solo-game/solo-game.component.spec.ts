import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";

import { SoloGameComponent } from "./solo-game.component";
import { ChronoComponent } from "../chrono/chrono.component";
import { DiffCounterComponent } from "../diff-counter/diff-counter.component";
import { ImageDiffComponent } from "../image-diff/image-diff.component";

import { ImgDiffService } from "src/app/services/img-diff/img-diff.service";
import { LeaderboardService } from "src/app/services/leaderboard/leaderboard.service";
import { SocketService } from "src/app/services/socket/socket.service";
import { MessageService } from "src/app/services/message/message.service";

describe("SoloGameComponent", () => {
    let component: SoloGameComponent;
    let fixture: ComponentFixture<SoloGameComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                SoloGameComponent,
                ChronoComponent,
                DiffCounterComponent,
                ImageDiffComponent
            ],
            providers: [
                ImgDiffService,
                LeaderboardService,
                SocketService,
                MessageService
            ],
            imports: [
                HttpClientModule,
                RouterTestingModule
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SoloGameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
