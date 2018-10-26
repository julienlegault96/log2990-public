import { expect } from "chai";
import { ErrorFinder } from "./error-finder";
import * as util from "util";
import * as fs from "fs";

describe("ErrorFinder service", () => {
    // set up fixtures
    const errorFinder: ErrorFinder = new ErrorFinder();
    before(async () => {
        const buffer: Buffer = await util.promisify(fs.readFile)("./test_assets/oneError.bmp");
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

});
