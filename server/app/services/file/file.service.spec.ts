import { expect } from "chai";
import { FileService } from "./file.service";

describe("ImgDiff route", () => {

    let fileSerive: FileService;
    beforeEach(() => {
        fileSerive = new FileService();
    });

    it("should parse base64", async () => {
        const data: string = "data:image/bmp;base64,-----";
        const parsedData: string = fileSerive["parseBase64"](data);

        expect(parsedData).to.be.equal("-----");
    });

    it("should parse base64", async () => {
        const data: string = "-----";
        const parsedData: string = fileSerive["parseBase64"](data);

        expect(parsedData).to.be.equal("-----");
    });

});
