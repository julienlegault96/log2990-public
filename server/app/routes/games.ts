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

    public async post(req: Request, res: Response, next: NextFunction): Promise<void> {
        req.body._id = this.generateId();

        const imgurPromise: Promise<string[]> =
            (req.body.type === GameType.SingleView)
                ? this.singleViewUpload(req)
                : this.doubleViewUpload(req);

        imgurPromise
            .then((imagesUrl: string[]) => {
                req.body.imageUrl = imagesUrl;
            });

        await (imgurPromise);

        return super.post(req, res, next);
    }

    private async singleViewUpload(req: Request): Promise<string[]> {
        const imgur: Imgur = new Imgur();
        const imgurPromise1: Promise<string> = imgur.uploadImage(req.body.imageUrl[this.FIRST_VIEW_RAW_INDEX]);
        const imgurPromise2: Promise<string> = imgur.uploadImage(req.body.imageUrl[this.FIRST_VIEW_MODIFIED_INDEX]);

        // Appel du generateur d'image de difference et creation d'une Promise
        this.generateImageDiff(req.body.imageUrl[this.FIRST_VIEW_RAW_INDEX], req.body.imageUrl[this.FIRST_VIEW_MODIFIED_INDEX])
            .then().catch(console.log);

        return Promise.all([
            imgurPromise1,
            imgurPromise2/*,
            base64Promise*/]).catch();
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
        const rawBitmap: Buffer = new Buffer(ImgDiff.parseBase64(rawImage), "base64");
        await util.promisify(fs.writeFile)("./tools/temp/rawImage.bmp", rawBitmap);

        const modifiedBitmap: Buffer = new Buffer(ImgDiff.parseBase64(modifiedImage), "base64");
        await util.promisify(fs.writeFile)("./tools/temp/modifiedImage.bmp", modifiedBitmap);

        const { stdout } = await util.promisify(execFile)(
            "./tools/img-diff-generator.exe",
            ["./temp/rawImage.bmp", "./temp/modifiedImage.bmp"]
        );

        // tslint:disable-next-line:no-console
        // tslint:disable-next-line:no-magic-numbers
        console.log(stdout.substr(0, 100));

        return stdout;
    }

}
