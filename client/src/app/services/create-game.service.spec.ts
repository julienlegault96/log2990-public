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

    it("should reject empty name", inject([CreateGameService], (service: CreateGameService) => {
        expect(service.isValidName("")).toBe(false);
    }));

    it("should reject name with over 20 char", inject([CreateGameService], (service: CreateGameService) => {
        expect(service.isValidName("123456789012345678901")).toBe(false);
    }));

    it("should accept name between 0 and 21 char", inject([CreateGameService], (service: CreateGameService) => {
        expect(service.isValidName("1234567890")).toBe(true);
    }));

    it("should return name max length (20)", inject([CreateGameService], (service: CreateGameService) => {
        const nameMaxLength: number = 20;
        expect(service.getNameMaxLength()).toBe(nameMaxLength);
    }));

    it("should reject invalid images", inject([CreateGameService], (service: CreateGameService) => {
        const file: File = new File(new Array<Blob>(), "image.jpg");
        const files: Array<File> = new Array<File>(file, file);
        expect(service.isValidInputList("Nouveau Jeu", files)).toBe(false);
    }));

    it("should reject invalid name", inject([CreateGameService], (service: CreateGameService) => {
        const file: File = new File(new Array<Blob>(), "image.bmp");
        const files: Array<File> = new Array<File>(file, file);
        expect(service.isValidInputList("123456789012345678901", files)).toBe(false);
    }));

    it("should reject invalid inputs", inject([CreateGameService], (service: CreateGameService) => {
        const file: File = new File(new Array<Blob>(), "image.jpg");
        const files: Array<File> = new Array<File>(file, file);
        expect(service.isValidInputList("123456789012345678901", files)).toBe(false);
    }));

    it("should accept valid inputs", inject([CreateGameService], (service: CreateGameService) => {
        const file: File = new File(new Array<Blob>(), "image.bmp");
        const files: Array<File> = new Array<File>(file, file);
        expect(service.isValidInputList("Nouveau Jeu", files)).toBe(true);
    }));
});
