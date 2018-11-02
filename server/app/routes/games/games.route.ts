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
import { Leaderboard } from "../../../common/game/leaderboard";
import { request } from "http";

@injectable()

export class GamesRoute extends AbstractRoute<Game> {

    public static readonly cachedDiffImagesMap: { [key: string]: string[]; } = {};

    private readonly ID_RANGE: number = 1000000;
    private readonly FIRST_VIEW_RAW_INDEX: number = 0;
    private readonly FIRST_VIEW_MODIFIED_INDEX: number = 1;
    private readonly FIRST_VIEW_DIFF_INDEX: number = 2;
    private readonly SECOND_VIEW_RAW_INDEX: number = 3;
    private readonly SECOND_VIEW_MODIFED_INDEX: number = 4;
    private readonly SECOND_VIEW_DIFF_INDEX: number = 5;
    private readonly IMAGES_SIZE_DOUBLE_VIEW: number = 6;

    private readonly execPath: string = "./tools/img-diff-generator.exe";
    private readonly rawImagePath: string = "./tools/rawImage.bmp";
    private readonly modifiedImagePath: string = "./tools/modifiedImage.bmp";

    // Generated images from image difference generator
    private readonly outputPath: string = "./tools/output.bmp";
    private readonly b64Path: string = "./tools/output.B64";

    private readonly errorCountException: string = "errorCount";

    // Generated images from 3D image generator
    private readonly imageGeneratorOutput: string = "output";
    private readonly firstViewOriginalPath: string = `./tools/${this.imageGeneratorOutput}_a_ori.bmp`;
    private readonly firstViewModifiedPath: string = `./tools/${this.imageGeneratorOutput}_a_mod.bmp`;
    private readonly secondViewOriginalPath: string = `./tools/${this.imageGeneratorOutput}_b_ori.bmp`;
    private readonly secondViewModifiedPath: string = `./tools/${this.imageGeneratorOutput}_b_mod.bmp`;

    private readonly imagesGeneratorMaximumTries: number = 4;

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
            return this.uploadImagesImgur(
                req.body.imageUrl[this.FIRST_VIEW_RAW_INDEX],
                req.body.imageUrl[this.FIRST_VIEW_MODIFIED_INDEX]
            ).then((imgurLinks: Array<string>) => {
                imgurLinks.splice(this.FIRST_VIEW_DIFF_INDEX, 0, imageDiff);

                return imgurLinks;
            });
        });
    }

    private doubleViewUpload(req: Request): Promise<string[]> {
        return this.generate3DImagesDiff()
            .then((imagesDiff: Array<string>) => {
                return this.uploadImagesImgur(
                    imagesDiff[this.FIRST_VIEW_RAW_INDEX],
                    imagesDiff[this.FIRST_VIEW_MODIFIED_INDEX],
                    imagesDiff[this.SECOND_VIEW_RAW_INDEX],
                    imagesDiff[this.SECOND_VIEW_MODIFED_INDEX]
                ).then((imgurLinks: Array<string>) => {
                    imgurLinks.splice(this.FIRST_VIEW_DIFF_INDEX, 0, imagesDiff[this.FIRST_VIEW_DIFF_INDEX]);
                    imgurLinks.splice(this.SECOND_VIEW_DIFF_INDEX, 0, imagesDiff[this.SECOND_VIEW_DIFF_INDEX]);

                    return imgurLinks;
                });
            });
    }

    private uploadImagesImgur(...images: Array<string>): Promise<Array<string>> {
        const promises: Array<Promise<string>> = new Array<Promise<string>>();

        const imgur: Imgur = new Imgur();
        for (const image of images) {
            promises.push(imgur.uploadImage(image));
        }

        return Promise.all(promises);
    }

    // tslint:disable-next-line:max-func-body-length
    private async generate3DImagesDiff(): Promise<string[]> {
        const images: Array<string> = new Array<string>(this.IMAGES_SIZE_DOUBLE_VIEW).fill("");

        for (let i: number = 0; i < this.imagesGeneratorMaximumTries; i++) {
            await this.exec3DImage();
            images[this.FIRST_VIEW_DIFF_INDEX] = "";
            images[this.SECOND_VIEW_DIFF_INDEX] = "";

            await this.generateImageDiff(this.firstViewOriginalPath, this.firstViewModifiedPath)
                .then((value: string) => {
                    images[this.FIRST_VIEW_DIFF_INDEX] = value;
                })
                .catch();

            if (images[this.FIRST_VIEW_DIFF_INDEX] === "") {
                continue;
            }

            await this.generateImageDiff(this.secondViewOriginalPath, this.secondViewModifiedPath)
                .then((value: string) => {
                    images[this.SECOND_VIEW_DIFF_INDEX] = value;
                })
                .catch();
        }

        if (images[this.FIRST_VIEW_DIFF_INDEX] === "" || images[this.SECOND_VIEW_DIFF_INDEX] === "") {
            throw new Error(this.errorCountException);
        }

        images[this.FIRST_VIEW_RAW_INDEX] = await this.base64_encode(this.firstViewOriginalPath);
        images[this.FIRST_VIEW_MODIFIED_INDEX] = await this.base64_encode(this.firstViewModifiedPath);
        images[this.SECOND_VIEW_RAW_INDEX] = await this.base64_encode(this.secondViewOriginalPath);
        images[this.SECOND_VIEW_MODIFED_INDEX] = await this.base64_encode(this.secondViewModifiedPath);

        await this.deleteFiles(
            this.firstViewOriginalPath,
            this.firstViewModifiedPath,
            this.secondViewOriginalPath,
            this.secondViewModifiedPath
        );

        return images;
    }

    private async deleteFiles(...filepaths: Array<string>): Promise<void> {
        for (const filepath of filepaths) {
            await this.deleteFile(filepath);
        }
    }

    private async deleteFile(filepath: string): Promise<void> {
        return util.promisify(fs.unlink)(filepath);
    }

    private async exec3DImage(): Promise<void> {
        const execPath: string = "./tools/vanilla3DObjects.exe";

        // TODO
        await this.execFile(execPath, ["geo", "20", "asc", this.imageGeneratorOutput]).catch(console.log);
        // await util.promisify(execFile)(
        //     execPath,
        //     ["geo", "20", "asc", this.imageGeneratorOutput]
        // ).catch(console.log);
    }

    private generateId(): string {
        return Math.floor(Math.random() * this.ID_RANGE).toString();
    }

    private writeFile(filepath: string, buffer: Buffer): Promise<void> {
        return util.promisify(fs.writeFile)(filepath, buffer);
    }

    private execFile(filepath: string, params: Array<string>): Promise<void> {
        return util.promisify(execFile)(filepath, params).then(() => { return; });
    }

    private async generateImageDiff(rawImage: string, modifiedImage: string): Promise<string> {
        const rawBitmap: Buffer = Buffer.from(ImgDiffRoute.parseBase64(rawImage), "base64");
        await this.writeFile(this.rawImagePath, rawBitmap);

        const modifiedBitmap: Buffer = Buffer.from(ImgDiffRoute.parseBase64(modifiedImage), "base64");
        await this.writeFile(this.modifiedImagePath, modifiedBitmap);

        await this.execFile(this.execPath, [this.rawImagePath, this.modifiedImagePath, this.outputPath]);

        // await util.promisify(execFile)(
        //     this.execPath,
        //     [this.rawImagePath, this.modifiedImagePath, this.outputPath]
        // );

        const output: string = await this.base64_encode(this.outputPath);

        const isValidCount: boolean = await this.hasValidDifferenceCount(this.outputPath);

        await this.deleteFiles(
            this.rawImagePath,
            this.modifiedImagePath,
            this.outputPath,
            this.b64Path
        );

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
