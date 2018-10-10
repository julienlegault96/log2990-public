import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SoloGameComponent } from "./solo-game.component";
import { ChronoComponent } from "../chrono/chrono.component";
import { DiffCounterComponent } from "../diff-counter/diff-counter.component";

describe("SoloGameComponent", () => {
    let component: SoloGameComponent;
    let fixture: ComponentFixture<SoloGameComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                SoloGameComponent,
                ChronoComponent,
                DiffCounterComponent,
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SoloGameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
