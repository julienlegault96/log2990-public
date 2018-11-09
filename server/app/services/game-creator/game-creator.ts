import { ImgDiffRoute } from "../../routes/img-diff/imgdiff.route";

import { FileService } from "../file/file.service";
import { ImageGenerator } from "../image-generator/image-generator";
import { Imgur } from "../imgur/imgur";

import { ImagesIndex } from "../../routes/games/images-index";
import { GenMultiParameters } from "./gen-multi-parameters";

export class GameCreator {

    private fileService: FileService;
    private imageGenerator: ImageGenerator;
    private imgur: Imgur;

    // Executables
    private readonly toolsPath: string = "./tools/";

    // Generated images from genmulti
    private readonly outputPrefix: string = "output";
    private readonly firstViewOriginalPath: string = `${this.outputPrefix}_a_ori.bmp`;
    private readonly firstViewModifiedPath: string = `${this.outputPrefix}_a_mod.bmp`;

    public constructor() {
        this.fileService = new FileService();
        this.imageGenerator = new ImageGenerator();
        this.imgur = new Imgur();
    }

    public async singleViewUpload(originalImageBase64: string, modifiedImageBase64: string): Promise<string[]> {
        const rawBitmap: Buffer = this.getImageBufferFromBase64(originalImageBase64);
        await this.fileService.writeFile(this.getToolsPath(this.firstViewOriginalPath), rawBitmap);

        const modifiedBitmap: Buffer = this.getImageBufferFromBase64(modifiedImageBase64);
        await this.fileService.writeFile(this.getToolsPath(this.firstViewModifiedPath), modifiedBitmap);

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

    public async doubleViewUpload(parameters: GenMultiParameters): Promise<string[]> {
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

    private getToolsPath(filename: string): string {
        return `${this.toolsPath}${filename}`;
    }

    private getImageBufferFromBase64(base64: string): Buffer {
        return Buffer.from(ImgDiffRoute.parseBase64(base64), "base64");
    }

}
