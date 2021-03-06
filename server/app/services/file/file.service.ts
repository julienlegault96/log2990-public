import { execFile } from "child_process";
import * as util from "util";
import * as fs from "fs";

export class FileService {

    public async readFile(filepath: string): Promise<Buffer> {
        return util.promisify(fs.readFile)(filepath);
    }

    public async readFileInBase64(filepath: string): Promise<string> {
        const buffer: Buffer = await this.readFile(filepath);

        return buffer.toString("base64");
    }

    public async writeFile(filepath: string, buffer: Buffer): Promise<void> {
        return util.promisify(fs.writeFile)(filepath, buffer);
    }

    public async execFile(filepath: string, params: Array<string>): Promise<void> {
        return util.promisify(execFile)(filepath, params)
            .then(() => { return; });
    }

    public async deleteFile(filepath: string): Promise<void> {
        return util.promisify(fs.unlink)(filepath);
    }

    public async deleteFiles(...filepaths: Array<string>): Promise<void> {
        for (const filepath of filepaths) {
            await this.deleteFile(filepath);
        }
    }

    public getBufferFromBase64(data: string): Buffer {
        return Buffer.from(this.parseBase64(data), "base64");
    }

    private parseBase64(data: string): string {
        const base64Prefix: string = "data:image/bmp;base64,";
        if (data.startsWith(base64Prefix)) {
            return data.substr(base64Prefix.length);
        } else {
            return data;
        }
    }

}
