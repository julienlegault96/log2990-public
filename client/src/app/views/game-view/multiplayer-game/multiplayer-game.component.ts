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
import { MessageService } from "src/app/services/message/message.service";
import { SocketMessageType } from "../../../../../../common/communication/sockets/socket-message-type";
import { SocketMessage } from "../../../../../../common/communication/sockets/socket-message";

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

    @Output() public errorFound: EventEmitter<{ imageView: ImageView, x: number, y: number }> = new EventEmitter<{ imageView: ImageView, x: number, y: number }>();
    @Output() public noErrorFound: EventEmitter<string> = new EventEmitter<string>();

    public firstView: ImageView = ImageView.FirstView;
    public secondView: ImageView = ImageView.SecondView;

    protected readonly MAX_SINGLE_VIEW_ERROR_COUNT: number = 4;
    protected readonly MAX_DOUBLE_VIEW_ERROR_COUNT: number = 7;

    public constructor(
        private leaderboardService: LeaderboardService,
        private messageService: MessageService,
    ) {
        this.messageService.addExternalManageCallback(this.retriveErrorMessages.bind(this));
    }

    public retriveErrorMessages(message: SocketMessage): void {
        if (message.type === SocketMessageType.ErrorFound
            && message.userId !== this.playerOneId) {
            this.errorWasFoundByOpponent();
        }
    }

    public errorWasFound(errorLocation: { imageView: ImageView, x: number, y: number }): void {
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

    private endGame(winnerId: string): void {
        this.chrono.stop();

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
