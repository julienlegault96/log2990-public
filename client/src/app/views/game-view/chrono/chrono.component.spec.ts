import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ChronoComponent } from "./chrono.component";
import { MessageService } from "src/app/services/message/message.service";
import { SocketService } from "src/app/services/socket/socket.service";
import { RouterTestingModule } from "@angular/router/testing";

describe("ChronoComponent", () => {
    let component: ChronoComponent;
    let fixture: ComponentFixture<ChronoComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                MessageService,
                SocketService
            ],
            declarations: [ChronoComponent],
            imports: [
                RouterTestingModule.withRoutes([])
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ChronoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should write 00:00 at start", () => {
        expect(component.formattedTime).toBe("00:00");
    });

    it("should show 1 second after 1 second", async () => {
        const oneSecond: number = 1000;
        component.start();
        setTimeout(() => {
            component.stop();
            expect(component.formattedTime).toBe("00:01");
            // tslint:disable-next-line:align
        }, oneSecond);
    });

});
