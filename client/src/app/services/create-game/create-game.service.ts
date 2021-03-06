import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { GameService } from "../game/game.service";
import { Game, generateGameTemplate } from "../../../../../common/game/game";
import { GameType } from "../../../../../common/game/game-type";
import { Validator } from "../validator/validator";
import { GenMultiParameters } from "../../../../../common/communication/gen-multi-parameters";
import { GameCreationRequest } from "../../../../../common/communication/game-creation-request";
import { MULTIPLE_VIEW_BASE_TIME, SINGLE_VIEW_BASE_TIME } from "../../../../../common/game/leaderboard";

@Injectable()

export class CreateGameService extends GameService {

    public validator: Validator;

    public constructor(http: HttpClient) {
        super(http);
        this.validator = new Validator();
    }

    public isValidSingleViewInputList(name: string, images: File[]): boolean {
        return this.validator.isStandardStringLength(name)
            && this.isValidInputImageList(images);
    }

    public async submitSingle(name: string, images: File[]): Promise<boolean> {
        if (!this.isValidSingleViewInputList(name, images)) {
            return Promise.resolve(false);
        }

        const rawImagePromise: Promise<string> = this.getBase64(images[0]);
        const modifiedImagePromise: Promise<string> = this.getBase64(images[1]);

        return new Promise<boolean>((resolve) => {
            Promise.all([rawImagePromise, modifiedImagePromise])
                .then((imageUrls) => {
                    const newGame: Game = this.generateSingleViewGame(name, imageUrls);
                    this.postSingleViewGame(newGame)
                        .subscribe(
                            () => {
                                alert("Création du jeu réussie");
                                location.reload();
                                resolve(true);
                            },
                            () => {
                                alert("Les images sont invalides");
                                resolve(false);
                            }
                        );
                });
        });
    }

    public async submitMultiple(name: string, options: GenMultiParameters): Promise<boolean> {
        const newGame: Game = this.generateMultipleViewGame(name);
        const request: GameCreationRequest = { newGame, options };

        return new Promise<boolean>((resolve) => {
            this.postMultipleViewGame(request).subscribe(
                () => {
                    alert("Création du jeu réussie");
                    location.reload();
                    resolve(true);
                },
                () => {
                    alert("Génération des images sans succès");
                    resolve(false);
                }
            );
        });
    }

    private generateSingleViewGame(name: string, imageUrls: Array<string>): Game {
        const newGame: Game = generateGameTemplate(SINGLE_VIEW_BASE_TIME);
        newGame.type = GameType.SingleView;
        newGame.title = name;
        newGame.imageUrl = [
            imageUrls[0],
            imageUrls[1]
        ];

        return newGame;
    }

    public generateMultipleViewGame(name: string): Game {
        const newGame: Game = generateGameTemplate(MULTIPLE_VIEW_BASE_TIME);
        newGame.type = GameType.DoubleView;
        newGame.title = name;

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
