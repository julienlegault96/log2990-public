import { Injectable } from "@angular/core";

import { GameService } from "./game.service";
import { Game } from "../../../../common/game/game";
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

        Promise.all([rawImagePromise, modifiedImagePromise]).then((values) => {
            const newGame: Game = {
                "type": GameType.SingleView, "title": name, "imageUrl": [values[0], values[1]], "leaderboards": [{
                    "title": "Solo", "scores": [{ "username": "Username1", "time": 34 }, {
                        "username": "Username2", "time": 46
                    },                          {
                        "username": "Username3", "time": 67
                    }, ]
                },                                                                                               {
                    "title": "1 vs 1", "scores": [{
                        "username": "Username11", "time": 15
                    },                            {
                        "username": "Username22", "time": 25
                    },                            { "username": "Username33", "time": 35 },
                    ]
                }
                ]
            };
            this.addGame(newGame).subscribe((game: Game) => {
                alert("Uploaded");
            });
        });
    }

    private getBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader: FileReader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(String(reader.result));
            reader.onerror = (error) => reject(error);
        });
    }

    public isValidInputList(name: String, images: File[]): boolean {
        return this.isValidName(name)
            && this.isValidInputImageList(images);
    }

    public isValidName(name: String): boolean {
        return name
            && name.length >= this.nameMinLength
            && name.length <= this.nameMaxLength;
    }

    public getNameMaxLength(): number {
        return this.nameMaxLength;
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
