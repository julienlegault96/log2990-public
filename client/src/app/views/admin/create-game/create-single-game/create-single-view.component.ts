import { Component } from "@angular/core";

import { CreateGameService } from "../../../../services/create-game/create-game.service";
import { CreateGameComponent } from "../create-game.component";

@Component({
    selector: "app-create-single-view",
    templateUrl: "./create-single-view.component.html",
})

export class CreateSingleViewComponent extends CreateGameComponent {

    public rawImageMessage: string;
    public modifiedImageMessage: string;

    private rawImage: File | null;
    private modifiedImage: File | null;

    public isCreating: boolean;

    public constructor(createGameService: CreateGameService) {
        super(createGameService);
        this.updateRawImageMessage();
        this.updateModifiedImageMessage();

        this.isCreating = false;
    }

    public submit(): void {
        if (!this.isValidInputList()) {
            alert("Erreur(s) dans le formulaire");

            return;
        }

        this.isCreating = true;
        const imageList: Array<File> = this.getImageListForSubmit();
        this.createGameService.submitSingle(this.name, imageList)
            .then(() => {
                this.isCreating = false;
            });
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

        return this.createGameService.isValidSingleViewInputList(this.name, imageList);
    }

    private getImageList(): Array<File | null> {
        return Array(this.rawImage, this.modifiedImage);
    }

    private updateRawImageMessage(filename?: string): void {
        this.rawImageMessage = this.getFilenameMessage(filename);
    }

    private updateModifiedImageMessage(filename?: string): void {
        this.modifiedImageMessage = this.getFilenameMessage(filename);
    }

    private getFilenameMessage(filename: string | undefined): string {
        return (filename ? filename : "Choisir un fichier");
    }

}
