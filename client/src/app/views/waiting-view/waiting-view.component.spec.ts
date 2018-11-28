import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { WaitingViewComponent } from "./waiting-view.component";

describe("HomePageComponent", () => {
    let component: WaitingViewComponent;
    let fixture: ComponentFixture<WaitingViewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [WaitingViewComponent],
            providers: [ ],
            imports: [
                FontAwesomeModule,
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
