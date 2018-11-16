import { injectable } from "inversify";

import { CODES } from "../../../../common/communication/response-codes";

@injectable()

export class Imgur {

    // tslint:disable-next-line:no-any
    private imgurApi: any;

    private readonly IMGUR_API: string = "https://api.imgur.com/3/";
    private readonly IMGUR_USERNAME: string = "kevin.pastor@polymtl.ca";
    private readonly IMGUR_PASSWORD: string = "log2990";
    private readonly IMGUR_CLIENT_ID: string = "f70c85481f5e351";

    public constructor() {
        this.imgurApi = require("imgur");
        this.imgurApi.setAPIUrl(this.IMGUR_API);
        this.imgurApi.setCredentials(this.IMGUR_USERNAME, this.IMGUR_PASSWORD, this.IMGUR_CLIENT_ID);
    }

    public uploadImages(...images: Array<string>): Promise<Array<string>> {
        const promises: Array<Promise<string>> = [];

        for (const image of images) {
            promises.push(this.uploadImage(image));
        }

        return Promise.all(promises);
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
