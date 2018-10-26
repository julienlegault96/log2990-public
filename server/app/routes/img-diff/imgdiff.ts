import { inject, injectable } from "inversify";
import { Request, Response, NextFunction } from "express";

import { ErrorFinder } from "./error-finder";

import Types from "../../types";
import { Mongo, Collections } from "../../services/mongo";
import { Game } from "../../../../common/game/game";
import { CODES } from "../../../../common/communication/response-codes";
import { Coordinates } from "../../../../common/game/coordinates";
import { ImageView } from "../../../../common/game/image-view";

@injectable()
export class ImgDiff {

    private mongo: Mongo;
    private collection: Collections;

    public constructor(@inject(Types.Mongo) mongo: Mongo) {
        this.mongo = mongo;
        this.collection = Collections.Games;
    }

    public static parseBase64(base64Data: string): string {
        const base64Prefix: string = "data:image/bmp;base64,";
        if (base64Data.startsWith(base64Prefix)) {
            return base64Data.substr(base64Prefix.length);
        } else {
            return base64Data;
        }
    }

    public async get(req: Request, res: Response, next: NextFunction): Promise<void> {
        res.status(CODES.OK).send(
            JSON.stringify(
                await this.getDifferencePixel(
                    req.query.id,
                    req.query.imageView,
                    {
                        x: Number(req.query.x),
                        y: Number(req.query.y)
                    }
                )
            )
        );
    }

    private async getDifferencePixel(id: string, imageView: ImageView, coordinates: Coordinates): Promise<Coordinates[]> {
        const imgData: string | undefined = await this.getDiffImgData(id, imageView);
        if (imgData) {
            const errorFinder: ErrorFinder = new ErrorFinder();

            return errorFinder.findError(coordinates, new Buffer(ImgDiff.parseBase64(imgData), "base64"));
        }

        return [];
    }

    private async getDiffImgData(id: string, imageView: ImageView): Promise<string | undefined> {
        const game: Game = await this.getById(id);
        const firstViewDiffIndex: number = 2;
        const secondViewDiffIndex: number = 5;
        const diffIndex: number = (Number(imageView) === ImageView.FirstView) ? firstViewDiffIndex : secondViewDiffIndex;

        if (game && game.imageUrl[diffIndex]) {
            return game.imageUrl[diffIndex];
        } else {
            return undefined;
        }
    }

    private async getById(id: string): Promise<Game> {
        return this.mongo.findDocumentById<Game>(this.collection, id);
    }

}
