import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { UserService } from "src/app/services/user/user.service";
import { SocketService } from "src/app/services/socket/socket.service";

import { WaitingViewComponent } from "./waiting-view.component";
import { HttpClientModule } from "@angular/common/http";

describe("WaitingViewComponent", () => {
    let component: WaitingViewComponent;
    let fixture: ComponentFixture<WaitingViewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [WaitingViewComponent],
            providers: [
                UserService,
                SocketService
            ],
            imports: [
                FontAwesomeModule,
                HttpClientModule,
                RouterTestingModule.withRoutes([]),
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WaitingViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
