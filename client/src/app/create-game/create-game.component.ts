import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-create-game',
    templateUrl: './create-game.component.html',
    styleUrls: ['./create-game.component.css']
})
export class CreateGameComponent implements OnInit {

    public rawImageMessage: string;
    public modifiedImageMessage: string;

    constructor() {
        this.rawImageMessage = "Choisir un fichier";
        this.modifiedImageMessage = "Choisir un fichier";
    }

    ngOnInit() {
    }

}
