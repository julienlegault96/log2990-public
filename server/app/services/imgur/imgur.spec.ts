import { expect } from "chai";
import { Imgur } from "./imgur";

describe("Imgur service", () => {
    // set up fixtures

    const imgur: Imgur = new Imgur();

    it("should parse base64", async () => {
        const data: string = "data:image/bmp;base64,-----";
        const parsedData: string = imgur["parseBase64"](data);

        expect(parsedData).to.be.equal("-----");
    });

    it("should parse base64", async () => {
        const data: string = "-----";
        const parsedData: string = imgur["parseBase64"](data);

        expect(parsedData).to.be.equal("-----");
    });

});
