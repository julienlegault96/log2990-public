import { Injectable } from "@angular/core";

import { GameService } from "./game.service";

import { Game, newGameTemplate } from "../../../../common/game/game";
import { GameType } from "../../../../common/game/game-type";
import { Validator } from "../validator";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";

@Injectable()

export class CreateGameService extends GameService {
    public validator: Validator;

    public constructor(http: HttpClient) {
        super(http);
        this.validator = new Validator();
    }

    public isValidInputList(name: string, images: File[]): boolean {
        return this.validator.isValidUsernameLength(name)
            && this.isValidInputImageList(images);
    }

    public submit(name: string, images: File[]): void {
        if (!this.isValidInputList(name, images)) {
            return;
        }

        const rawImagePromise: Promise<string> = this.getBase64(images[0]);
      const modifiedImagePromise: Promise<string> = this.getBase64(images[1]);
     
        Promise.all([rawImagePromise, modifiedImagePromise]).then((imageUrls) => {
            const newGame: Game = this.generateGame(name, imageUrls);
            this.addGame(newGame).subscribe((game: Game) => {
                alert("Uploaded");
            });
        });
    }
    
    private generateGame(name: string, imageUrls: Array<string>): Game {
        const newGame: Game = newGameTemplate;
        newGame.type = GameType.SingleView;
        newGame.title = name;
        newGame.imageUrl = [
            imageUrls[0],
            imageUrls[1]
        ];

        return newGame;
    }

    private getBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader: FileReader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(String(reader.result));
            reader.onerror = (error) => reject(error);
        });
    }

    private isValidInputImageList(images: File[]): boolean {
        for (const image of images) {
            if (!this.validator.isValidImage(image)) {
                return false;
            }
        }

        return true;
    }


}
