import { Component, Input, OnInit } from "@angular/core";

@Component({
    selector: "app-diff-counter",
    templateUrl: "./diff-counter.component.html",
})

export class DiffCounterComponent implements OnInit {
    private readonly MIN_PLAYERS: number = 1;
    private readonly MAX_PLAYERS: number = 2;
    private readonly MAXFOUNDSOLO: number = 7;
    private readonly MAXFOUNDDOUBLE: number = 7;
    private readonly BASE: number = 100;
    private readonly UNDECLARED_ID_ERROR: string = "Aucun compteur n'est initialisé pour l'indentifiant ";

    public progressBarWidth: number[];
    private counters: number[];
    @Input() public playerOneId: string;
    @Input() private playerTwoId: string;
    private playerCount: number = this.MIN_PLAYERS;

    public ngOnInit(): void {
        if (this.playerTwoId) {
            this.playerCount = this.MAX_PLAYERS;
        }

        this.counters = new Array<number>(this.playerCount).fill(0);
        this.progressBarWidth = new Array<number>(this.playerCount).fill(0);
    }

    public getPlayerCount(playerId: string): number {
        return this.counters[this.getIndex(playerId)];
    }

    public incrementPlayerCount(playerId: string): void {
        if (this.progressBarWidth[this.getIndex(playerId)] < this.BASE) {
            this.counters[this.getIndex(playerId)]++;
            this.progressBarWidth[this.getIndex(playerId)] = this.counters[this.getIndex(playerId)] * this.BASE / this.MAXFOUNDDOUBLE;
            this.progressBarWidth[this.getIndex(playerId)] = parseFloat(this.progressBarWidth[this.getIndex(playerId)].toFixed(0));
        } else {
            this.progressBarWidth[this.getIndex(playerId)] = this.BASE;
        }
    }

    public incrementPlayerCountSolo(): void {
        if (this.progressBarWidth[0] < this.BASE) {
            this.counters[0]++;
            this.progressBarWidth[0] = this.counters[0] * this.BASE / this.MAXFOUNDSOLO;
            this.progressBarWidth[0] = parseFloat(this.progressBarWidth[0].toFixed(0));
        } else {
            this.progressBarWidth[0] = this.BASE;
        }
    }

    private getIndex(playerId: string): number {
        if (playerId === this.playerOneId) {
            return 0;
        } else if (playerId === this.playerTwoId) {
            return 1;
        } else {
            throw new Error(this.UNDECLARED_ID_ERROR + playerId);
        }
    }
}
