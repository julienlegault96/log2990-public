import { Component, OnInit } from "@angular/core";

const MAXFOUNDSOLO: number = 7;
const MAXFOUNDDOUBLE: number = 7;
const BASE: number = 100;
@Component({
    selector: "app-diff-counter",
    templateUrl: "./diff-counter.component.html",
})

export class DiffCounterComponent implements OnInit {
    private readonly MAX_PLAYERS: number = 2;
    private readonly UNDECLARED_ID_ERROR: string = "Aucun compteur n'est initialisé pour l'indentifiant ";
    public progressBarWidth: number[];

    private counters: number[];
    private playerOneId: string;
    private playerTwoId: string;

    public constructor() { }

    public ngOnInit(): void {
        this.counters = new Array<number>(this.MAX_PLAYERS);
        this.progressBarWidth = new Array<number>(0);
        this.counters[0]  = 0;
        this.progressBarWidth[0] = 0;

    }

    public setPlayerOne(playerOneId: string): void {
        this.playerOneId = playerOneId;
        this.counters[0] = 0;
    }

    public setPlayerTwo(playerTwoId: string): void {
        this.playerTwoId = playerTwoId;
        this.counters[1] = 0;
    }

    public getPlayerCount(playerId: string): number {
        return this.counters[this.getIndex(playerId)];
    }

    /*public diffFound(playerId: string): void {
        this.incrementPlayerCount(playerId);
    }
    */

    public incrementPlayerCount(playerId: string): void {

        if (this.progressBarWidth[this.getIndex(playerId)] < BASE) {
            this.counters[this.getIndex(playerId)]++;
            this.progressBarWidth[this.getIndex(playerId)] = this.counters[this.getIndex(playerId)] * BASE / MAXFOUNDDOUBLE;
            this.progressBarWidth[this.getIndex(playerId)] = parseFloat(this.progressBarWidth[this.getIndex(playerId)].toFixed(0));
        } else {
            this.progressBarWidth[this.getIndex(playerId)] = BASE;
        }
    }

    public incrementPlayerCountSolo(): void {
        if (this.progressBarWidth[0] < BASE) {
        this.counters[0]++;
        this.progressBarWidth[0] = this.counters[0] * BASE / MAXFOUNDSOLO;
        this.progressBarWidth[0] = parseFloat(this.progressBarWidth[0].toFixed(0));
        } else {
            this.progressBarWidth[0] = BASE;
        }
    }

    private getIndex(playerId: string): number {

         if (playerId === this.playerOneId) {
             return 0;
         } else if (playerId === this.playerTwoId) {
             return 1;
         } else {
             throw new Error( this.UNDECLARED_ID_ERROR + playerId);
         }

    }

}
