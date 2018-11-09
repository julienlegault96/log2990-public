import { injectable } from "inversify";
import { Request, Response, NextFunction } from "express";

import { ErrorFinder } from "../../services/error-finder/error-finder";

import { CODES } from "../../../../common/communication/response-codes";
import { Coordinates } from "../../../../common/game/coordinates";
import { ImageView } from "../../../../common/game/image-view";

import { GamesRoute } from "../games/games.route";
import { FileService } from "../../services/file/file.service";

@injectable()
export class ImgDiffRoute {

    private fileService: FileService;

    public constructor() {
        this.fileService = new FileService();
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

            return errorFinder.findError(coordinates, this.fileService.getBufferFromBase64(imgData));
        }

        return [];
    }

    private async getDiffImgData(id: string, imageView: ImageView): Promise<string | undefined> {
        return GamesRoute.cachedDiffImagesMap[id][Number(imageView)];
    }

}
