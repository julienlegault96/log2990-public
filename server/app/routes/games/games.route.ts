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

import { ErrorFinder } from "../../services/error-finder/error-finder";
import { FileService } from "../../services/file/file.service";

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

    private readonly toolsPath: string = "./tools/";

    private readonly execPath: string = `${this.toolsPath}bmpdiff.exe`;
    private readonly rawImagePath: string = `rawImage.bmp`;
    private readonly modifiedImagePath: string = `modifiedImage.bmp`;

    // Generated images from image difference generator
    private readonly outputPath: string = `output.bmp`;

    private readonly errorCountException: string = "errorCount";

    // Generated images from 3D image generator
    private readonly imageGeneratorOutput: string = "output";
    private readonly firstViewOriginalPath: string = `${this.imageGeneratorOutput}_a_ori.bmp`;
    private readonly firstViewModifiedPath: string = `${this.imageGeneratorOutput}_a_mod.bmp`;
    private readonly secondViewOriginalPath: string = `${this.imageGeneratorOutput}_b_ori.bmp`;
    private readonly secondViewModifiedPath: string = `${this.imageGeneratorOutput}_b_mod.bmp`;

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
        const fileService: FileService = new FileService();
        const rawBitmap: Buffer = this.getImageBufferFromBase64(req.body.imageUrl[this.FIRST_VIEW_RAW_INDEX]);
        await fileService.writeFile(this.getRelativeToolsPath(this.rawImagePath), rawBitmap);

        const modifiedBitmap: Buffer = this.getImageBufferFromBase64(req.body.imageUrl[this.FIRST_VIEW_MODIFIED_INDEX]);
        await fileService.writeFile(this.getRelativeToolsPath(this.modifiedImagePath), modifiedBitmap);

        return this.generateImageDiff(
            this.rawImagePath,
            this.modifiedImagePath
        ).then(async (imageDiff: string) => {
            return this.uploadImagesImgur(
                req.body.imageUrl[this.FIRST_VIEW_RAW_INDEX],
                req.body.imageUrl[this.FIRST_VIEW_MODIFIED_INDEX]
            ).then(async (imgurLinks: Array<string>) => {
                imgurLinks.splice(this.FIRST_VIEW_DIFF_INDEX, 0, imageDiff);
                await fileService.deleteFiles(
                    this.getRelativeToolsPath(this.rawImagePath),
                    this.getRelativeToolsPath(this.modifiedImagePath),
                );

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

        for (let i: number = 0; (i < this.imagesGeneratorMaximumTries) && (!this.isValidGeneratedImages(images)); i++) {
            await this.exec3DImage();

            images[this.FIRST_VIEW_DIFF_INDEX] = "";
            images[this.SECOND_VIEW_DIFF_INDEX] = "";

            await this.generateImageDiff(this.firstViewOriginalPath, this.firstViewModifiedPath)
                .then((value: string) => {
                    images[this.FIRST_VIEW_DIFF_INDEX] = value;
                })
                .catch();

            // first view has valid difference count
            if (images[this.FIRST_VIEW_DIFF_INDEX] !== "") {
                await this.generateImageDiff(this.secondViewOriginalPath, this.secondViewModifiedPath)
                    .then((value: string) => {
                        images[this.SECOND_VIEW_DIFF_INDEX] = value;
                    })
                    .catch();
            }
        }

        images[this.FIRST_VIEW_RAW_INDEX] = await this.encodeInBase64(this.getRelativeToolsPath(this.firstViewOriginalPath));
        images[this.FIRST_VIEW_MODIFIED_INDEX] = await this.encodeInBase64(this.getRelativeToolsPath(this.firstViewModifiedPath));
        images[this.SECOND_VIEW_RAW_INDEX] = await this.encodeInBase64(this.getRelativeToolsPath(this.secondViewOriginalPath));
        images[this.SECOND_VIEW_MODIFED_INDEX] = await this.encodeInBase64(this.getRelativeToolsPath(this.secondViewModifiedPath));

        const fileService: FileService = new FileService();
        await fileService.deleteFiles(
            this.getRelativeToolsPath(this.firstViewOriginalPath),
            this.getRelativeToolsPath(this.firstViewModifiedPath),
            this.getRelativeToolsPath(this.secondViewOriginalPath),
            this.getRelativeToolsPath(this.secondViewModifiedPath),
        );

        if (!this.isValidGeneratedImages(images)) {
            throw new Error(this.errorCountException);
        }

        return images;
    }

    private getRelativeToolsPath(filename: string): string {
        return `${this.toolsPath}${filename}`;
    }

    private isValidGeneratedImages(images: string[]): boolean {
        return images[this.FIRST_VIEW_DIFF_INDEX] !== "" && images[this.SECOND_VIEW_DIFF_INDEX] !== "";
    }

    private async exec3DImage(): Promise<void> {
        const execPath: string = "./tools/genmulti.exe";

        // TODO
        const fileService: FileService = new FileService();
        await fileService.execFile(execPath, ["geo", "20", "asc", this.imageGeneratorOutput])
            .catch(console.log);
    }

    private generateId(): string {
        return Math.floor(Math.random() * this.ID_RANGE).toString();
    }

    private getImageBufferFromBase64(base64: string): Buffer {
        return Buffer.from(ImgDiffRoute.parseBase64(base64), "base64");
    }

    private async generateImageDiff(originalImagePath: string, modifiedImagePath: string): Promise<string> {
        const fileService: FileService = new FileService();
        await fileService.execFile(this.execPath, [originalImagePath, modifiedImagePath, this.outputPath]);

        const output: string = await this.encodeInBase64(this.getRelativeToolsPath(this.outputPath));

        const isValidCount: boolean = await this.hasValidDifferenceCount(this.getRelativeToolsPath(this.outputPath));

        if (!isValidCount) {
            throw new Error(this.errorCountException);
        }

        await fileService.deleteFile(this.getRelativeToolsPath(this.outputPath));

        return output;
    }

    private async hasValidDifferenceCount(filepath: string, diffCount: number = 7): Promise<boolean> {
        const differenceCount: number = await this.CountDifferences(filepath);

        return differenceCount === diffCount;
    }

    private async CountDifferences(filepath: string): Promise<number> {
        const seen: Object = {};
        let nbError: number = 0;

        const fileService: FileService = new FileService();
        const bitmapBuffer: Buffer = await fileService.readFile(filepath);
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

    private async encodeInBase64(filepath: string): Promise<string> {
        const fileService: FileService = new FileService();
        const buffer: Buffer = await fileService.readFile(filepath);

        return buffer.toString("base64");
    }

}
