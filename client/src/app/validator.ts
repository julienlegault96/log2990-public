
/**
 * class dedicated to validating inputs
 */
export class Validator {
    private readonly MIN_USERNAME_LENGTH: number = 1;
    private readonly MAX_USERNAME_LENGTH: number = 20;
    private readonly ACCEPTED_IMAGE_FILE_EXTENSION: string = ".bmp";
    // Disclaimer: cette expression régulière a été prise de https://stackoverflow.com/a/389022
    private readonly VALIDATION_REGEX: RegExp = /^[a-zA-Z0-9]+$/i;

    public constructor() {}

    public isValidUsernameLength(username: string): boolean {
        return username.length >= this.MIN_USERNAME_LENGTH
            && username.length <= this.MAX_USERNAME_LENGTH;
    }

    public isValidAlphanumericSymbols(username: string): boolean {
        return Boolean(username.match(this.VALIDATION_REGEX));
    }

    public isValidImage(image: File): boolean {
        return image != null
            && String(image.name).indexOf(this.ACCEPTED_IMAGE_FILE_EXTENSION) !== -1;
    }
}
