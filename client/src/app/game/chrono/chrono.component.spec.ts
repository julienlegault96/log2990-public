import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ChronoComponent } from "./chrono.component";

describe("ChronoComponent", () => {
    let component: ChronoComponent;
    let fixture: ComponentFixture<ChronoComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ChronoComponent]
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
});
