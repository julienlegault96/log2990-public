import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef } from "@angular/core";
import { ImgDiffService } from "src/app/services/img-diff/img-diff.service";
import { Coordinates } from "../../../../../../common/game/coordinates";
import { ImageView } from "../../../../../../common/game/image-view";
import { AudioPlayer } from "./audio-player";
import { SocketMessage } from "../../../../../../common/communication/sockets/socket-message";
import { SocketMessageType } from "../../../../../../common/communication/sockets/socket-message-type";
import { UserService } from "src/app/services/user/user.service";
import { MessageService } from "src/app/services/message/message.service";

@Component({
    selector: "app-image-diff",
    templateUrl: "./image-diff.component.html",
})

export class ImageDiffComponent implements OnInit {

    @Input() public originalImageSrc: string;
    @Input() public modifiedImageSrc: string;
    @Input() public gameId: number;
    @Input() public imageView: ImageView;

    @Output() public errorFound: EventEmitter<{ imageView: ImageView, x: number, y: number }> = new EventEmitter<{ imageView: ImageView, x: number, y: number }>();
    @Output() public noErrorFound: EventEmitter<string> = new EventEmitter<string>();

    @ViewChild("original") private originalElement: ElementRef;
    @ViewChild("modified") private modifiedElement: ElementRef;

    private originalCtx: CanvasRenderingContext2D;
    private modifiedCtx: CanvasRenderingContext2D;
    private audioPlayer: AudioPlayer;
    private errorAudioPlayer: AudioPlayer;
    private foundErrors: Array<Coordinates>;
    private isNotAllowed: boolean = false;

    private hasBeenClicked: boolean;
    private readonly clickDebounce: number = 500;

    private readonly successSoundPath: string = "../../../../assets/success.mp3";
    private readonly failSoundPath: string = "../../../../assets/error.mp3";

    public constructor(
        private imgDiffService: ImgDiffService,
        private userService: UserService,
        private messageService: MessageService,
    ) {
        this.audioPlayer = new AudioPlayer(this.successSoundPath);
        this.errorAudioPlayer = new AudioPlayer(this.failSoundPath);
        this.foundErrors = [];
        this.hasBeenClicked = false;
        this.messageService.addExternalManageCallback(this.retriveErrorMessages.bind(this));
    }

    public ngOnInit(): void {
        this.initializeOriginalImage();
        this.initializeModifiedImage();
    }

    public retriveErrorMessages(message: SocketMessage): void {
        if (message.type === SocketMessageType.ErrorFound
            && message.userId !== this.userService.loggedUser._id) {
            if (message.extraMessageInfo && message.extraMessageInfo.ErrorLocation
                && message.extraMessageInfo.ErrorLocation.imageView === this.imageView) {
                this.errorWasFoundByOpponent(message.extraMessageInfo.ErrorLocation);
            }
        }
    }

    private errorWasFoundByOpponent(errorLocation: { imageView: ImageView, x: number, y: number }): void {
        this.imgDiffService.getDiff(this.gameId, errorLocation.imageView, errorLocation.x, errorLocation.y)
            .subscribe((errorCoordinates: Array<Coordinates>) => {
                if (errorCoordinates.length > 0) {
                    this.foundErrors = this.foundErrors.concat(errorCoordinates);
                    this.updateModifiedImage(errorCoordinates);
                }
            });
    }

    public isClicked(event: MouseEvent): void {
        if (this.hasBeenClicked) {
            return;
        }
        if (!this.isNotAllowed) {
            setTimeout(() => { this.hasBeenClicked = false; }, this.clickDebounce);
            this.hasBeenClicked = true;
            // https://stackoverflow.com/questions/3234256/find-mouse-position-relative-to-element
            const target: HTMLCanvasElement = event.target as HTMLCanvasElement;
            if (target) {
                const rect: DOMRect = target.getBoundingClientRect() as DOMRect;
                const x: number = event.clientX - rect.left;
                const y: number = event.clientY - rect.top;
                if (!this.isAlreadyFound({ x: Math.round(x), y: Math.round(y) })) {
                    this.imgDiffService.getDiff(this.gameId, this.imageView, x, y)
                        .subscribe((errorCoordinates: Array<Coordinates>) => {
                            if (errorCoordinates.length > 0) {
                                this.foundErrors = this.foundErrors.concat(errorCoordinates);
                                this.errorFound.emit({ imageView: this.imageView, x: x, y: y });
                                this.audioPlayer.play();
                                this.updateModifiedImage(errorCoordinates);
                            } else {
                                this.noErrorWasClicked(event);
                            }
                        });
                } else {
                    this.noErrorWasClicked(event);
                }
            }
        }
    }

    public putError(x: number, y: number): void {
        this.isNotAllowed = true;
        const removeTimeout: number = 1000;
        const div: JQuery<HTMLElement> = $(`<div class="errorMessage p-1 rounded custom-shadow">`)
            .css({
                "left": x + "px",
                "top": y + "px",
            })
            .append($("<span>Erreur</span>"))
            .appendTo(document.body);
        this.setCanvasClass("notAllowed");
        setTimeout(
            () => {
                div.remove();
                this.removeCanvasClass("notAllowed");
                this.isNotAllowed = false;
            },
            removeTimeout
        );
    }

    private noErrorWasClicked(event: MouseEvent): void {
        this.errorAudioPlayer.play();
        this.putError(event.pageX, event.pageY);
        this.noErrorFound.emit();
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

    private isAlreadyFound(currentCoordinates: Coordinates): boolean {
        for (const coordinates of this.foundErrors) {
            if (currentCoordinates.x === coordinates.x && currentCoordinates.y === coordinates.y) {
                return true;
            }
        }

        return false;
    }

    private updateModifiedImage(errorCoordinates: Array<Coordinates>): void {
        // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
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

    private setCanvasClass(className: string): void {
        this.getCanvas("original").classList.add(className);
        this.getCanvas("modified").classList.add(className);
    }

    private removeCanvasClass(className: string): void {
        this.getCanvas("original").classList.remove(className);
        this.getCanvas("modified").classList.remove(className);
    }

    private getContext(id: string): CanvasRenderingContext2D {
        const context: CanvasRenderingContext2D = this.getCanvas(id)
            .getContext("2d") as CanvasRenderingContext2D;

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
