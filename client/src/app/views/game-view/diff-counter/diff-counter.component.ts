import { Component, Input, OnInit } from "@angular/core";
import { SocketService } from "src/app/services/socket/socket.service";
import { SocketEvents } from "../../../../../../common/communication/sockets/socket-requests";
import { SocketMessage } from "../../../../../../common/communication/sockets/socket-message";
import { SocketMessageType } from "../../../../../../common/communication/sockets/socket-message-type";

@Component({
    selector: "app-diff-counter",
    templateUrl: "./diff-counter.component.html",
})

export class DiffCounterComponent implements OnInit {

    @Input() public playerOneId: string;
    @Input() public playerTwoId: string;
    @Input() public errorsRequired: number;

    public progressBarWidth: number[];
    private counters: number[];
    private playerCount: number;

    private readonly MIN_PLAYERS: number = 1;
    private readonly MAX_PLAYERS: number = 2;
    private readonly BASE: number = 100;
    private readonly UNDECLARED_ID_ERROR: string = "Aucun compteur n'est initialisé pour l'indentifiant ";

    public constructor(
        private socketService: SocketService,
    ) { }

    public ngOnInit(): void {
        const playerCount: number = this.playerTwoId ? this.MAX_PLAYERS : this.MIN_PLAYERS;
        this.updatePlayerCount(playerCount);
        this.socketService.registerFunction(SocketEvents.Message, this.retriveMessages.bind(this));
    }

    private retriveMessages(message: SocketMessage): void {
        if (message.type === SocketMessageType.EndedGame) {
            this.counters = [0, 0];
            this.socketService.unregisterFunction(SocketEvents.Message, this.retriveMessages.bind(this));
        }
    }

    public setPlayerOne(playerId: string): void {
        this.playerOneId = playerId;
    }

    public setPlayerTwo(playerId: string): void {
        this.playerTwoId = playerId;
        this.updatePlayerCount(this.MAX_PLAYERS);
    }

    public updatePlayerCount(count: number): void {
        this.playerCount = count;
        this.counters = new Array<number>(this.playerCount).fill(0);
        this.progressBarWidth = new Array<number>(this.playerCount).fill(0);
    }

    public getPlayerCount(playerId: string): number {
        return this.counters[this.getIndex(playerId)];
    }

    public incrementPlayerCount(playerId: string): void {
        if (this.progressBarWidth[this.getIndex(playerId)] < this.BASE) {
            this.counters[this.getIndex(playerId)]++;
            this.progressBarWidth[this.getIndex(playerId)] = this.counters[this.getIndex(playerId)] * this.BASE / this.errorsRequired;
            this.progressBarWidth[this.getIndex(playerId)] = parseFloat(this.progressBarWidth[this.getIndex(playerId)].toFixed(0));
        } else {
            this.progressBarWidth[this.getIndex(playerId)] = this.BASE;
        }
    }

    public incrementPlayerCountSolo(): void {
        if (this.progressBarWidth[0] < this.BASE) {
            this.counters[0]++;
            this.progressBarWidth[0] = this.counters[0] * this.BASE / this.errorsRequired;
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
