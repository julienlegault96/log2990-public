import { Component, OnInit } from "@angular/core";

@Component({
    selector: "app-diff-counter",
    templateUrl: "./diff-counter.component.html",
})

export class DiffCounterComponent implements OnInit {

    public counts: number[];
    private counter: number;

    public constructor(playerCount?: number) {
        this.counter = (playerCount === undefined) ? 1 : playerCount;
    }

    public ngOnInit(): void {
        this.counts = Array<number>(this.counter);
    }

    public incrementPlayerCount(userId: string): void {
        this.counts[0]++;
    }

    public diffFound(userId: string): void {
        this.incrementPlayerCount(userId);
    }

}
