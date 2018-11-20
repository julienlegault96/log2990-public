import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { UserComponent } from "./user/user.component";
import { HomePageComponent } from "./home-page.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { RouterTestingModule } from "@angular/router/testing";
import { SocketService } from "src/app/services/socket/socket.service";

describe("HomePageComponent", () => {
    let component: HomePageComponent;
    let fixture: ComponentFixture<HomePageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HomePageComponent, UserComponent],
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
        fixture = TestBed.createComponent(HomePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
