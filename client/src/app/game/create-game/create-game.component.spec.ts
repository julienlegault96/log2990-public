import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CreateGameComponent } from "./create-game.component";
import { GameService } from "../../services/game.service";
import { CreateGameService } from "../../services/create-game.service";

describe("CreateGameComponent", () => {
    let component: CreateGameComponent;
    let fixture: ComponentFixture<CreateGameComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CreateGameComponent],
            providers: [
                GameService,
                CreateGameService
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateGameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
