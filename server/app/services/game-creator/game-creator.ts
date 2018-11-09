import { FileService } from "../file/file.service";
import { ImageGenerator } from "../image-generator/image-generator";
import { Imgur } from "../imgur/imgur";

import { ImagesIndex } from "../../routes/games/images-index";
import { GenMultiParameters } from "./gen-multi-parameters";

export class GameCreator {

    private fileService: FileService;
    private imageGenerator: ImageGenerator;
    private imgur: Imgur;

    // Single view images
    private readonly toolsPath: string = "./tools/";
    private readonly outputPrefix: string = "output";
    private readonly firstViewOriginalPath: string = `${this.outputPrefix}_a_ori.bmp`;
    private readonly firstViewModifiedPath: string = `${this.outputPrefix}_a_mod.bmp`;

    public constructor() {
        this.fileService = new FileService();
        this.imageGenerator = new ImageGenerator();
        this.imgur = new Imgur();
    }

    public async singleViewUpload(originalImageBase64: string, modifiedImageBase64: string): Promise<Array<string>> {
        await this.writeImages(originalImageBase64, modifiedImageBase64);

        return this.imageGenerator.generateImage(
            this.firstViewOriginalPath,
            this.firstViewModifiedPath
        ).then(async (imageDiff: string) => {
            return this.imgur.uploadImages(
                originalImageBase64,
                modifiedImageBase64
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

    public async doubleViewUpload(parameters: GenMultiParameters): Promise<Array<string>> {
        return this.imageGenerator.generateImages(parameters)
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

    private async writeImages(originalImageBase64: string, modifiedImageBase64: string): Promise<void> {
        const rawBitmap: Buffer = this.fileService.getBufferFromBase64(originalImageBase64);
        await this.fileService.writeFile(this.getToolsPath(this.firstViewOriginalPath), rawBitmap);

        const modifiedBitmap: Buffer = this.fileService.getBufferFromBase64(modifiedImageBase64);
        await this.fileService.writeFile(this.getToolsPath(this.firstViewModifiedPath), modifiedBitmap);
    }

    private getToolsPath(filename: string): string {
        return `${this.toolsPath}${filename}`;
    }

}
