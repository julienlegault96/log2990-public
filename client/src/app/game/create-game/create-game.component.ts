import { Component } from "@angular/core";

import { CreateGameService } from "../../services/create-game.service";

@Component({
    selector: "app-create-game",
    templateUrl: "./create-game.component.html",
})

export class CreateGameComponent {

    public name: string;
    private rawImage: File | null;
    private modifiedImage: File | null;

    public rawImageMessage: string;
    public modifiedImageMessage: string;

    public constructor(private createGameService: CreateGameService) {
        this.name = "";
        this.updateRawImageMessage();
        this.updateModifiedImageMessage();
    }

    public submit(): void {
        if (!this.isValidInputList()) {
            alert("Erreur(s) dans le formulaire");

            return;
        }
        const imageList: Array<File> = this.getImageListForSubmit();
        this.createGameService.submit(this.name, imageList);
    }

    public setRawImage(event: Event): void {
        const target: HTMLInputElement = event.target as HTMLInputElement;
        if (this.isValidImageTarget(target)) {
            this.rawImage = target.files ? target.files[0] : null;
        }
        this.updateRawImageMessage(this.rawImage ? this.rawImage.name : undefined);
    }

    public setModifiedImage(event: Event): void {
        const target: HTMLInputElement = event.target as HTMLInputElement;
        if (this.isValidImageTarget(target)) {
            this.modifiedImage = target.files ? target.files[0] : null;
        }
        this.updateModifiedImageMessage(this.modifiedImage ? this.modifiedImage.name : undefined);
    }

    public isValidName(event: Event): boolean {
        // empty names should be valid
        return this.name.length === 0
                || this.createGameService.validator.isStandardStringLength(this.name);
    }

    private getImageListForSubmit(): File[] {
        return this.getImageList().map((elem: File | null) => elem as File);
    }

    private isValidImageTarget(target: HTMLInputElement): boolean {
        return target != null
            && target.files != null
            && target.files.length > 0;
    }

    private isValidInputList(): Boolean {
        if (this.getImageList().some((elem: File | null) => elem === null)) {
            return false;
        }
        const imageList: Array<File> = this.getImageList().map((elem: File | null) => elem as File);

        return this.createGameService.isValidInputList(this.name, imageList);
    }

    private getImageList(): Array<File | null> {
        return Array(this.rawImage, this.modifiedImage);
    }

    private updateRawImageMessage(filename?: string): void {
        this.rawImageMessage = (filename ? filename : "Choisir un fichier");
    }

    private updateModifiedImageMessage(filename?: string): void {
        this.modifiedImageMessage = (filename ? filename : "Choisir un fichier");
    }

}
