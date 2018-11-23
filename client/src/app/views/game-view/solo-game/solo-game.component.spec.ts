import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SoloGameComponent } from "./solo-game.component";
import { ChronoComponent } from "../chrono/chrono.component";
import { DiffCounterComponent } from "../diff-counter/diff-counter.component";
import { ImgDiffService } from "src/app/services/img-diff/img-diff.service";
import { ImageDiffComponent } from "../image-diff/image-diff.component";
import { HttpClientModule } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";
import { LeaderboardService } from "src/app/services/leaderboard/leaderboard.service";

describe("SoloGameComponent", () => {
    let component: SoloGameComponent;
    let fixture: ComponentFixture<SoloGameComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                SoloGameComponent,
                ChronoComponent,
                DiffCounterComponent,
                ImageDiffComponent,
            ],
            providers: [
                ImgDiffService,
                LeaderboardService,
            ],
            imports: [
                HttpClientModule,
                RouterTestingModule,
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
