import { expect } from "chai";
import { ImgDiff } from "./imgdiff";
import { Mongo } from "../../services/mongo";
import { GAMES } from "../../../../common/game/mock-games";
import { ImageView } from "../../../../common/game/image-view";
import { Coordinates } from "../../../../common/game/coordinates";
import * as util from "util";
import * as fs from "fs";

describe("Imgdiff service", () => {
    const imgdiff: ImgDiff = new ImgDiff(new Mongo());

    it("should parse base64", async () => {
        const data: string = "data:image/bmp;base64,-----";
        const parsedData: string = ImgDiff.parseBase64(data);

        expect(parsedData).to.be.equal("-----");
    });

    it("should parse base64", async () => {
        const data: string = "-----";
        const parsedData: string = ImgDiff.parseBase64(data);

        expect(parsedData).to.be.equal("-----");
    });

    it("should return image data", async () => {
        imgdiff["getById"] = async () => GAMES[0];

        // ce test retourne toujours un string
        const imgDiffData: string = await imgdiff["getDiffImgData"]("gameId", ImageView.FirstView) as string;

        const firstViewDiffIndex: number = 2;
        const expectedImgDiffData: string = GAMES[0].imageUrl[firstViewDiffIndex];
        expect(imgDiffData).to.be.equal(expectedImgDiffData);
    });

    it("should return empty error coordinates", async () => {
        const buffer: Buffer = await util.promisify(fs.readFile)("./test_assets/sevenErrors.bmp");
        imgdiff["getImgBuffer"] = () => buffer;

        const coordinates: Coordinates = { x: 0, y: 0 };
        const errorPixels: Array<Coordinates> = await imgdiff["getDifferencePixel"]("gameId", ImageView.FirstView, coordinates);
        const expectedErrorPixels: Array<Coordinates> = [];

        const result: boolean = errorPixels.every((pixel: Coordinates) =>
            expectedErrorPixels.some((expectedPixel: Coordinates) =>
                expectedPixel.x === pixel.x && expectedPixel.y === pixel.y));

        expect(errorPixels.length).to.be.equal(expectedErrorPixels.length);
        expect(result).to.be.equal(true);
    });

    // tslint:disable-next-line:max-func-body-length
    it("should return error coordinates", async () => {
        const buffer: Buffer = await util.promisify(fs.readFile)("./test_assets/sevenErrors.bmp");
        imgdiff["getImgBuffer"] = () => buffer;

        const coordinates: Coordinates = { x: 9, y: 9 };
        const errorPixels: Array<Coordinates> = await imgdiff["getDifferencePixel"]("gameId", ImageView.FirstView, coordinates);
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
