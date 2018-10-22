import { Component, Output, EventEmitter } from "@angular/core";

@Component({
    selector: "app-chrono",
    templateUrl: "./chrono.component.html",
})

export class ChronoComponent {
    @Output() public timerMilestone: EventEmitter<string> = new EventEmitter<string>();

    private readonly MINUTES_IN_HOUR: number = 60;
    private readonly SECONDS_IN_MINUTE: number = 60;
    private readonly MILLISECONDS_IN_SECOND: number = 1000;
    private readonly LIMIT_TO_ADD_ZERO: number = 10;
    private readonly SECONDS_ALERT: number = 30;
    private readonly MODULO_ZERO: number = 0;

    public formattedTime: string;
    private startTime: Date;
    private timer: number;
    private isStarted: boolean;

    public constructor() {
        this.formattedTime = "00:00";
        this.isStarted = false;
    }

    public start(): void {
        if (!this.isStarted) {
            this.startTime = new Date();
            this.timer = window.setInterval(() => this.calculate(), this.MILLISECONDS_IN_SECOND);
            this.isStarted = true;
        }
    }

    public stop(): void {
        if (this.isStarted) {
            clearInterval(this.timer);
            this.isStarted = false;
        }
    }

    private calculate(): void {
        const elapsedTime: Date = this.getElapsedTime();
        const seconds: number = elapsedTime.getSeconds();
        const minutes: number = elapsedTime.getMinutes() + (elapsedTime.getUTCHours() * this.MINUTES_IN_HOUR);

        this.formattedTime = this.getformattedTime(minutes, seconds);

        if ((seconds >= this.SECONDS_ALERT || minutes > 0) && seconds % this.SECONDS_ALERT === this.MODULO_ZERO) {
            this.timerMilestone.emit(`${minutes * this.SECONDS_IN_MINUTE + seconds} secondes se sont écoulées`);
        }
    }

    private getElapsedTime(): Date {
        const endTime: Date = new Date();
        const elapsedTimeMilliseconds: number = endTime.getTime() - this.startTime.getTime();

        const elapsedTime: Date = new Date(elapsedTimeMilliseconds);
        elapsedTime.setHours(elapsedTime.getHours());

        return elapsedTime;
    }

    private getformattedTime(minutes: number, seconds: number): string {
        let formattedTime: string;
        formattedTime = minutes < this.LIMIT_TO_ADD_ZERO ? ("0" + minutes) : (String(minutes));
        formattedTime += ":";
        formattedTime += seconds < this.LIMIT_TO_ADD_ZERO ? ("0" + seconds) : ("" + seconds);

        return formattedTime;
    }
}
