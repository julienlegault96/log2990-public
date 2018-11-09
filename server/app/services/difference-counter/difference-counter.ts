import { FileService } from "../file/file.service";
import { ErrorFinder } from "../error-finder/error-finder";
import { Coordinates } from "../../../../common/game/coordinates";

export class DifferenceCounter {

    private readonly differencesRequired: number;

    public constructor(differencesRequired: number) {
        this.differencesRequired = differencesRequired;
    }

    public async hasValidDifferenceCount(filepath: string): Promise<boolean> {
        const differenceCount: number = await this.CountDifferences(filepath);

        return differenceCount === this.differencesRequired;
    }

    private async CountDifferences(filepath: string): Promise<number> {
        const seen: Object = {};
        let nbError: number = 0;

        const fileService: FileService = new FileService();
        const bitmapBuffer: Buffer = await fileService.readFile(filepath);
        const errorFinder: ErrorFinder = new ErrorFinder();

        for (let i: number = 0; i < ErrorFinder.getImageWidth(bitmapBuffer); i++) {
            for (let j: number = 0; j < ErrorFinder.getImageHeight(bitmapBuffer); j++) {
                const coordinates: Coordinates = { x: i, y: j };

                if (!seen[`${coordinates.x},${coordinates.y}`]) {
                    const errorPixels: Array<Coordinates> = errorFinder.findError(coordinates, bitmapBuffer);

                    if (errorPixels.length > 0) {
                        nbError++;
                        errorPixels.forEach((errorCoordinates: Coordinates) => {
                            seen[`${errorCoordinates.x},${errorCoordinates.y}`] = true;
                        });
                    } else {
                        seen[`${coordinates.x},${coordinates.y}`] = true;
                    }
                }
            }
        }

        return nbError;
    }

}
