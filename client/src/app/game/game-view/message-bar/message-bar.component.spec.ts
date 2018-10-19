import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MessageBarComponent } from "./message-bar.component";
import { MessageComponent } from "../message/message.component";

describe("MessageBarComponent", () => {
    let component: MessageBarComponent;
    let fixture: ComponentFixture<MessageBarComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
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
