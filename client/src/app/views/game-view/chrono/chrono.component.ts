import { Component } from "@angular/core";

import {
    getformattedTime,
    SECONDS_IN_MINUTE,
    MINUTES_IN_HOUR,
    MILLISECONDS_IN_SECOND
} from "../../../../../../common/helpers/time";
import { MessageService } from "src/app/services/message/message.service";

@Component({
    selector: "app-chrono",
    templateUrl: "./chrono.component.html",
})

export class ChronoComponent {

    public elapsedTime: number;
    public formattedTime: string;
    private startTime: Date;
    private timer: number;
    private isStarted: boolean;

    private readonly SECONDS_ALERT: number = 30;
    private readonly MODULO_ZERO: number = 0;

    public constructor(
        private messageService: MessageService,
    ) {
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
        this.elapsedTime = elapsedTime.getSeconds()
            + elapsedTime.getMinutes() * SECONDS_IN_MINUTE
            + elapsedTime.getUTCHours() * MINUTES_IN_HOUR * SECONDS_IN_MINUTE;

        this.formattedTime = getformattedTime(this.elapsedTime);

        if (this.elapsedTime >= this.SECONDS_ALERT && this.elapsedTime % this.SECONDS_ALERT === this.MODULO_ZERO) {
            this.messageService.addMessage(`${this.elapsedTime} secondes se sont écoulées`);
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
