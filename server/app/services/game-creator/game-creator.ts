import { Request } from "express";

import { ImagesIndex } from "../../routes/games/images-index";
import { FileService } from "../file/file.service";
import { ImageGenerator } from "../image-generator/image-generator";
import { Imgur } from "../imgur/imgur";
import { ImgDiffRoute } from "../../routes/img-diff/imgdiff.route";

export class GameCreator {

    private fileService: FileService;
    private gameCreator: ImageGenerator;
    private imgur: Imgur;

    // Executables
    private readonly toolsPath: string = "./tools/";

    // Generated images from genmulti
    private readonly outputPrefix: string = "output";
    private readonly firstViewOriginalPath: string = `${this.outputPrefix}_a_ori.bmp`;
    private readonly firstViewModifiedPath: string = `${this.outputPrefix}_a_mod.bmp`;

    public constructor() {
        this.fileService = new FileService();
        this.gameCreator = new ImageGenerator();
        this.imgur = new Imgur();
    }

    public async singleViewUpload(req: Request): Promise<string[]> {
        const rawBitmap: Buffer = this.getImageBufferFromBase64(req.body.imageUrl[ImagesIndex.FirstViewOriginal]);
        await this.fileService.writeFile(this.getToolsPath(this.firstViewOriginalPath), rawBitmap);

        const modifiedBitmap: Buffer = this.getImageBufferFromBase64(req.body.imageUrl[ImagesIndex.FirstViewModified]);
        await this.fileService.writeFile(this.getToolsPath(this.firstViewModifiedPath), modifiedBitmap);

        return this.gameCreator.generateImage(
            this.firstViewOriginalPath,
            this.firstViewModifiedPath
        ).then(async (imageDiff: string) => {
            return this.imgur.uploadImages(
                req.body.imageUrl[ImagesIndex.FirstViewOriginal],
                req.body.imageUrl[ImagesIndex.FirstViewModified]
            ).then(async (imgurLinks: Array<string>) => {
                imgurLinks.splice(ImagesIndex.FirstViewDifference, 0, imageDiff);
                await this.fileService.deleteFiles(
                    this.getToolsPath(this.firstViewOriginalPath),
                    this.getToolsPath(this.firstViewModifiedPath),
                );

                return imgurLinks;
            });
        });
    }

    public async doubleViewUpload(req: Request): Promise<string[]> {
        return this.gameCreator.generateImages({ type: "geo", quantity: 20, modifications: { add: true, delete: true, color: true } })
            .then(async (imagesDiff: Array<string>) => {
                return this.imgur.uploadImages(
                    imagesDiff[ImagesIndex.FirstViewOriginal],
                    imagesDiff[ImagesIndex.FirstViewModified],
                    imagesDiff[ImagesIndex.SecondViewOriginal],
                    imagesDiff[ImagesIndex.SecondViewModified]
                ).then((imgurLinks: Array<string>) => {
                    imgurLinks.splice(ImagesIndex.FirstViewDifference, 0, imagesDiff[ImagesIndex.FirstViewDifference]);
                    imgurLinks.splice(ImagesIndex.SecondViewDifference, 0, imagesDiff[ImagesIndex.SecondViewDifference]);

                    return imgurLinks;
                });
            });
    }

    private getToolsPath(filename: string): string {
        return `${this.toolsPath}${filename}`;
    }

    private getImageBufferFromBase64(base64: string): Buffer {
        return Buffer.from(ImgDiffRoute.parseBase64(base64), "base64");
    }

}
