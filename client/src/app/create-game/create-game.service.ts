import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CreateGameService {

    private readonly nameMinLength: number = 1;
    private readonly nameMaxLength: number = 20;
    private readonly imageFileExtension: string = ".bmp";

    constructor() { }

    public submit(name: String, images: File[]): void {
        if (!this.isValidInputList(name, images)) {
            return;
        }
        alert("Submited!");
    }

    public isValidInputList(name: String, images: File[]): boolean {
        return this.isValidName(name)
            && this.isValidInputImageList(images);
    }

    public isValidName(name: String): boolean {
        return name
            && name.length >= this.nameMinLength
            && name.length <= this.nameMaxLength;
    }

    public getNameMaxLength(): number {
        return this.nameMaxLength;
    }

    private isValidInputImageList(images: File[]): boolean {
        for (let image of images) {
            if (!this.isValidImage(image)) {
                return false;
            }
        }
        return true;
    }

    private isValidImage(image: File): boolean {
        return image != null
            && String(image.name).indexOf(this.imageFileExtension) != -1;
    }
}
