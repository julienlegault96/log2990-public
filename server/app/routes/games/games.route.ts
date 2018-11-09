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

import { FileService } from "../../services/file/file.service";
import { GameImagesIndex } from "./game-images-index";
import { DifferenceCounter } from "../../services/difference-counter/difference-counter";

@injectable()

export class GamesRoute extends AbstractRoute<Game> {

    public static readonly cachedDiffImagesMap: { [key: string]: string[]; } = {};

    private readonly ID_RANGE: number = 1000000;
    private readonly IMAGES_SIZE_DOUBLE_VIEW: number = 6;
    private readonly DIFFERENCE_REQUIRED: number = 7;

    private readonly errorCountException: string = "errorCount";

    // Executables
    private readonly toolsPath: string = "./tools/";

    private readonly bmpDiffExecPath: string = `${this.toolsPath}bmpdiff.exe`;
    private readonly genMultiExecPath: string = `${this.toolsPath}genmulti.exe`;
    private readonly imagesGeneratorMaximumTries: number = 4;

    // Generated images from genmulti
    private readonly outputPrefix: string = "output";
    private readonly firstViewOriginalPath: string = `${this.outputPrefix}_a_ori.bmp`;
    private readonly firstViewModifiedPath: string = `${this.outputPrefix}_a_mod.bmp`;
    private readonly secondViewOriginalPath: string = `${this.outputPrefix}_b_ori.bmp`;
    private readonly secondViewModifiedPath: string = `${this.outputPrefix}_b_mod.bmp`;

    // Generated image from bmpdiff
    private readonly outputPath: string = `${this.outputPrefix}.bmp`;

    public constructor(@inject(Types.Mongo) mongo: Mongo) {
        super(mongo);
        this.collection = Collections.Games;
    }

    public async get(req: Request, res: Response, next: NextFunction): Promise<void> {
        res.status(CODES.OK).send(
            JSON.stringify(
                (await this.getAll()).map((game: Game) => {
                    game.imageUrl[GameImagesIndex.FirstViewDifference] = "";
                    game.imageUrl[GameImagesIndex.SecondViewDifference] = "";

                    return game;
                })
            )
        );
    }

    public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        const game: Game = await this.getOne(req.params.id);
        if (!GamesRoute.cachedDiffImagesMap[game._id] && game) {
            GamesRoute.cachedDiffImagesMap[game._id] =
                [game.imageUrl[GameImagesIndex.FirstViewDifference], game.imageUrl[GameImagesIndex.SecondViewDifference]];
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
        const rawBitmap: Buffer = this.getImageBufferFromBase64(req.body.imageUrl[GameImagesIndex.FirstViewOriginal]);
        await fileService.writeFile(this.getRelativeToolsPath(this.firstViewOriginalPath), rawBitmap);

        const modifiedBitmap: Buffer = this.getImageBufferFromBase64(req.body.imageUrl[GameImagesIndex.FirstViewModified]);
        await fileService.writeFile(this.getRelativeToolsPath(this.firstViewModifiedPath), modifiedBitmap);

        return this.generateImageDiff(
            this.firstViewOriginalPath,
            this.firstViewModifiedPath
        ).then(async (imageDiff: string) => {
            return new Imgur().uploadImages(
                req.body.imageUrl[GameImagesIndex.FirstViewOriginal],
                req.body.imageUrl[GameImagesIndex.FirstViewModified]
            ).then(async (imgurLinks: Array<string>) => {
                imgurLinks.splice(GameImagesIndex.FirstViewDifference, 0, imageDiff);
                await fileService.deleteFiles(
                    this.getRelativeToolsPath(this.firstViewOriginalPath),
                    this.getRelativeToolsPath(this.firstViewModifiedPath),
                );

                return imgurLinks;
            });
        });
    }

    private doubleViewUpload(req: Request): Promise<string[]> {
        return this.generate3DImagesDiff()
            .then((imagesDiff: Array<string>) => {
                return new Imgur().uploadImages(
                    imagesDiff[GameImagesIndex.FirstViewOriginal],
                    imagesDiff[GameImagesIndex.FirstViewModified],
                    imagesDiff[GameImagesIndex.SecondViewOriginal],
                    imagesDiff[GameImagesIndex.SecondViewModified]
                ).then((imgurLinks: Array<string>) => {
                    imgurLinks.splice(GameImagesIndex.FirstViewDifference, 0, imagesDiff[GameImagesIndex.FirstViewDifference]);
                    imgurLinks.splice(GameImagesIndex.SecondViewDifference, 0, imagesDiff[GameImagesIndex.SecondViewDifference]);

                    return imgurLinks;
                });
            });
    }

    // tslint:disable-next-line:max-func-body-length
    private async generate3DImagesDiff(): Promise<string[]> {
        const images: Array<string> = new Array<string>(this.IMAGES_SIZE_DOUBLE_VIEW).fill("");

        for (let i: number = 0; i < this.imagesGeneratorMaximumTries; i++) {
            await this.exec3DImage();

            images[GameImagesIndex.FirstViewDifference] = "";
            images[GameImagesIndex.SecondViewDifference] = "";

            await this.generateImageDiff(this.firstViewOriginalPath, this.firstViewModifiedPath)
                .then((value: string) => {
                    images[GameImagesIndex.FirstViewDifference] = value;
                })
                .catch((error: Error) => {
                    if (error.message !== this.errorCountException) {
                        throw error;
                    }
                });

            // first view has invalid difference count, skip
            if (images[GameImagesIndex.FirstViewDifference] === "") {
                continue;
            }

            await this.generateImageDiff(this.secondViewOriginalPath, this.secondViewModifiedPath)
                .then((value: string) => {
                    images[GameImagesIndex.SecondViewDifference] = value;
                })
                .catch((error: Error) => {
                    if (error.message !== this.errorCountException) {
                        throw error;
                    }
                });

            if (this.isValidGeneratedImages(images)) {
                break;
            }
        }
        images[GameImagesIndex.FirstViewOriginal] = await this.encodeInBase64(this.getRelativeToolsPath(this.firstViewOriginalPath));
        images[GameImagesIndex.FirstViewModified] = await this.encodeInBase64(this.getRelativeToolsPath(this.firstViewModifiedPath));
        images[GameImagesIndex.SecondViewOriginal] = await this.encodeInBase64(this.getRelativeToolsPath(this.secondViewOriginalPath));
        images[GameImagesIndex.SecondViewModified] = await this.encodeInBase64(this.getRelativeToolsPath(this.secondViewModifiedPath));

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
        return images[GameImagesIndex.FirstViewDifference] !== "" && images[GameImagesIndex.SecondViewDifference] !== "";
    }

    private async exec3DImage(): Promise<void> {
        // TODO
        const fileService: FileService = new FileService();
        await fileService.execFile(this.genMultiExecPath, ["geo", "20", "asc", this.outputPrefix])
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
        await fileService.execFile(this.bmpDiffExecPath, [originalImagePath, modifiedImagePath, this.outputPath]);

        const output: string = await this.encodeInBase64(this.getRelativeToolsPath(this.outputPath));

        const isValidCount: boolean = await new DifferenceCounter(this.DIFFERENCE_REQUIRED)
            .hasValidDifferenceCount(this.getRelativeToolsPath(this.outputPath));

        if (!isValidCount) {
            throw new Error(this.errorCountException);
        }

        await fileService.deleteFile(this.getRelativeToolsPath(this.outputPath));

        return output;
    }

    private async encodeInBase64(filepath: string): Promise<string> {
        const fileService: FileService = new FileService();
        const buffer: Buffer = await fileService.readFile(filepath);

        return buffer.toString("base64");
    }

}
