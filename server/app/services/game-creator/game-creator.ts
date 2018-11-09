import { FileService } from "../file/file.service";
import { DifferenceCounter } from "../difference-counter/difference-counter";
import { GameImagesIndex } from "../../routes/games/game-images-index";

export class GameCreator {

    private fileService: FileService;

    private readonly toolsPath: string = "./tools/";
    private readonly bmpDiffExecPath: string = `${this.toolsPath}bmpdiff.exe`;
    private readonly genMultiExecPath: string = `${this.toolsPath}genmulti.exe`;
    private readonly imagesGeneratorMaximumTries: number = 4;
    private readonly IMAGES_SIZE_DOUBLE_VIEW: number = 6;

    // Generated images from genmulti
    private readonly outputPrefix: string = "output";
    private readonly firstViewOriginalPath: string = `${this.outputPrefix}_a_ori.bmp`;
    private readonly firstViewModifiedPath: string = `${this.outputPrefix}_a_mod.bmp`;
    private readonly secondViewOriginalPath: string = `${this.outputPrefix}_b_ori.bmp`;
    private readonly secondViewModifiedPath: string = `${this.outputPrefix}_b_mod.bmp`;

    private readonly outputPath: string = `${this.outputPrefix}.bmp`;

    private readonly DIFFERENCE_REQUIRED: number = 7;
    private readonly errorCountException: string = "errorCount";

    public constructor() {
        this.fileService = new FileService();
    }

    public async generateImageDiff(originalImagePath: string, modifiedImagePath: string): Promise<string> {
        await this.fileService.execFile(this.bmpDiffExecPath, [originalImagePath, modifiedImagePath, this.outputPath]);

        const output: string = await this.fileService.readFileInBase64(this.getToolsPath(this.outputPath));

        const isValidCount: boolean = await new DifferenceCounter(this.DIFFERENCE_REQUIRED)
            .hasValidDifferenceCount(this.getToolsPath(this.outputPath));

        if (!isValidCount) {
            throw new Error(this.errorCountException);
        }

        await this.fileService.deleteFile(this.getToolsPath(this.outputPath));

        return output;
    }

    // tslint:disable-next-line:max-func-body-length
    public async generate3DImagesDiff(): Promise<string[]> {
        const images: Array<string> = new Array<string>(this.IMAGES_SIZE_DOUBLE_VIEW).fill("");

        for (let i: number = 0; i < this.imagesGeneratorMaximumTries; i++) {
            await this.exec3DImage();

            images[GameImagesIndex.FirstViewDifference] = "";
            images[GameImagesIndex.SecondViewDifference] = "";

            await this.generateImageDiff(this.firstViewOriginalPath, this.firstViewModifiedPath)
                .then((value: string) => {
                    images[GameImagesIndex.FirstViewDifference] = value;
                })
                .catch((error: Error) => {
                    if (error.message !== this.errorCountException) {
                        throw error;
                    }
                });

            // first view has invalid difference count, skip
            if (images[GameImagesIndex.FirstViewDifference] === "") {
                continue;
            }

            await this.generateImageDiff(this.secondViewOriginalPath, this.secondViewModifiedPath)
                .then((value: string) => {
                    images[GameImagesIndex.SecondViewDifference] = value;
                })
                .catch((error: Error) => {
                    if (error.message !== this.errorCountException) {
                        throw error;
                    }
                });

            if (this.isValidGeneratedImages(images)) {
                break;
            }
        }
        images[GameImagesIndex.FirstViewOriginal] = await this.fileService.readFileInBase64(this.getToolsPath(this.firstViewOriginalPath));
        images[GameImagesIndex.FirstViewModified] = await this.fileService.readFileInBase64(this.getToolsPath(this.firstViewModifiedPath));
        images[GameImagesIndex.SecondViewOriginal] = await this.fileService.readFileInBase64(this.getToolsPath(this.secondViewOriginalPath));
        images[GameImagesIndex.SecondViewModified] = await this.fileService.readFileInBase64(this.getToolsPath(this.secondViewModifiedPath));

        await this.fileService.deleteFiles(
            this.getToolsPath(this.firstViewOriginalPath),
            this.getToolsPath(this.firstViewModifiedPath),
            this.getToolsPath(this.secondViewOriginalPath),
            this.getToolsPath(this.secondViewModifiedPath),
        );

        if (!this.isValidGeneratedImages(images)) {
            throw new Error(this.errorCountException);
        }

        return images;
    }

    private isValidGeneratedImages(images: string[]): boolean {
        return images[GameImagesIndex.FirstViewDifference] !== "" && images[GameImagesIndex.SecondViewDifference] !== "";
    }

    private async exec3DImage(): Promise<void> {
        // TODO
        await this.fileService.execFile(this.genMultiExecPath, ["geo", "20", "asc", this.outputPrefix])
            .catch(console.log);
    }

    private getToolsPath(filename: string): string {
        return `${this.toolsPath}${filename}`;
    }

}
