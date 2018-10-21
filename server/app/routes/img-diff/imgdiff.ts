import { inject, injectable } from "inversify";
import { Request, Response, NextFunction } from "express";

import { ErrorFinder } from "./error-finder";

import Types from "../../types";
import { Mongo, Collections } from "../../services/mongo";
import { Game } from "../../../../common/game/game";
import { CODES } from "../../../../common/communication/response-codes";
import { Coordinates } from "../../../../common/game/coordinates";

@injectable()
export class ImgDiff {

    private mongo: Mongo;
    private collection: Collections;

    public constructor(@inject(Types.Mongo) mongo: Mongo) {
        this.mongo = mongo;
        this.collection = Collections.Games;
    }

    public async get(req: Request, res: Response, next: NextFunction): Promise<void> {
        res.status(CODES.OK).send(
            JSON.stringify(
                await this.getDifferencePixel(
                    req.query.id,
                    {
                        x: Number(req.query.x),
                        y: Number(req.query.y)
                    }
                )
            )
        );
    }

    private async getDifferencePixel(id: string, coordinates: Coordinates): Promise<Coordinates[]> {
        const imgData: string | undefined = await this.getDiffImgData(id);
        if (imgData) {
            const errorFinder: ErrorFinder = new ErrorFinder();

            return errorFinder.getConnectedPixels(coordinates, new Buffer(this.parseBase64(imgData), "base64"));
        }

        return [];
    }

    private parseBase64(base64Data: string): string {
        const base64Prefix: string = "data:image/bmp;base64,";
        if (base64Data.startsWith(base64Prefix)) {
            return base64Data.substr(base64Prefix.length);
        } else {
            return base64Data;
        }
    }

    private async getDiffImgData(id: string): Promise<string | undefined> {
        const games: Game[] = await this.getById(parseInt(id, 10));
        const singleViewDiffIndex: number = 2;
        if (games[0] && games[0].imageUrl[singleViewDiffIndex]) {
            return games[0].imageUrl[singleViewDiffIndex];
        } else {
            return undefined;
        }
    }

    private async getById(id: number): Promise<Game[]> {
        return this.mongo.findDocuments<Game>(this.collection, { _id: id });
    }

}
