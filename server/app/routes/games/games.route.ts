import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";

import Types from "../../types";
import { Mongo, Collections } from "../../services/mongo";
import { AbstractRoute } from "../abstract-route/abstract-route";
import { Imgur } from "../../services/imgur/imgur";

import { Game } from "../../../../common/game/game";
import { GameType } from "../../../../common/game/game-type";

import { ImgDiffRoute } from "../img-diff/imgdiff.route";
import { CODES } from "../../../../common/communication/response-codes";
import { Coordinates } from "../../../../common/game/coordinates";

import { execFile } from "child_process";
import * as util from "util";
import * as fs from "fs";
import { ErrorFinder } from "../../services/error-finder/error-finder";

@injectable()

export class GamesRoute extends AbstractRoute<Game> {

    public static readonly cachedDiffImagesMap: { [key: string]: string[]; } = {};

    private readonly ID_RANGE: number = 1000000;
    private readonly FIRST_VIEW_RAW_INDEX: number = 0;
    private readonly FIRST_VIEW_MODIFIED_INDEX: number = 1;
    private readonly FIRST_VIEW_DIFF_INDEX: number = 2;
    // private readonly SECOND_VIEW_RAW_INDEX: number = 3;
    // private readonly SECOND_VIEW_MODIFED_INDEX: number = 4;
    private readonly SECOND_VIEW_DIFF_INDEX: number = 5;

    private readonly execPath: string = "./tools/img-diff-generator.exe";
    private readonly rawImagePath: string = "./tools/rawImage.bmp";
    private readonly modifiedImagePath: string = "./tools/modifiedImage.bmp";
    private readonly outputPath: string = "./tools/output.bmp";
    private readonly b64Path: string = "./tools/output.B64";

    private readonly errorCountException: string = "errorCount";

    public constructor(@inject(Types.Mongo) mongo: Mongo) {
        super(mongo);
        this.collection = Collections.Games;
    }

    public async get(req: Request, res: Response, next: NextFunction): Promise<void> {
        res.status(CODES.OK).send(
            JSON.stringify(
                (await this.getAll()).map((game: Game) => {
                    game.imageUrl[this.FIRST_VIEW_DIFF_INDEX] = "";
                    game.imageUrl[this.SECOND_VIEW_DIFF_INDEX] = "";

                    return game;
                })
            )
        );
    }

    public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        const game: Game = await this.getOne(req.params.id);
        if (!GamesRoute.cachedDiffImagesMap[game._id] && game) {
            GamesRoute.cachedDiffImagesMap[game._id] =
                [game.imageUrl[this.FIRST_VIEW_DIFF_INDEX], game.imageUrl[this.SECOND_VIEW_DIFF_INDEX]];
        }

        res.status(CODES.OK).send(JSON.stringify(game));
    }

    public async post(req: Request, res: Response, next: NextFunction): Promise<void> {
        req.body._id = this.generateId();

        const imgurPromise: Promise<string[]> = (req.body.type === GameType.SingleView) ?
            this.singleViewUpload(req) : this.doubleViewUpload(req);

        return imgurPromise
            .then((imagesUrl: string[]) => {
                req.body.imageUrl = imagesUrl;

                return super.post(req, res, next);
            })
            .catch((error: Error) => {
                const errorCode: number = (error.message === this.errorCountException) ? CODES.BAD_REQUEST : CODES.SERVER_ERROR;
                res.status(errorCode).send("Failed to create game");
            });
    }

    private async singleViewUpload(req: Request): Promise<string[]> {
        return this.generateImageDiff(
            req.body.imageUrl[this.FIRST_VIEW_RAW_INDEX],
            req.body.imageUrl[this.FIRST_VIEW_MODIFIED_INDEX]
        ).then((imageDiff: string) => {
            const imgur: Imgur = new Imgur();
            const imgurPromise1: Promise<string> = imgur.uploadImage(req.body.imageUrl[this.FIRST_VIEW_RAW_INDEX]);
            const imgurPromise2: Promise<string> = imgur.uploadImage(req.body.imageUrl[this.FIRST_VIEW_MODIFIED_INDEX]);

            return Promise.all([
                imgurPromise1,
                imgurPromise2,
                imageDiff
            ]);
        });
    }

    // tslint:disable-next-line:max-func-body-length
    private async doubleViewUpload(req: Request): Promise<string[]> {
        // Sprint 3: Implémenter les fonctions nécessaires pour l'enregistrement du jeu
        // generate imageDifff
        // if not valid retry generate
        // 4 times
        // throw error

        let isValidCountFirstView: boolean = false;
        let isValidCountSecondView: boolean = false;
        let differenceImageFirstView: string = "";
        let differenceImageSecondView: string = "";

        const maximumTries: number = 4;
        for (let i: number = 0; i < maximumTries; i++) {
            await this.exec3DImage();
            // TODO
            await this.generateImageDiff("./path11.bmp", "./path12.bmp")
                .then((value: string) => {
                    differenceImageFirstView = value;
                    isValidCountFirstView = true;
                })
                .catch(() => {
                    isValidCountFirstView = false;
                });

            if (isValidCountFirstView) {
                await this.generateImageDiff("./path21.bmp", "./path22.bmp")
                    .then((value: string) => {
                        differenceImageSecondView = value;
                        isValidCountSecondView = true;
                    })
                    .catch(() => {
                        isValidCountSecondView = false;
                    });
            }
        }

        if (!isValidCountFirstView || !isValidCountSecondView) {
            throw new Error(this.errorCountException);
        }

        return [
            differenceImageFirstView,
            differenceImageSecondView
        ];
    }

    private async exec3DImage(): Promise<void> {
        const execPath: string = "./tools/vanilla3DObjects.exe";

        await util.promisify(execFile)(execPath).catch(console.log);
    }

    private generateId(): string {
        return Math.floor(Math.random() * this.ID_RANGE).toString();
    }

    private async generateImageDiff(rawImage: string, modifiedImage: string): Promise<string> {
        const rawBitmap: Buffer = Buffer.from(ImgDiffRoute.parseBase64(rawImage), "base64");
        await util.promisify(fs.writeFile)(this.rawImagePath, rawBitmap);

        const modifiedBitmap: Buffer = Buffer.from(ImgDiffRoute.parseBase64(modifiedImage), "base64");
        await util.promisify(fs.writeFile)(this.modifiedImagePath, modifiedBitmap);

        await util.promisify(execFile)(
            this.execPath,
            [this.rawImagePath, this.modifiedImagePath, this.outputPath]
        );

        const output: string = await this.base64_encode(this.outputPath);

        const isValidCount: boolean = await this.hasValidDifferenceCount(this.outputPath);

        await util.promisify(fs.unlink)(this.rawImagePath);
        await util.promisify(fs.unlink)(this.modifiedImagePath);
        await util.promisify(fs.unlink)(this.outputPath);
        await util.promisify(fs.unlink)(this.b64Path);

        if (!isValidCount) {
            throw new Error(this.errorCountException);
        }

        return output;
    }

    private async hasValidDifferenceCount(filepath: string, diffCount: number = 7): Promise<boolean> {
        return (await this.CountDifferences(filepath)) === diffCount;
    }

    private async CountDifferences(filepath: string): Promise<number> {
        const seen: Object = {};
        let nbError: number = 0;

        const bitmapBuffer: Buffer = await this.getBitmapBuffer(filepath);
        const errorFinder: ErrorFinder = new ErrorFinder();

        for (let i: number = 0; i < ErrorFinder.getImageWidth(bitmapBuffer); i++) {
            for (let j: number = 0; j < ErrorFinder.getImageHeight(bitmapBuffer); j++) {
                const coordinates: Coordinates = { x: i, y: j };

                if (!seen[`${coordinates.x},${coordinates.y}`]) {
                    const errorPixels: Array<Coordinates> = errorFinder.findError(coordinates, bitmapBuffer);

                    if (errorPixels.length > 0) {
                        nbError++;
                        errorPixels.forEach((errorCoordinates: Coordinates) => {
                            seen[`${errorCoordinates.x},${errorCoordinates.y}`] = true;
                        });
                    } else {
                        seen[`${coordinates.x},${coordinates.y}`] = true;
                    }
                }
            }
        }

        return nbError;
    }

    private async base64_encode(filepath: string): Promise<string> {
        return (await this.getBitmapBuffer(filepath)).toString("base64");
    }

    private async getBitmapBuffer(filepath: string): Promise<Buffer> {
        return util.promisify(fs.readFile)(filepath);
    }

}
