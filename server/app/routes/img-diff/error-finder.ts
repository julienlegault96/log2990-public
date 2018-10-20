import { Coordinates } from "./coordinates";
import { Pixel } from "./pixel";

export class ErrorFinder {

    public getConnectedPixels(initialCoordinates: Coordinates, image: Buffer): Array<Coordinates> {
        const connectedPixels: Array<Coordinates> = [];
        if (this.isDifference(initialCoordinates, image)) {
            const stack: Array<Coordinates> = [initialCoordinates];
            let currentCoordinates: Coordinates | undefined;
            while (currentCoordinates = stack.pop()) {
                const adjacentPixels: Array<Coordinates> = this.getAdjacentPixels(currentCoordinates);
                adjacentPixels.map((coordinates: Coordinates) => {
                    if (this.isDifference(coordinates, image)
                        && connectedPixels.findIndex((elem: Coordinates) => coordinates.x === elem.x && coordinates.y === elem.y) === -1
                        && stack.findIndex((elem: Coordinates) => coordinates.x === elem.x && coordinates.y === elem.y) === -1) {
                        stack.push(coordinates);
                    }
                });
                connectedPixels.push(currentCoordinates);
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

    private isDifference(coordinates: Coordinates, image: Buffer): boolean {
        const pixel: Pixel = this.getPixelValue(coordinates, image);

        return pixel.red === 0
            && pixel.green === 0
            && pixel.blue === 0;
    }

    private getPixelValue(coordinates: Coordinates, image: Buffer): Pixel {
        const redOffset: number = 0;
        const greenOffset: number = 1;
        const blueOffset: number = 2;

        const position: number = this.getPosition(coordinates, image);

        return {
            red: image[position + redOffset],
            green: image[position + greenOffset],
            blue: image[position + blueOffset],
        };
    }

    private getPosition(coordinates: Coordinates, image: Buffer): number {
        const paddingByte: number = 4;
        const byteDepth: number = 3;
        const width: number = this.getImageWidth(image);
        const headerSize: number = 54;

        return headerSize + (width * (width - 1 - coordinates.y) + coordinates.x) * byteDepth
            + (width * (width - 1 - coordinates.y)) % paddingByte;
    }

    private getImageWidth(image: Buffer): number {
        // Le width de l'image bmp est sur 4 bytes
        // tslint:disable-next-line:no-bitwise no-magic-numbers
        return ((image[21] << 8 | image[20]) << 8 | image[19]) << 8 | image[18];
    }

    // private getImageHeight(image: Buffer): number {
    //     // Le height de l'image bmp est sur 4 bytes
    //     // tslint:disable-next-line:no-bitwise no-magic-numbers
    //     return ((image[25] << 8 | image[24]) << 8 | image[23]) << 8 | image[22];
    // }

}
