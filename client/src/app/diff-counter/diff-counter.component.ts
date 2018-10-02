import { Component, OnInit, Input } from "@angular/core";

@Component({
    selector: "app-diff-counter",
    templateUrl: "./diff-counter.component.html",
})

export class DiffCounterComponent implements OnInit {

    public counters: number[];
    @Input() public playerOneId: string;
    @Input() public playerTwoId?: string;

    public constructor() {
    }

    public ngOnInit(): void {
        this.initializeCounters();
    }

    private initializeCounters(): void {
        if (this.playerTwoId === undefined) {
            const arraySize: number = 1;
            this.counters = new Array(arraySize);
            this.counters[0] = 0;
        } else {
            const arraySize: number = 2;
            this.counters = new Array(arraySize);
            this.counters[0] = 0;
            this.counters[1] = 0;
        }
    }

    public diffFound(userId: string): void {
        if (this.isValidUserId(userId)) {
            this.incrementPlayerCount(userId);
        }
    }

    private isValidUserId(userId: string): boolean {
        return (userId === this.playerOneId)
            || ((this.playerTwoId !== undefined) && (userId === this.playerTwoId));
    }

    private incrementPlayerCount(userId: string): void {
        this.counters[this.getIndex(userId)]++;
    }

    private getIndex(userId: string): number {
        return userId === this.playerOneId ? 0 : 1;
    }

}
