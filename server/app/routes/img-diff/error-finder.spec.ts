import { expect } from "chai";
import { ErrorFinder } from "./error-finder";
import * as util from "util";
import * as fs from "fs";

import { Coordinates } from "../../../../common/game/coordinates";
import { Pixel } from "./pixel";

describe("ErrorFinder service", () => {
    // set up fixtures
    const errorFinder: ErrorFinder = new ErrorFinder();
    let buffer: Buffer;
    before(async () => {
        buffer = await util.promisify(fs.readFile)("./test_assets/oneError.bmp");
        errorFinder["imageBuffer"] = buffer;
    });

    it("should get position", async () => {
        const position: number = errorFinder["getPosition"]({ x: 0, y: 0 });
        const headerSize: number = 54;
        const imageWidth: number = 50;
        const imageHeight: number = 50;
        const byteDepth: number = 3;
        const expectedPosition: number = headerSize + imageWidth * imageHeight * byteDepth;
        expect(position).to.be.equal(expectedPosition);
    });

    it("should get position", async () => {
        const position: number = errorFinder["getPosition"]({ x: 51, y: 51 });
        const headerSize: number = 54;
        const expectedPosition: number = headerSize;
        const offset: number = 1;
        expect(position).to.be.equal(expectedPosition + offset);
    });

    it("should not detect difference", async () => {
        // on a du blanc ici
        const isDifference: boolean = errorFinder["isDifference"]({ x: 0, y: 0 });
        expect(isDifference).to.be.equal(false);
    });

    it("should detect difference", async () => {
        // on a du noir ici
        const isDifference: boolean = errorFinder["isDifference"]({ x: 40, y: 10 });
        expect(isDifference).to.be.equal(true);
    });

    it("should return image width", async () => {
        const width: number = ErrorFinder.getImageWidth(buffer);
        const expectedWidth: number = 50;
        expect(width).to.be.equal(expectedWidth);
    });

    it("should return image height", async () => {
        const width: number = ErrorFinder.getImageHeight(buffer);
        const expectedHeight: number = 50;
        expect(width).to.be.equal(expectedHeight);
    });

    it("should return adjacent pixels", async () => {
        const pixels: Array<Coordinates> = errorFinder["getAdjacentPixels"]({ x: 0, y: 0 });
        // le coin retourne seulement les coordinates valides
        const expectedPixels: Array<Coordinates> = [
            { x: 0, y: 1 },
            { x: 1, y: 0 },
            { x: 1, y: 1 },
        ];

        const result: boolean = pixels.every((pixel: Coordinates) =>
            expectedPixels.some((expectedPixel: Coordinates) =>
                expectedPixel.x === pixel.x && expectedPixel.y === pixel.y));

        expect(pixels.length).to.be.equal(expectedPixels.length);
        expect(result).to.be.equal(true);
    });

    it("should return adjacent pixels", async () => {
        const pixels: Array<Coordinates> = errorFinder["getAdjacentPixels"]({ x: 1, y: 1 });
        const expectedPixels: Array<Coordinates> = [
            { x: 0, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: 2 },
            { x: 1, y: 0 },
            { x: 1, y: 2 },
            { x: 2, y: 0 },
            { x: 2, y: 1 },
            { x: 2, y: 2 },
        ];

        const result: boolean = pixels.every((pixel: Coordinates) =>
            expectedPixels.some((expectedPixel: Coordinates) =>
                expectedPixel.x === pixel.x && expectedPixel.y === pixel.y));

        expect(pixels.length).to.be.equal(expectedPixels.length);
        expect(result).to.be.equal(true);
    });

    it("should return rgb value", async () => {
        // on a du blanc ici
        const pixel: Pixel = errorFinder["getPixelValue"]({ x: 0, y: 0 });
        expect(pixel).to.be.deep.equal({ red: 255, green: 255, blue: 255 });
    });

    it("should return rgb value", async () => {
        // on a du noir ici
        const pixel: Pixel = errorFinder["getPixelValue"]({ x: 40, y: 10 });
        expect(pixel).to.be.deep.equal({ red: 0, green: 0, blue: 0 });
    });

});
