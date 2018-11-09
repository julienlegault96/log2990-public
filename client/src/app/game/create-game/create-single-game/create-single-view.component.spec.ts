import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { CreateSingleViewComponent } from "./create-single-view.component";
import { GameService } from "../../../services/game.service";
import { CreateGameService } from "../../../services/create-game.service";

describe("CreateGameComponent", () => {
    let component: CreateSingleViewComponent;
    let fixture: ComponentFixture<CreateSingleViewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CreateSingleViewComponent],
            imports: [
                FormsModule,
                HttpClientModule,
            ],
            providers: [
                GameService,
                CreateGameService
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateSingleViewComponent);
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

    it("should reject no rawImage", () => {
        component.setRawImage(new Event("change"));
        expect(component.rawImageMessage).toBe("Choisir un fichier");
    });

    it("should reject no modifiedImage", () => {
        component.modifiedImageMessage = "Message modifie";
        component.setModifiedImage(new Event("change"));
        expect(component.modifiedImageMessage).toBe("Choisir un fichier");
    });

    it("should reject wrong rawImage format", () => {
        component.rawImageMessage = "Message modifie";
        const eventTarget: EventTarget = new EventTarget();

        const event: Event = Object.create(Event.prototype);
        Object.defineProperty(event, "target", eventTarget);

        component.setRawImage(event);
        expect(component.rawImageMessage).toBe("Choisir un fichier");
    });

    it("should reject wrong modifiedImage format", () => {
        component.modifiedImageMessage = "Message modifie";
        const eventTarget: EventTarget = new EventTarget();

        const event: Event = Object.create(Event.prototype);
        Object.defineProperty(event, "target", eventTarget);

        component.setModifiedImage(event);
        expect(component.modifiedImageMessage).toBe("Choisir un fichier");
    });

});
