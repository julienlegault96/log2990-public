import { TestBed, inject } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";

import { CreateGameService } from "./create-game.service";

describe("CreateGameService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                CreateGameService
            ],
            imports: [
                HttpClientModule
            ]
        });
    });

    it("should be created", inject([CreateGameService], (service: CreateGameService) => {
        expect(service).toBeTruthy();
    }));

    it("should reject invalid images", inject([CreateGameService], (service: CreateGameService) => {
        const file: File = new File(new Array<Blob>(), "image.jpg");
        const files: Array<File> = new Array<File>(file, file);
        expect(service.isValidSingleViewInputList("Nouveau Jeu", files)).toBe(false);
    }));

    it("should reject invalid name", inject([CreateGameService], (service: CreateGameService) => {
        const file: File = new File(new Array<Blob>(), "image.bmp");
        const files: Array<File> = new Array<File>(file, file);
        expect(service.isValidSingleViewInputList("123456789012345678901", files)).toBe(false);
    }));

    it("should reject invalid inputs", inject([CreateGameService], (service: CreateGameService) => {
        const file: File = new File(new Array<Blob>(), "image.jpg");
        const files: Array<File> = new Array<File>(file, file);
        expect(service.isValidSingleViewInputList("123456789012345678901", files)).toBe(false);
    }));

    it("should accept valid inputs", inject([CreateGameService], (service: CreateGameService) => {
        const file: File = new File(new Array<Blob>(), "image.bmp");
        const files: Array<File> = new Array<File>(file, file);
        expect(service.isValidSingleViewInputList("Nouveau Jeu", files)).toBe(true);
    }));
});
