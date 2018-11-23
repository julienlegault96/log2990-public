import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MessageBarComponent } from "./message-bar.component";
import { MessageComponent } from "./message/message.component";
import { SocketService } from "src/app/services/socket/socket.service";
import { MessageService } from "src/app/services/message/message.service";
import { LeaderboardService } from "src/app/services/leaderboard/leaderboard.service";
import { HttpClientModule } from "@angular/common/http";

describe("MessageBarComponent", () => {
    let component: MessageBarComponent;
    let fixture: ComponentFixture<MessageBarComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                SocketService,
                MessageService,
                LeaderboardService,
            ],
            declarations: [
                MessageBarComponent,
                MessageComponent,
            ],
            imports: [
                HttpClientModule,
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MessageBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
