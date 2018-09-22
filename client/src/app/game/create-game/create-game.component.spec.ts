import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { CreateGameComponent } from "./create-game.component";
import { GameService } from "../../services/game.service";
import { CreateGameService } from "../../services/create-game.service";

describe("CreateGameComponent", () => {
    let component: CreateGameComponent;
    let fixture: ComponentFixture<CreateGameComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CreateGameComponent],
            imports: [
                FormsModule,
                HttpClientModule,
            ],
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

    it("should accept empty names", () => {
        component.name = "";
        expect(component.isValidName(new Event("change"))).toBe(true);
    });

    it("should accept names with less than 21 char", () => {
        component.name = "Username";
        expect(component.isValidName(new Event("change"))).toBe(true);
    });

    it("should accept names with 20 char", () => {
        component.name = "12345678901234567890";
        expect(component.isValidName(new Event("change"))).toBe(true);
    });

    it("should reject name over 20 char", () => {
        component.name = "123456789012345678901";
        expect(component.isValidName(new Event("change"))).toBe(false);
    });
});
