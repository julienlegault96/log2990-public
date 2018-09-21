import { Component, OnInit } from '@angular/core';

import { CreateGameService } from '../../services/create-game.service';

@Component({
    selector: 'app-create-game',
    templateUrl: './create-game.component.html',
    styleUrls: ['./create-game.component.css']
})
export class CreateGameComponent implements OnInit {

    public name: String = "";
    private rawImage: File;
    private modifiedImage: File;

    public rawImageMessage: string;
    public modifiedImageMessage: string;
    
    constructor(private createGameService: CreateGameService) {
        this.updateRawImageMessage();
        this.updateModifiedImageMessage();
    }

    ngOnInit() {
    }

    public submit(): void {
        if (!this.isValidInputList()) {
            alert("Erreur(s) dans le formulaire");
            return;
        }
        this.createGameService.submit(this.name, this.getImageList());
    }

    public setRawImage(event: Event):void {
        let target: any | null = event.target;
        if (this.isValidImageTarget(target)) {
            this.rawImage = target.files[0];
            this.updateRawImageMessage(this.rawImage.name);
        }
        else {
            this.updateRawImageMessage();
        }
    }

    public setModifiedImage(event: Event):void {
        let target: any | null = event.target;
        if (this.isValidImageTarget(target)) {
            this.modifiedImage = target.files[0];
            this.updateModifiedImageMessage(this.modifiedImage.name);
        }
        else {
            this.updateModifiedImageMessage();
        }
    }

    public isValidName(event: Event): boolean {
        return this.name.length <= this.createGameService.getNameMaxLength();
    }

    private isValidImageTarget(target: any) {
        return target != null 
            && target.files 
            && target.files.length > 0;
    }

    private isValidInputList(): Boolean {
        return this.createGameService.isValidInputList(this.name, this.getImageList());
    }

    private getImageList(): File[] {
        return Array(this.rawImage, this.modifiedImage);
    }

    private updateRawImageMessage(filename?: string): void {
        this.rawImageMessage = (filename ? filename : "Choisir un fichier");
    }

    private updateModifiedImageMessage(filename?: string): void {
        this.modifiedImageMessage = (filename ? filename : "Choisir un fichier");
    }

}
