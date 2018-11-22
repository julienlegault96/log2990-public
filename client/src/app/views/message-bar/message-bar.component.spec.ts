import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MessageBarComponent } from "./message-bar.component";
import { MessageComponent } from "./message/message.component";
import { SocketService } from "src/app/services/socket/socket.service";

describe("MessageBarComponent", () => {
    let component: MessageBarComponent;
    let fixture: ComponentFixture<MessageBarComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                SocketService
            ],
            declarations: [
                MessageBarComponent,
                MessageComponent
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
