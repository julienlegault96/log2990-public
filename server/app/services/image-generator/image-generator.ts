import { FileService } from "../file/file.service";
import { DifferenceCounter } from "../difference-counter/difference-counter";
import { ImagesIndex } from "../../models/images-index";

import { GenMultiParameters } from "../../../../common/communication/gen-multi-parameters";

export class ImageGenerator {

    private fileService: FileService;

    private readonly toolsPath: string = "./tools/";
    private readonly bmpDiffExecPath: string = `${this.toolsPath}bmpdiff.exe`;
    private readonly genMultiExecPath: string = `${this.toolsPath}genmulti.exe`;
    private readonly imagesGeneratorMaximumTries: number = 4;

    // Generated images from genmulti
    private readonly outputPrefix: string = "output";
    private readonly firstViewOriginalPath: string = `${this.outputPrefix}_a_ori.bmp`;
    private readonly firstViewModifiedPath: string = `${this.outputPrefix}_a_mod.bmp`;
    private readonly secondViewOriginalPath: string = `${this.outputPrefix}_b_ori.bmp`;
    private readonly secondViewModifiedPath: string = `${this.outputPrefix}_b_mod.bmp`;
    private readonly differenceOutputPath: string = `${this.outputPrefix}.bmp`;

    private readonly DIFFERENCE_REQUIRED: number = 7;
    private readonly errorCountException: string = "errorCount";

    public constructor() {
        this.fileService = new FileService();
    }

    public async generateImage(originalImagePath: string, modifiedImagePath: string): Promise<string> {
        await this.fileService.execFile(this.bmpDiffExecPath, [originalImagePath, modifiedImagePath, this.differenceOutputPath]);

        const output: string = await this.fileService.readFileInBase64(this.getToolsPath(this.differenceOutputPath));

        const isValidCount: boolean = await new DifferenceCounter(this.DIFFERENCE_REQUIRED)
            .hasValidDifferenceCount(this.getToolsPath(this.differenceOutputPath));

        if (!isValidCount) {
            throw new Error(this.errorCountException);
        }

        await this.fileService.deleteFile(this.getToolsPath(this.differenceOutputPath));

        return output;
    }

    public async generateImages(genMultiParameters: GenMultiParameters): Promise<Array<string>> {
        let images: Array<string> = ["", "", "", "", "", ""];

        for (let i: number = 0; ((i < this.imagesGeneratorMaximumTries) && !this.isValidDifferenceImages(images)); i++) {
            await this.generateMultipleViewImages(genMultiParameters);

            images = await this.generateDiffImages();
        }

        images = await this.getGenerateImages(images);

        if (!this.isValidDifferenceImages(images)) {
            throw new Error(this.errorCountException);
        }

        return images;
    }

    private async generateDiffImages(): Promise<Array<string>> {
        const images: Array<string> = ["", "", "", "", "", ""];

        const viewsPath: Array<[ImagesIndex, [string, string]]> = [
            [ImagesIndex.FirstViewDifference, [this.firstViewOriginalPath, this.firstViewModifiedPath]],
            [ImagesIndex.SecondViewDifference, [this.secondViewOriginalPath, this.secondViewModifiedPath]],
        ];

        for (const currentView of viewsPath) {
            await this.generateImage(currentView[1][0], currentView[1][1])
                .then((value: string) => {
                    images[currentView[0]] = value;
                })
                .catch((error: Error) => {
                    if (error.message !== this.errorCountException) {
                        throw error;
                    }
                    images[currentView[0]] = "";
                });

            if (!this.isValidDifferenceImage(images[currentView[0]])) {
                break;
            }
        }

        return images;
    }

    private async getGenerateImages(images: Array<string>): Promise<Array<string>> {
        images[ImagesIndex.FirstViewOriginal] = await
            this.fileService.readFileInBase64(this.getToolsPath(this.firstViewOriginalPath));

        images[ImagesIndex.FirstViewModified] = await
            this.fileService.readFileInBase64(this.getToolsPath(this.firstViewModifiedPath));

        images[ImagesIndex.SecondViewOriginal] = await
            this.fileService.readFileInBase64(this.getToolsPath(this.secondViewOriginalPath));

        images[ImagesIndex.SecondViewModified] = await
            this.fileService.readFileInBase64(this.getToolsPath(this.secondViewModifiedPath));

        await this.fileService.deleteFiles(
            this.getToolsPath(this.firstViewOriginalPath),
            this.getToolsPath(this.firstViewModifiedPath),
            this.getToolsPath(this.secondViewOriginalPath),
            this.getToolsPath(this.secondViewModifiedPath),
        );

        return images;
    }

    private async generateMultipleViewImages(parameters: GenMultiParameters): Promise<void> {
        let modificationsParameter: string = "";

        if (parameters.modifications.add) {
            const addOption: string = "a";
            modificationsParameter += addOption;
        }
        if (parameters.modifications.delete) {
            const deleteOption: string = "s";
            modificationsParameter += deleteOption;
        }
        if (parameters.modifications.color) {
            const colorOption: string = "c";
            modificationsParameter += colorOption;
        }

        await this.fileService.execFile(this.genMultiExecPath, [
            parameters.type,
            parameters.quantity.toString(),
            modificationsParameter,
            this.outputPrefix]
        );
    }

    private isValidDifferenceImages(images: string[]): boolean {
        return this.isValidDifferenceImage(images[ImagesIndex.FirstViewDifference])
            && this.isValidDifferenceImage(images[ImagesIndex.SecondViewDifference]);
    }

    private isValidDifferenceImage(image: string): boolean {
        return image !== "";
    }

    private getToolsPath(filename: string): string {
        return `${this.toolsPath}${filename}`;
    }

}
