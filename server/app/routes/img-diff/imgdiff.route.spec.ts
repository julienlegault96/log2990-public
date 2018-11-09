import { expect } from "chai";
import { ImgDiffRoute } from "./imgdiff.route";
import { ImageView } from "../../../../common/game/image-view";
import { Coordinates } from "../../../../common/game/coordinates";
import * as util from "util";
import * as fs from "fs";

describe("ImgDiff route", () => {

    let imgDiffRoute: ImgDiffRoute;
    beforeEach(() => {
        imgDiffRoute = new ImgDiffRoute();
    });

    it("should return empty error coordinates", async () => {
        imgDiffRoute["getDiffImgData"] = async () => "imageData";

        const buffer: Buffer = await util.promisify(fs.readFile)("./test_assets/sevenErrors.bmp");
        imgDiffRoute["fileService"]["getBufferFromBase64"] = () => buffer;

        const coordinates: Coordinates = { x: 0, y: 0 };
        const errorPixels: Array<Coordinates> = await imgDiffRoute["getDifferencePixel"]("gameId", ImageView.FirstView, coordinates);
        const expectedErrorPixels: Array<Coordinates> = [];

        const result: boolean = errorPixels.every((pixel: Coordinates) =>
            expectedErrorPixels.some((expectedPixel: Coordinates) =>
                expectedPixel.x === pixel.x && expectedPixel.y === pixel.y));

        expect(errorPixels.length).to.be.equal(expectedErrorPixels.length);
        expect(result).to.be.equal(true);
    });

    // tslint:disable-next-line:max-func-body-length
    it("should return error coordinates", async () => {
        imgDiffRoute["getDiffImgData"] = async () => "imageData";

        const buffer: Buffer = await util.promisify(fs.readFile)("./test_assets/sevenErrors.bmp");
        imgDiffRoute["fileService"]["getBufferFromBase64"] = () => buffer;

        const coordinates: Coordinates = { x: 9, y: 9 };
        const errorPixels: Array<Coordinates> = await imgDiffRoute["getDifferencePixel"]("gameId", ImageView.FirstView, coordinates);
        const expectedErrorPixels: Array<Coordinates> = [
            { "x": 7, "y": 9 },
            { "x": 7, "y": 10 },
            { "x": 8, "y": 8 },
            { "x": 8, "y": 9 },
            { "x": 8, "y": 10 },
            { "x": 8, "y": 11 },
            { "x": 9, "y": 11 },
            { "x": 9, "y": 8 },
            { "x": 9, "y": 9 },
            { "x": 9, "y": 9 },
            { "x": 9, "y": 10 },
            { "x": 10, "y": 9 },
            { "x": 10, "y": 10 },
        ];

        const result: boolean = errorPixels.every((pixel: Coordinates) =>
            expectedErrorPixels.some((expectedPixel: Coordinates) =>
                expectedPixel.x === pixel.x && expectedPixel.y === pixel.y));

        expect(errorPixels.length).to.be.equal(expectedErrorPixels.length);
        expect(result).to.be.equal(true);
    });

});
