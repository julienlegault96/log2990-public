import { Coordinates } from "../../../../common/game/coordinates";
import { Pixel } from "./pixel";

export class ErrorFinder {

    private imageBuffer: Buffer;

    public findError(initialCoordinates: Coordinates, imageBuffer: Buffer): Array<Coordinates> {
        this.imageBuffer = imageBuffer;

        if (this.isDifference(initialCoordinates)) {
            return this.getConnectedPixels(initialCoordinates);
        } else {
            return [];
        }
    }

    private getConnectedPixels(initialCoordinates: Coordinates): Array<Coordinates> {
        const connectedPixels: Array<Coordinates> = [];
        const usedPixels: Object = {};
        const stack: Array<Coordinates> = [initialCoordinates];

        while (stack.length > 0) {
            // la condition du while verifie que pop ne retournera pas undefined
            connectedPixels.push(stack.pop() as Coordinates);
            for (const coordinates of this.getAdjacentPixels(connectedPixels[connectedPixels.length - 1])) {
                if (this.isDifference(coordinates)) {
                    const position: number = this.getPosition(coordinates);
                    if (usedPixels[position] !== true) {
                        usedPixels[position] = true;
                        stack.push(coordinates);
                    }
                }
            }
        }

        return connectedPixels;
    }

    private getAdjacentPixels(coordinates: Coordinates): Array<Coordinates> {
        const adjacentPixels: Array<Coordinates> = [
            { x: coordinates.x + 1, y: coordinates.y },
            { x: coordinates.x, y: coordinates.y + 1 },
            { x: coordinates.x + 1, y: coordinates.y + 1 },
        ];

        if (coordinates.x > 0) {
            adjacentPixels.push(
                { x: coordinates.x - 1, y: coordinates.y },
                { x: coordinates.x - 1, y: coordinates.y + 1 }
            );
        }

        if (coordinates.y > 0) {
            adjacentPixels.push(
                { x: coordinates.x, y: coordinates.y - 1 },
                { x: coordinates.x + 1, y: coordinates.y - 1 }
            );
        }

        if (coordinates.x > 0 && coordinates.y > 0) {
            adjacentPixels.push(
                { x: coordinates.x - 1, y: coordinates.y - 1 }
            );
        }

        return adjacentPixels;
    }

    private isDifference(coordinates: Coordinates): boolean {
        const pixel: Pixel = this.getPixelValue(coordinates);

        return pixel.red === 0
            && pixel.green === 0
            && pixel.blue === 0;
    }

    private getPixelValue(coordinates: Coordinates): Pixel {
        const redOffset: number = 0;
        const greenOffset: number = 1;
        const blueOffset: number = 2;

        const position: number = this.getPosition(coordinates);

        return {
            red: this.imageBuffer[position + redOffset],
            green: this.imageBuffer[position + greenOffset],
            blue: this.imageBuffer[position + blueOffset],
        };
    }

    private getPosition(coordinates: Coordinates): number {
        const paddingByte: number = 4;
        const byteDepth: number = 3;
        const headerSize: number = 54;
        const lineOffset: number = this.getImageWidth() * (this.getImageHeight() - coordinates.y);

        return headerSize + (lineOffset + coordinates.x) * byteDepth
            + lineOffset % paddingByte;
    }

    private getImageWidth(): number {
        // Le width de l'image bmp est sur 4 bytes
        // tslint:disable-next-line:no-bitwise no-magic-numbers
        return ((this.imageBuffer[21] << 8 | this.imageBuffer[20]) << 8 | this.imageBuffer[19]) << 8 | this.imageBuffer[18];
    }

    private getImageHeight(): number {
        // Le height de l'image bmp est sur 4 bytes
        // tslint:disable-next-line:no-bitwise no-magic-numbers
        return ((this.imageBuffer[25] << 8 | this.imageBuffer[24]) << 8 | this.imageBuffer[23]) << 8 | this.imageBuffer[22];
    }

}
