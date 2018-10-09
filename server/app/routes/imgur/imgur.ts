import { injectable } from "inversify";

// import Types from "../../types";
import { CODES } from "../../../../common/communication/response-codes";

@injectable()

export class Imgur {

    // tslint:disable-next-line:no-any
    private imgurApi: any;

    public constructor() {
        this.imgurApi = require("imgur");
        this.imgurApi.setAPIUrl("https://api.imgur.com/3/");
        this.imgurApi.setCredentials("kevin.pastor@polymtl.ca", "log2990", "f70c85481f5e351");
    }

    public async uploadImage(imgBase64: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.imgurApi.uploadBase64(imgBase64)
                // tslint:disable-next-line:no-any
                .then((json: any) => {
                    if (json.status && json.status === CODES.OK && json.data) {
                        resolve(json.data.link);
                    } else {
                        reject("Imgur API Error");
                    }
                })
                .catch((err: string) => {
                    reject("Imgur Uploading Error" + err);
                });
        });
    }

}
