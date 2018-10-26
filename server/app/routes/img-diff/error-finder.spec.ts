import { expect } from "chai";
import { ErrorFinder } from "./error-finder";
import * as util from "util";
import * as fs from "fs";

import { Coordinates } from "../../../../common/game/coordinates";

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
        const isDifference: boolean = errorFinder["isDifference"]({ x: 0, y: 0 });
        expect(isDifference).to.be.equal(false);
    });

    it("should detect difference", async () => {
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
        const expectedPixels: Array<Coordinates> = [
            { x: 0, y: 1 },
            { x: 1, y: 0 },
            { x: 1, y: 1 },
        ];
        expect(pixels.length).to.be.equal(expectedPixels.length);
        expect(pixels.map((pixel: Coordinates) => `${pixel.x},${pixel.y}`).sort())
            .to.be.eql(expectedPixels.map((pixel: Coordinates) => `${pixel.x},${pixel.y}`).sort());
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
        expect(pixels.length).to.be.equal(expectedPixels.length);
        expect(pixels.map((pixel: Coordinates) => `${pixel.x},${pixel.y}`).sort())
            .to.be.eql(expectedPixels.map((pixel: Coordinates) => `${pixel.x},${pixel.y}`).sort());
    });

});
