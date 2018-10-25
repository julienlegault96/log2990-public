import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";

import Types from "../types";
import { Mongo, Collections } from "../services/mongo";
import { AbstractRoute } from "./abstract-route/abstract-route";
import { Imgur } from "./imgur/imgur";

import { Game } from "../../../common/game/game";
import { GameType } from "../../../common/game/game-type";

import { ImgDiff } from "./img-diff/imgdiff";
import { CODES } from "../../../common/communication/response-codes";

import { execFile } from "child_process";
import * as util from "util";
import * as fs from "fs";

@injectable()

export class Games extends AbstractRoute<Game> {

    private readonly ID_RANGE: number = 1000000;
    private readonly FIRST_VIEW_RAW_INDEX: number = 0;
    private readonly FIRST_VIEW_MODIFIED_INDEX: number = 1;
    private readonly FIRST_VIEW_DIFF_INDEX: number = 2;
    // private readonly SECOND_VIEW_RAW_INDEX: number = 3;
    // private readonly SECOND_VIEW_MODIFED_INDEX: number = 4;
    // private readonly SECOND_VIEW_DIFF_INDEX: number = 5;

    public constructor(@inject(Types.Mongo) mongo: Mongo) {
        super(mongo);
        this.collection = Collections.Games;
    }

    public async resetLeaderboard(req: Request, res: Response, next: NextFunction): Promise<void> {
        const elem: Game = req.body;
        await this.updateById(req, res, next, elem._id);
    }

    public async get(req: Request, res: Response, next: NextFunction): Promise<void> {
        res.status(CODES.OK).send(
            JSON.stringify(
                (await this.getAll()).map((game: Game) => {
                    game.imageUrl[this.FIRST_VIEW_DIFF_INDEX] = "";
                    // game.imageUrl[this.SECOND_VIEW_DIFF_INDEX] = "";

                    return game;
                })
            )
        );
    }

    public async post(req: Request, res: Response, next: NextFunction): Promise<void> {
        if (req.body.type === GameType.SingleView) {
            req.body._id = this.generateId();

            const imgurPromise: Promise<string[]> = this.singleViewUpload(req);

            return imgurPromise
                .then((imagesUrl: string[]) => {
                    req.body.imageUrl = imagesUrl;

                    return super.post(req, res, next);
                })
                .catch(() => {
                    res.status(CODES.SERVER_ERROR).send("Failed to create game");
                });
        } else {
            await this.doubleViewUpload(req);
            res.status(CODES.OK).send();
        }
    }

    private async singleViewUpload(req: Request): Promise<string[]> {
        const imgur: Imgur = new Imgur();
        const imgurPromise1: Promise<string> = imgur.uploadImage(req.body.imageUrl[this.FIRST_VIEW_RAW_INDEX]);
        const imgurPromise2: Promise<string> = imgur.uploadImage(req.body.imageUrl[this.FIRST_VIEW_MODIFIED_INDEX]);

        const imageDiffPromise: Promise<string> = this.generateImageDiff(
            req.body.imageUrl[this.FIRST_VIEW_RAW_INDEX],
            req.body.imageUrl[this.FIRST_VIEW_MODIFIED_INDEX]
        );

        return Promise.all([
            imgurPromise1,
            imgurPromise2,
            imageDiffPromise
        ]);
    }

    public async doubleViewUpload(req: Request): Promise<void> {
        await this.exec3DImage();

        // Sprint 3: Implémenter les fonctions nécessaires pour l'enregistrement du jeu
    }

    private async exec3DImage(): Promise<void> {
        const execPath: string = "./app/Objects/vanilla3DObjects/vanilla3DObjects/vanilla3DObjects.exe";

        await util.promisify(execFile)(execPath);
    }

    private generateId(): number {
        return Math.floor(Math.random() * this.ID_RANGE);
    }

    private async generateImageDiff(rawImage: string, modifiedImage: string): Promise<string> {
        const execPath: string = "./tools/img-diff-generator.exe";
        const rawImagePath: string = "./tools/rawImage.bmp";
        const modifiedImagePath: string = "./tools/modifiedImage.bmp";
        const outputPath: string = "./tools/output.bmp";
        const b64Path: string = "./tools/output.B64";

        const rawBitmap: Buffer = new Buffer(ImgDiff.parseBase64(rawImage), "base64");
        await util.promisify(fs.writeFile)(rawImagePath, rawBitmap);

        const modifiedBitmap: Buffer = new Buffer(ImgDiff.parseBase64(modifiedImage), "base64");
        await util.promisify(fs.writeFile)(modifiedImagePath, modifiedBitmap);

        await util.promisify(execFile)(
            execPath,
            [rawImagePath, modifiedImagePath, outputPath]
        );

        const output: string = await this.base64_encode(outputPath);

        await util.promisify(fs.unlink)(rawImagePath);
        await util.promisify(fs.unlink)(modifiedImagePath);
        await util.promisify(fs.unlink)(outputPath);
        await util.promisify(fs.unlink)(b64Path);

        return output;
    }

    private async base64_encode(filepath: string): Promise<string> {
        return (await this.getBitmapBuffer(filepath)).toString("base64");
    }

    private async hasValidDifferenceCount(filepath: string, diffCount: number = 7): Promise<boolean> {
        return (await this.CountDifferences(filepath)) === diffCount;
    }

    private async CountDifferences(filepath: string): Promise<number> {
        const bitmapBuffer: Buffer = await this.getBitmapBuffer(filepath);
        
    }

    private async getBitmapBuffer(filepath: string): Promise<Buffer> {
        return util.promisify(fs.readFile)(filepath);
    }
}
