import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { execFile } from "child_process";

import Types from "../types";
import { Mongo, Collections } from "../services/mongo";
import { AbstractRoute } from "./abstract-route/abstract-route";
import { Imgur } from "./imgur/imgur";

import { Game } from "../../../common/game/game";
import { GameType } from "../../../common/game/game-type";
import { CODES } from "../../../common/communication/response-codes";

declare var require: any;
const exec = require("child_process").execFile;

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
        if (req.body.type === GameType.SingleView) {
            req.body._id = this.generateId();

           /* const imgurPromise: Promise<string[]> =
                (req.body.type === GameType.SingleView)
                    ? this.singleViewUpload(req)
                    : this.doubleViewUpload(req);
                    */
            const imgurPromise: Promise<string[]> = this.singleViewUpload(req);

            imgurPromise
                .then((imagesUrl: string[]) => {
                    req.body.imageUrl = imagesUrl;
                });

            await (imgurPromise);

            return super.post(req, res, next);
        } else {
            await this.doubleViewUpload(req);
            res.status(CODES.OK).send();
        }
    }

    private async singleViewUpload(req: Request): Promise<string[]> {
        const imgur: Imgur = new Imgur();
        const imgurPromise1: Promise<string> = imgur.uploadImage(req.body.imageUrl[this.FIRST_VIEW_RAW_INDEX]);
        const imgurPromise2: Promise<string> = imgur.uploadImage(req.body.imageUrl[this.FIRST_VIEW_MODIFIED_INDEX]);

        // Appel du generateur d'image de difference et creation d'une Promise
        const base64Promise: Promise<string> = this.callExec();

        return Promise.all([
            imgurPromise1,
            imgurPromise2,
            base64Promise]).catch();
    }

    public async doubleViewUpload(req: Request): Promise<void> {
        await this.exec3DImage();
        /*
        const imgur: Imgur = new Imgur();
        const imgurPromise1: Promise<string> = imgur.uploadImage(req.body.imageUrl[this.FIRST_VIEW_RAW_INDEX]);
        const imgurPromise2: Promise<string> = imgur.uploadImage(req.body.imageUrl[this.FIRST_VIEW_MODIFIED_INDEX]);

        // Appel du generateur d'image de difference et creation d'une Promise
        const base64Promise1: Promise<string> = this.exec3DImage();      // A valider

        const imgurPromise3: Promise<string> = imgur.uploadImage(req.body.imageUrl[this.SECOND_VIEW_RAW_INDEX]);
        const imgurPromise4: Promise<string> = imgur.uploadImage(req.body.imageUrl[this.SECOND_VIEW_MODIFED_INDEX]);

        // Appel du generateur d'image de difference et creation d'une Promise
        const base64Promise2: Promise<string> = this.exec3DImage();      // A valider

        return Promise.all([
            imgurPromise1,
            imgurPromise2,
            base64Promise1,
            imgurPromise3,
            imgurPromise4,
            base64Promise2]).catch();
            */
    }

    private async callExec(): Promise < string > {

        return Promise.call(exec("../../../img-diff-generator.exe"));     // A valider. Pour tester,
    }

    private async exec3DImage(): Promise < any > {
        const execPath: string =
        "./app/Objects/vanilla3DObjects/vanilla3DObjects/vanilla3DObjects.exe";

        return execFile(execPath, ["vanilla3DObjects.exe"], (error: Error, stdout: any, stderr: any) => {
            if (error) {
                throw error;
            }
        });
    }

    private generateId(): number {
        return Math.floor(Math.random() * this.ID_RANGE);
    }

}
