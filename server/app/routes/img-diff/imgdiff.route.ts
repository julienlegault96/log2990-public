import { injectable } from "inversify";
import { Request, Response, NextFunction } from "express";

import { ErrorFinder } from "../error-finder/error-finder";

import { CODES } from "../../../../common/communication/response-codes";
import { Coordinates } from "../../../../common/game/coordinates";
import { ImageView } from "../../../../common/game/image-view";

import { Games } from "../games";

@injectable()
export class ImgDiffRoute {

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

            return errorFinder.findError(coordinates, this.getImgBuffer(imgData));
        }

        return [];
    }

    private getImgBuffer(imgData: string): Buffer {
        return Buffer.from(ImgDiffRoute.parseBase64(imgData), "base64");
    }

    private async getDiffImgData(id: string, imageView: ImageView): Promise<string | undefined> {
        return Games.cachedDiffImagesMap[id][Number(imageView)];
    }

}
