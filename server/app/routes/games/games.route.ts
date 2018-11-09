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
import { ImagesIndex } from "./images-index";
import { GameCreator } from "../../services/game-creator/game-creator";

@injectable()

export class GamesRoute extends AbstractRoute<Game> {

    public static readonly cachedDiffImagesMap: { [key: string]: string[]; } = {};

    private readonly ID_RANGE: number = 1000000;
    private fileService: FileService;
    private gameCreator: GameCreator;
    private imgur: Imgur;

    private readonly errorCountException: string = "errorCount";

    // Executables
    private readonly toolsPath: string = "./tools/";

    // Generated images from genmulti
    private readonly outputPrefix: string = "output";
    private readonly firstViewOriginalPath: string = `${this.outputPrefix}_a_ori.bmp`;
    private readonly firstViewModifiedPath: string = `${this.outputPrefix}_a_mod.bmp`;

    public constructor(@inject(Types.Mongo) mongo: Mongo) {
        super(mongo);
        this.collection = Collections.Games;
        this.fileService = new FileService();
        this.gameCreator = new GameCreator();
        this.imgur = new Imgur();
    }

    public async get(req: Request, res: Response, next: NextFunction): Promise<void> {
        res.status(CODES.OK).send(
            JSON.stringify(
                (await this.getAll()).map((game: Game) => {
                    game.imageUrl[ImagesIndex.FirstViewDifference] = "";
                    game.imageUrl[ImagesIndex.SecondViewDifference] = "";

                    return game;
                })
            )
        );
    }

    public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        const game: Game = await this.getOne(req.params.id);
        if (!GamesRoute.cachedDiffImagesMap[game._id] && game) {
            GamesRoute.cachedDiffImagesMap[game._id] =
                [game.imageUrl[ImagesIndex.FirstViewDifference], game.imageUrl[ImagesIndex.SecondViewDifference]];
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
        const rawBitmap: Buffer = this.getImageBufferFromBase64(req.body.imageUrl[ImagesIndex.FirstViewOriginal]);
        await this.fileService.writeFile(this.getToolsPath(this.firstViewOriginalPath), rawBitmap);

        const modifiedBitmap: Buffer = this.getImageBufferFromBase64(req.body.imageUrl[ImagesIndex.FirstViewModified]);
        await this.fileService.writeFile(this.getToolsPath(this.firstViewModifiedPath), modifiedBitmap);

        return this.gameCreator.generateImageDiff(
            this.firstViewOriginalPath,
            this.firstViewModifiedPath
        ).then(async (imageDiff: string) => {
            return this.imgur.uploadImages(
                req.body.imageUrl[ImagesIndex.FirstViewOriginal],
                req.body.imageUrl[ImagesIndex.FirstViewModified]
            ).then(async (imgurLinks: Array<string>) => {
                imgurLinks.splice(ImagesIndex.FirstViewDifference, 0, imageDiff);
                await this.fileService.deleteFiles(
                    this.getToolsPath(this.firstViewOriginalPath),
                    this.getToolsPath(this.firstViewModifiedPath),
                );

                return imgurLinks;
            });
        });
    }

    private async doubleViewUpload(req: Request): Promise<string[]> {
        return this.gameCreator.generateImagesDiff({ type: "geo", quantity: 20, modifications: { add: true, delete: true, color: true } })
            .then(async (imagesDiff: Array<string>) => {
                return this.imgur.uploadImages(
                    imagesDiff[ImagesIndex.FirstViewOriginal],
                    imagesDiff[ImagesIndex.FirstViewModified],
                    imagesDiff[ImagesIndex.SecondViewOriginal],
                    imagesDiff[ImagesIndex.SecondViewModified]
                ).then((imgurLinks: Array<string>) => {
                    imgurLinks.splice(ImagesIndex.FirstViewDifference, 0, imagesDiff[ImagesIndex.FirstViewDifference]);
                    imgurLinks.splice(ImagesIndex.SecondViewDifference, 0, imagesDiff[ImagesIndex.SecondViewDifference]);

                    return imgurLinks;
                });
            });
    }

    private getToolsPath(filename: string): string {
        return `${this.toolsPath}${filename}`;
    }

    private generateId(): string {
        return Math.floor(Math.random() * this.ID_RANGE).toString();
    }

    private getImageBufferFromBase64(base64: string): Buffer {
        return Buffer.from(ImgDiffRoute.parseBase64(base64), "base64");
    }

}
