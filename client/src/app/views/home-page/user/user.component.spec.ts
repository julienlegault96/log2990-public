import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";

import { UserComponent } from "./user.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { RouterTestingModule } from "@angular/router/testing";
import { SocketService } from "src/app/services/socket/socket.service";

describe("UserComponent", () => {
    let component: UserComponent;
    let fixture: ComponentFixture<UserComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UserComponent],
            providers: [
                SocketService,
            ],
            imports: [
                FormsModule,
                HttpClientModule,
                FontAwesomeModule,
                RouterTestingModule.withRoutes([]),
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UserComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
