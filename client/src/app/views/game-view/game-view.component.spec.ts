import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { GameViewComponent } from "./game-view.component";
import { ChronoComponent } from "./chrono/chrono.component";
import { MessageBarComponent } from "../message-bar/message-bar.component";
import { SoloGameComponent } from "./solo-game/solo-game.component";
import { MessageComponent } from "../message-bar/message/message.component";
import { DiffCounterComponent } from "./diff-counter/diff-counter.component";
import { ImageDiffComponent } from "./image-diff/image-diff.component";
import { ImgDiffService } from "src/app/services/img-diff/img-diff.service";
import { HttpClientModule } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";
import { GameService } from "src/app/services/game/game.service";
import { UserService } from "src/app/services/user/user.service";
import { LeaderboardService } from "src/app/services/leaderboard/leaderboard.service";
import { SocketService } from "src/app/services/socket/socket.service";
import { MessageService } from "src/app/services/message/message.service";

describe("GameViewComponent", () => {
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
                DiffCounterComponent,
                ImageDiffComponent,
            ],
            providers: [
                ImgDiffService,
                GameService,
                UserService,
                SocketService,
                LeaderboardService,
                MessageService,
            ],
            imports: [
                HttpClientModule,
                RouterTestingModule,
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
