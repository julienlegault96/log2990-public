import { Injectable } from "@angular/core";

import { GameService } from "./game.service";
import { Game, newGameTemplate } from "../../../../common/game/game";
import { GameType } from "../../../../common/game/game-type";

@Injectable()
export class CreateGameService extends GameService {

    private readonly nameMinLength: number = 1;
    private readonly nameMaxLength: number = 20;
    private readonly imageFileExtension: string = ".bmp";

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

    public isValidInputList(name: String, images: File[]): boolean {
        return this.isValidName(name)
            && this.isValidInputImageList(images);
    }

    public isValidName(name: String): boolean {
        return Boolean(name)
            && name.length >= this.nameMinLength
            && name.length <= this.nameMaxLength;
    }

    public getNameMaxLength(): number {
        return this.nameMaxLength;
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
            if (!this.isValidImage(image)) {
                return false;
            }
        }

        return true;
    }

    private isValidImage(image: File): boolean {
        return image != null
            && String(image.name).indexOf(this.imageFileExtension) !== -1;
    }
}
