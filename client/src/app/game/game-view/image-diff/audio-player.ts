export class AudioPlayer {

    private audio: HTMLAudioElement;

    public constructor(source: string) {
        this.audio = new Audio();
        this.audio.src = source;
        this.audio.load();
    }

    public play(): void {
        const clone: HTMLAudioElement = this.audio.cloneNode() as HTMLAudioElement;
        clone.play();
    }

}
