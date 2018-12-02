import { Component, ViewChild, Input, EventEmitter, Output } from "@angular/core";
import * as $ from "jquery";
import { DiffCounterComponent } from "../diff-counter/diff-counter.component";
import { Game } from "../../../../../../common/game/game";
import { ImageView } from "../../../../../../common/game/image-view";
import { GameType } from "../../../../../../common/game/game-type";
import { GamePartyMode } from "../../../../../../common/game/game-party-mode";
import { LeaderboardRequest } from "../../../../../../common/communication/leaderboard-request";
import { LeaderboardService } from "src/app/services/leaderboard/leaderboard.service";
import { ChronoComponent } from "../chrono/chrono.component";
import { SocketMessageType } from "../../../../../../common/communication/sockets/socket-message-type";
import { SocketMessage } from "../../../../../../common/communication/sockets/socket-message";
import { ErrorLocation } from "../../../../../../common/communication/sockets/socket-error-location";
import { SocketService } from "src/app/services/socket/socket.service";
import { SocketEvents } from "../../../../../../common/communication/sockets/socket-requests";

@Component({
    selector: "app-multiplayer-game",
    templateUrl: "./multiplayer-game.component.html",
    styleUrls: ["./multiplayer-game.component.css"]
})

export class MultiplayerGameComponent {

    @ViewChild(ChronoComponent) public chrono: ChronoComponent;
    @ViewChild(DiffCounterComponent) public diffCounter: DiffCounterComponent;

    @Input() public playerOneId: string;
    @Input() public playerTwoId: string;
    @Input() public game: Game;

    @Output() public errorFound: EventEmitter<ErrorLocation> = new EventEmitter<ErrorLocation>();
    @Output() public noErrorFound: EventEmitter<string> = new EventEmitter<string>();

    public firstView: ImageView = ImageView.FirstView;
    public secondView: ImageView = ImageView.SecondView;

    protected readonly MAX_SINGLE_VIEW_ERROR_COUNT: number = 4;
    protected readonly MAX_DOUBLE_VIEW_ERROR_COUNT: number = 7;

    public constructor(
        private leaderboardService: LeaderboardService,
        private socketService: SocketService,
    ) {
        this.socketService.registerFunction(SocketEvents.Message, this.retrieveMessages.bind(this));
    }

    public retrieveMessages(message: SocketMessage): void {
        if (message.type === SocketMessageType.ErrorFound
            && message.userId !== this.playerOneId) {
            this.errorWasFoundByOpponent();
        }
    }

    public errorWasFound(errorLocation: ErrorLocation): void {
        this.diffCounter.incrementPlayerCount(this.playerOneId);
        this.errorFound.emit(errorLocation);
        this.verifyErrorCount();
    }

    public noErrorWasFound(): void {
        this.noErrorFound.emit();
    }

    public errorWasFoundByOpponent(): void {
        this.diffCounter.incrementPlayerCount(this.playerTwoId);
        this.verifyErrorCount();
    }

    public verifyErrorCount(): void {
        const winTimeout: number = 100;
        if (this.isPlayerWinner(this.playerOneId)) {
            setTimeout(() => this.endGame(this.playerOneId), winTimeout);
        } else if (this.isPlayerWinner(this.playerTwoId)) {
            setTimeout(() => this.endGame(this.playerTwoId), winTimeout);
        }
    }

    // tslint:disable-next-line:max-func-body-length
    private endGame(winnerId: string): void {
        this.chrono.stop();
        const message: SocketMessage = {
            userId: this.playerOneId,
            type: SocketMessageType.EndedGame,
            timestamp: Date.now(),
            extraMessageInfo: {
                Game: {
                    gameId: this.game._id,
                    Name: this.game.title,
                    Mode: GamePartyMode.Multiplayer,
                }
            }
        };
        this.socketService.emit(SocketEvents.Message, message);

        if (winnerId === this.playerOneId) {
            const leaderboardRequest: LeaderboardRequest = {
                id: this.game._id,
                partyMode: GamePartyMode.Multiplayer,
                time: this.chrono.elapsedTime,
                playerName: winnerId
            };
            this.leaderboardService.sendGameScore(leaderboardRequest);

            $("#open-win-end-game-modal").click();
        } else {
            $("#open-lose-end-game-modal").click();
        }

        this.socketService.unregisterFunction(SocketEvents.Message, this.retrieveMessages.bind(this));
    }

    private isPlayerWinner(playerId: string): boolean {
        return (
            (
                this.game.type === GameType.SingleView
                && this.diffCounter.getPlayerCount(playerId) === this.MAX_SINGLE_VIEW_ERROR_COUNT
            ) ||
            (
                this.game.type === GameType.DoubleView
                && this.diffCounter.getPlayerCount(playerId) === this.MAX_DOUBLE_VIEW_ERROR_COUNT
            )
        );
    }

}
