import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef } from "@angular/core";
import { ImgDiffService } from "src/app/services/img-diff.service";
import { Coordinates } from "../../../../../../common/game/coordinates";
import { ImageView } from "../../../../../../common/game/image-view";

@Component({
    selector: "app-image-diff",
    templateUrl: "./image-diff.component.html",
    styleUrls: ["./image-diff.component.css"]
})

export class ImageDiffComponent implements OnInit {

    private originalCtx: CanvasRenderingContext2D;
    private modifiedCtx: CanvasRenderingContext2D;
    @Input() public originalImageSrc: string;
    @Input() public modifiedImageSrc: string;
    @Input() public gameId: number;
    @Input() public imageView: ImageView;
    @Output() public errorFound: EventEmitter<string> = new EventEmitter<string>();
    @ViewChild("original") private originalElement: ElementRef;
    @ViewChild("modified") private modifiedElement: ElementRef;
    private audio: HTMLAudioElement;

    public constructor(private imgDiffService: ImgDiffService) {
        this.audio = new Audio();
        this.audio.src = "../../../../assets/success.mp3";
        this.audio.load();
    }

    public ngOnInit(): void {
        this.initializeOriginalImage();
        this.initializeModifiedImage();
    }

    public isClicked(event: MouseEvent): void {
        // https://stackoverflow.com/questions/3234256/find-mouse-position-relative-to-element
        const target: HTMLCanvasElement = event.target as HTMLCanvasElement;

        if (target) {
            const rect: DOMRect = target.getBoundingClientRect() as DOMRect;
            const x: number = event.clientX - rect.left;
            const y: number = event.clientY - rect.top;
            this.imgDiffService.getDiff(this.gameId, this.imageView, x, y)
                .subscribe((errorCoordinates: Array<Coordinates>) => {
                    if (errorCoordinates.length > 0) {
                        this.errorFound.emit();
                        this.playSound();
                        this.updateModifiedImage(errorCoordinates);
                    }
                });
        }
    }

    private playSound(): void {
        this.audio.play();
    }

    private initializeOriginalImage(): void {
        const originalImage: HTMLImageElement = new Image();
        originalImage.crossOrigin = "Anonymous";
        originalImage.src = this.originalImageSrc;
        this.originalCtx = this.getContext("original");
        originalImage.onload = () => {
            this.originalCtx.drawImage(originalImage, 0, 0);
            originalImage.style.display = "none";
        };
    }

    private initializeModifiedImage(): void {
        const modifiedImage: HTMLImageElement = new Image();
        modifiedImage.crossOrigin = "Anonymous";
        modifiedImage.src = this.modifiedImageSrc;
        this.modifiedCtx = this.getContext("modified");
        modifiedImage.onload = () => {
            this.modifiedCtx.drawImage(modifiedImage, 0, 0);
            modifiedImage.style.display = "none";
        };
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

        for (const coordinates of errorCoordinates) {
            const index: number = this.getPosition(coordinates, this.getCanvas("modified"));

            modifiedImageBuffer[index + redOffset] =
                originalImageBuffer[index + redOffset];
            modifiedImageBuffer[index + greenOffset] =
                originalImageBuffer[index + greenOffset];
            modifiedImageBuffer[index + blueOffset] =
                originalImageBuffer[index + blueOffset];
            modifiedImageBuffer[index + alphaOffset] =
                originalImageBuffer[index + alphaOffset];
        }
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
        if (id === "original") {
            return this.originalElement.nativeElement as HTMLCanvasElement;
        } else if (id === "modified") {
            return this.modifiedElement.nativeElement as HTMLCanvasElement;
        } else {
            throw new Error(`Invalid element id: ${id}`);
        }
    }

}
