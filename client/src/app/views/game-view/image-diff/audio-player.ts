export class AudioPlayer {

    private audio: HTMLAudioElement;
    private failAudio: HTMLAudioElement;

    public constructor(source: string) {
        this.audio = new Audio();
        this.audio.src = source;
        this.audio.load();

        // failAudio
        this.failAudio = new Audio();
        this.failAudio.src = source;
        this.failAudio.load();
    }

    public play(): void {
        const clone: HTMLAudioElement = this.audio.cloneNode() as HTMLAudioElement;
        clone.play();
    }

    public playFailAudio(): void {
        const clone: HTMLAudioElement = this.failAudio.cloneNode() as HTMLAudioElement;
        clone.play();    // A modifier.
    }

}
