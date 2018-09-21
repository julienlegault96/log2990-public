import { Component, OnInit } from '@angular/core';

import { CreateGameService } from './create-game.service';

@Component({
    selector: 'app-create-game',
    templateUrl: './create-game.component.html',
    styleUrls: ['./create-game.component.css']
})
export class CreateGameComponent implements OnInit {

    public name: String;
    public rawImage: File;
    public modifiedImage: File;

    public rawImageMessage: string;
    public modifiedImageMessage: string;
    
    private createGameService: CreateGameService;

    constructor(createGameService: CreateGameService) {
        this.rawImageMessage = "Choisir un fichier";
        this.modifiedImageMessage = "Choisir un fichier";
    }

    ngOnInit() {
    }

    public submit(): void {
        if (!this.isValidInputList()) {
            alert("Erreur(s) dans le formulaire");
            return;
        }

    }

    private isValidInputList(): boolean {
        return this.isValidName()
            && this.isValidInputImageList();
    }

    private isValidName(): boolean {
        return this.name
            && this.name.length >= 1
            && this.name.length <= 20;
    }

    private isValidInputImageList(): boolean {
        return this.isValidImage(this.rawImage)
            && this.isValidImage(this.modifiedImage);
    }

    private isValidImage(image: File): boolean {
        return String(image).indexOf(".bmp") != -1;
    }

    public updateRawImageMessage(): void {
        this.rawImageMessage = "Fichier sélectionné";
    }

    public updateModifiedImageMessage(): void {
        this.modifiedImageMessage = "Fichier sélectionné";
    }

}
