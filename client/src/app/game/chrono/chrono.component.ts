import { Component, OnInit } from "@angular/core";

@Component({
    selector: "app-chrono",
    templateUrl: "./chrono.component.html",
    styleUrls: ["./chrono.component.css"]
})

export class ChronoComponent implements OnInit {

    private readonly MINUTES_IN_HOUR: number = 60;
    private readonly LIMIT_TO_ADD_ZERO: number = 10;

    public formattedTime: string;
    private startTime: Date;
    private endTime: Date;
    private timer: number;
    private isStarted: boolean;

    public constructor() {
        this.formattedTime = "00:00";
        this.isStarted = false;
    }

    public start(): void {
        if (!this.isStarted) {
            this.startTime = new Date();
            this.timer = window.setInterval(() => {
                this.calculate();
            }, 1);
            this.isStarted = true;
        }
    }

    private calculate(): void {
        this.endTime = new Date();
        const elapsedTime: number = this.endTime.getTime() - this.startTime.getTime();

        let diff: Date;
        diff = new Date(elapsedTime);
        diff.setHours(diff.getHours());

        const seconds: number = diff.getSeconds();

        const minutes: number = diff.getMinutes() + (diff.getUTCHours() * this.MINUTES_IN_HOUR);

        this.formattedTime = "";
        this.formattedTime += minutes < this.LIMIT_TO_ADD_ZERO ? "0" + minutes + ":" : minutes + ":";
        this.formattedTime += seconds < this.LIMIT_TO_ADD_ZERO ? "0" + seconds : "" + seconds;
    }

    public stop(): void {
        if (this.isStarted) {
            clearInterval(this.timer);
            this.isStarted = false;
        }
    }

    public ngOnInit(): void {
    }

}
