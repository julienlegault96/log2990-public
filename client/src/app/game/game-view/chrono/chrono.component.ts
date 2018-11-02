import { Component, Output, EventEmitter } from "@angular/core";

import {
    getformattedTime,
    SECONDS_IN_MINUTE,
    MINUTES_IN_HOUR,
    MILLISECONDS_IN_SECOND
} from "../../../../../../common/helpers/time";

@Component({
    selector: "app-chrono",
    templateUrl: "./chrono.component.html",
})

export class ChronoComponent {

    @Output() public timerMilestone: EventEmitter<string> = new EventEmitter<string>();

    public formattedTime: string;
    private startTime: Date;
    private timer: number;
    private isStarted: boolean;

    private readonly SECONDS_ALERT: number = 30;
    private readonly MODULO_ZERO: number = 0;

    public constructor() {
        this.formattedTime = "00:00";
        this.isStarted = false;
    }

    public start(): void {
        if (!this.isStarted) {
            this.startTime = new Date();
            this.timer = window.setInterval(() => this.calculate(), MILLISECONDS_IN_SECOND);
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
        const seconds: number = elapsedTime.getSeconds()
            + elapsedTime.getMinutes() * SECONDS_IN_MINUTE
            + elapsedTime.getUTCHours() * MINUTES_IN_HOUR * SECONDS_IN_MINUTE;

        this.formattedTime = getformattedTime(seconds);

        if (seconds >= this.SECONDS_ALERT && seconds % this.SECONDS_ALERT === this.MODULO_ZERO) {
            this.timerMilestone.emit(`${seconds} secondes se sont écoulées`);
        }
    }

    private getElapsedTime(): Date {
        const endTime: Date = new Date();
        const elapsedTimeMilliseconds: number = endTime.getTime() - this.startTime.getTime();

        const elapsedTime: Date = new Date(elapsedTimeMilliseconds);
        elapsedTime.setHours(elapsedTime.getHours());

        return elapsedTime;
    }

}
