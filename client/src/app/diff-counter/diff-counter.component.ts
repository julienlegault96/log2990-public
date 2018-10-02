import { Component, OnInit } from "@angular/core";

@Component({
    selector: "app-diff-counter",
    templateUrl: "./diff-counter.component.html",
})

export class DiffCounterComponent implements OnInit {
    private readonly MAX_PLAYERS: number = 2;
    private readonly UNDECLARED_ID_ERROR: string = "Aucun compteur n'est initialisé pour l'indentifiant ";
    
    private counters: number[];
    private playerOneId: string;
    private playerTwoId: string;

    public constructor() { }

    public ngOnInit(): void {
        this.counters = new Array<number>(this.MAX_PLAYERS);
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

    public diffFound(playerId: string): void {
        this.incrementPlayerCount(playerId);
    }

    private incrementPlayerCount(playerId: string): void {
        this.counters[this.getIndex(playerId)]++;
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
