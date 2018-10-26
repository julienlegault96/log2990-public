import { expect } from "chai";
import { ImgDiff } from "./imgdiff";

describe("Imgdiff service", () => {
    // set up fixtures

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

});
