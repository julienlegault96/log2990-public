import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";

import Types from "../types";
import { Mongo, Collections } from "../services/mongo";
import { AbstractRoute } from "./abstract-route/abstract-route";
import { Imgur } from "./imgur/imgur";

import { Game } from "../../../common/game/game";
import { GameType } from "../../../common/game/game-type";

import { execFile } from "child_process";
import * as util from "util";
import * as fs from "fs";
import { ImgDiff } from "./img-diff/imgdiff";
import { CODES } from "../../../common/communication/response-codes";

@injectable()

export class Games extends AbstractRoute<Game> {

    private readonly ID_RANGE: number = 1000000;
    private readonly FIRST_VIEW_RAW_INDEX: number = 0;
    private readonly FIRST_VIEW_MODIFIED_INDEX: number = 1;
    private readonly SECOND_VIEW_RAW_INDEX: number = 2;
    private readonly SECOND_VIEW_MODIFED_INDEX: number = 3;

    public constructor(@inject(Types.Mongo) mongo: Mongo) {
        super(mongo);
        this.collection = Collections.Games;
    }

    public async resetLeaderboard(req: Request, res: Response, next: NextFunction): Promise<void> {
        const elem: Game = req.body;
        await this.updateById(req, res, next, elem._id);
    }
    
    public async get(req: Request, res: Response, next: NextFunction): Promise<void> {
        res.status(CODES.OK).send(JSON.stringify((await this.getAll()).map((game: Game) => {
            game.imageUrl[2] = "";
            return game;
        })));
    }

    public async post(req: Request, res: Response, next: NextFunction): Promise<void> {
        req.body._id = this.generateId();

        const imgurPromise: Promise<string[]> =
            (req.body.type === GameType.SingleView)
                ? this.singleViewUpload(req)
                : this.doubleViewUpload(req);

        return imgurPromise
            .then((imagesUrl: string[]) => {
                req.body.imageUrl = imagesUrl;
                return super.post(req, res, next);
            })
            .catch(() => {
                res.status(CODES.SERVER_ERROR).send("Failed to create game");
            });
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
            imageDiffPromise]);
    }

    private async doubleViewUpload(req: Request): Promise<string[]> {
        const imgur: Imgur = new Imgur();
        const imgurPromise1: Promise<string> = imgur.uploadImage(req.body.imageUrl[this.FIRST_VIEW_RAW_INDEX]);
        const imgurPromise2: Promise<string> = imgur.uploadImage(req.body.imageUrl[this.FIRST_VIEW_RAW_INDEX]);
        // Appel du generateur d'image de difference et creation d'une Promise

        const imgurPromise3: Promise<string> = imgur.uploadImage(req.body.imageUrl[this.SECOND_VIEW_RAW_INDEX]);
        const imgurPromise4: Promise<string> = imgur.uploadImage(req.body.imageUrl[this.SECOND_VIEW_MODIFED_INDEX]);
        // Appel du generateur d'image de difference et creation d'une Promise

        return Promise.all([
            imgurPromise1,
            imgurPromise2,
            /*base64Promise1, */
            imgurPromise3,
            imgurPromise4/*,
            base64Promise2 */]);
    }

    private generateId(): number {
        return Math.floor(Math.random() * this.ID_RANGE);
    }

    private async generateImageDiff(rawImage: string, modifiedImage: string): Promise<string> {
        const rawImagePath: string = "./tools/rawImage.bmp";
        const modifiedImagePath: string = "./tools/modifiedImage.bmp";
        const outputPath: string = "./tools/output.bmp";
        const b64Path: string = "./tools/output.B64";

        const rawBitmap: Buffer = new Buffer(ImgDiff.parseBase64(rawImage), "base64");
        await util.promisify(fs.writeFile)(rawImagePath, rawBitmap);

        const modifiedBitmap: Buffer = new Buffer(ImgDiff.parseBase64(modifiedImage), "base64");
        await util.promisify(fs.writeFile)(modifiedImagePath, modifiedBitmap);

        await util.promisify(execFile)(
            "./tools/img-diff-generator.exe",
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
        const bitmap = await util.promisify(fs.readFile)(filepath);

        return new Buffer(bitmap).toString('base64');
    }

}
