import { Component, OnInit } from "@angular/core";

@Component({
    selector: "app-diff-counter",
    templateUrl: "./diff-counter.component.html",
    styleUrls: ["./diff-counter.component.css"]
})
export class DiffCounterComponent implements OnInit {
    private playerCount: number;
    public counts: number[];

    public constructor(playerCount?: number) {
        this.playerCount = (playerCount === undefined) ? 1 : playerCount;
     }

    public ngOnInit(): void {
        this.counts = Array<number>(this.playerCount);
    }

    public incrementPlayerCount( userId: string): void {
        this.counts[0]++;
    }

    public diffFound(userId: string): void {
        this.incrementPlayerCount(userId);
    }
}
