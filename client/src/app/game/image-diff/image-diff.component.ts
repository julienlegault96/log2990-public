import { Component, OnInit } from "@angular/core";
import { ImgDiffService } from "src/app/services/img-diff.service";
import { Coordinates } from "../../../../../common/game/coordinates";
import { ImageView } from "../../../../../common/game/image-view";

@Component({
    selector: "app-image-diff",
    templateUrl: "./image-diff.component.html",
    styleUrls: ["./image-diff.component.css"]
})

export class ImageDiffComponent implements OnInit {

    private originalCtx: CanvasRenderingContext2D;
    private modifiedCtx: CanvasRenderingContext2D;
    private originalImageSrc: string;
    private modifiedImageSrc: string;
    private gameId: number;
    private imageView: ImageView;

    public constructor(private imgDiffService: ImgDiffService) {
        this.originalImageSrc = "https://i.imgur.com/qQQYnx8.png";
        this.modifiedImageSrc = "https://i.imgur.com/1lgyTWK.png";
        this.imageView = ImageView.FirstView;
        this.gameId = 804690;
    }

    public ngOnInit(): void {
        const originalImage: HTMLImageElement = new Image();
        originalImage.crossOrigin = "Anonymous";
        originalImage.src = this.originalImageSrc;
        this.originalCtx = this.getContext("original");
        originalImage.onload = () => {
            this.originalCtx.drawImage(originalImage, 0, 0);
            originalImage.style.display = "none";
        };

        const modifiedImage: HTMLImageElement = new Image();
        modifiedImage.crossOrigin = "Anonymous";
        modifiedImage.src = this.modifiedImageSrc;
        this.modifiedCtx = this.getContext("modified");
        modifiedImage.onload = () => {
            this.modifiedCtx.drawImage(modifiedImage, 0, 0);
            modifiedImage.style.display = "none";
        };
    }

    public isClicked(event: MouseEvent): void {
        // https://stackoverflow.com/questions/3234256/find-mouse-position-relative-to-element
        // tslint:disable-next-line:no-any
        const target: HTMLCanvasElement = event.target as HTMLCanvasElement;

        if (target) {
            const rect: DOMRect = target.getBoundingClientRect() as DOMRect;
            const x: number = event.clientX - rect.left;
            const y: number = event.clientY - rect.top;
            this.imgDiffService.getDiff(this.gameId, this.imageView, x, y)
                .subscribe((values: Array<Coordinates>) => {
                    this.updateModifiedImage(values);
                });
        }
    }

    private updateModifiedImage(errorCoordinates: Array<Coordinates>): void {
        if (errorCoordinates.length === 0) {
            return;
        }

        const originalImageBuffer: Uint8ClampedArray = this.getImageBuffer("original");

        const modifiedImage: ImageData = this.getImage("modified");
        const modifiedImageBuffer: Uint8ClampedArray = modifiedImage.data;

        const redOffset: number = 0;
        const greenOffset: number = 1;
        const blueOffset: number = 2;
        const alphaOffset: number = 3;

        errorCoordinates.map((coordinates: Coordinates) => {
            const index: number = this.getPosition(coordinates, this.getCanvas("modified"));

            modifiedImageBuffer[index + redOffset] =
                originalImageBuffer[index + redOffset];
            modifiedImageBuffer[index + greenOffset] =
                originalImageBuffer[index + greenOffset];
            modifiedImageBuffer[index + blueOffset] =
                originalImageBuffer[index + blueOffset];
            modifiedImageBuffer[index + alphaOffset] =
                originalImageBuffer[index + alphaOffset];
        });
        this.modifiedCtx.putImageData(modifiedImage, 0, 0);
    }

    private getPosition(coordinates: Coordinates, canvas: HTMLCanvasElement): number {
        const byteDepth: number = 4;

        return ((coordinates.y) * canvas.width + coordinates.x) * byteDepth;
    }

    private getImageBuffer(id: string): Uint8ClampedArray {
        return this.getImage(id).data;
    }

    private getImage(id: string): ImageData {
        const canvas: HTMLCanvasElement = this.getCanvas(id);

        return this.getContext(id).getImageData(0, 0, canvas.width, canvas.height);
    }

    private getContext(id: string): CanvasRenderingContext2D {
        const context: CanvasRenderingContext2D = this.getCanvas(id).getContext("2d") as CanvasRenderingContext2D;

        if (context) {
            return context;
        } else {
            throw new Error("Invalid context");
        }
    }

    private getCanvas(id: string): HTMLCanvasElement {
        const element: HTMLCanvasElement = document.getElementById(id) as HTMLCanvasElement;

        if (element) {
            return element;
        } else {
            throw new Error("Invalid element id");
        }
    }

}
