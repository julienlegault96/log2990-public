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
<<<<<<< HEAD
<<<<<<< HEAD
=======

    public playFailAudio(): void {
        const clone: HTMLAudioElement = this.failAudio.cloneNode() as HTMLAudioElement;
        clone.play();    // A modifier.
    }

>>>>>>> Identification des erreurs, bip sonore pour une identification erronnée. ND
=======
>>>>>>> Ajout de sonnerie pour erreur d'identification, ND
}
