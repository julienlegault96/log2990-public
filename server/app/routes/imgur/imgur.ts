import { injectable } from "inversify";

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
        return new Promise<string>((resolve: Function, reject: Function) => {
            this.imgurApi.uploadBase64(this.parseBase64(imgBase64))
                // Structure de la reponse dynamique depuis Imgur
                // tslint:disable-next-line:no-any
                .then((json: any) => {
                    if (json.status && json.status === CODES.OK && json.data) {
                        resolve(json.data.link);
                    } else {
                        reject("Imgur API Error");
                    }
                })
                .catch((err: string) => {
                    reject("Imgur Uploading Error");
                });
        });
    }

    private parseBase64(base64Data: string): string {
        const base64Prefix: string = "data:image/bmp;base64,";
        if (base64Data.startsWith(base64Prefix)) {
            return base64Data.substr(base64Prefix.length);
        } else {
            return base64Data;
        }
    }

}
