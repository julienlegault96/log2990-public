import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { CreateGameComponent } from "./create-game.component";
import { GameService } from "../../services/game.service";
import { CreateGameService } from "../../services/create-game.service";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

describe("CreateGameComponent", () => {
    let component: CreateGameComponent;
    let fixture: ComponentFixture<CreateGameComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CreateGameComponent],
            imports: [
                FormsModule,
                HttpClientModule,
                FontAwesomeModule,
            ],
            providers: [
                GameService,
                CreateGameService
            ],
        }).compileComponents();
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

    // // Non fonctionnel
    // it("should accept .bmp rawImage", () => {
    //     const filename: string = "image.bmp";

    //     const files: FileList = {
    //         length: 1,
    //         item: () => ({
    //             name: filename,
    //             lastModified: 1,
    //             size: 1,
    //             type: "bmp",
    //             slice: () => (new Blob()),
    //         }),
    //     };

    //     const htmlInputElement: HTMLInputElement = Object.create(HTMLInputElement.prototype);
    //     Object.defineProperty(htmlInputElement, "files", files);

    //     // Impossible de definir un fichier en modifiant l'attribut
    //     const event: Event = Object.create(Event.prototype);
    //     Object.defineProperty(event, "target", htmlInputElement);

    //     component.setRawImage(event);
    //     expect(component.rawImageMessage).toBe(filename);
    // });

    // // Non fonctionnel
    // it("should accept .bmp modifiedImage", () => {
    //     const filename: string = "image.bmp";

    //     const files: FileList = {
    //         length: 1,
    //         item: () => ({
    //             name: filename,
    //             lastModified: 1,
    //             size: 1,
    //             type: "bmp",
    //             slice: () => (new Blob()),
    //         }),
    //     };

    //     const htmlInputElement: HTMLInputElement = Object.create(HTMLInputElement.prototype);
    //     Object.defineProperty(htmlInputElement, "files", files);

    //     // Impossible de definir un fichier en modifiant l'attribut
    //     const event: Event = Object.create(Event.prototype);
    //     Object.defineProperty(event, "target", htmlInputElement);

    //     component.setModifiedImage(event);
    //     expect(component.modifiedImageMessage).toBe(filename);
    // });
});
