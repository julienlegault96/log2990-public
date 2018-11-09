import { FileService } from "../file/file.service";
import { DifferenceCounter } from "../difference-counter/difference-counter";

export class GameCreator {

    private fileService: FileService;

    private readonly toolsPath: string = "./tools/";
    private readonly bmpDiffExecPath: string = `${this.toolsPath}bmpdiff.exe`;

    private readonly outputPrefix: string = "output";
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

    private getToolsPath(filename: string): string {
        return `${this.toolsPath}${filename}`;
    }

}
