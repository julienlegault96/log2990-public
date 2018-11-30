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

@Component({
    selector: "app-solo-game",
    templateUrl: "./solo-game.component.html",
    styleUrls: ["./solo-game.component.css"]
})

export class SoloGameComponent {

    @ViewChild(ChronoComponent) public chrono: ChronoComponent;
    @ViewChild(DiffCounterComponent) public diffCounter: DiffCounterComponent;

    @Input() public playerId: string;
    @Input() public game: Game;

    @Output() public errorFound: EventEmitter<string> = new EventEmitter<string>();

    public firstView: ImageView = ImageView.FirstView;
    public secondView: ImageView = ImageView.SecondView;

    protected readonly MAX_SINGLE_VIEW_ERROR_COUNT: number = 7;
    protected readonly MAX_DOUBLE_VIEW_ERROR_COUNT: number = 14;

    public constructor(
        public messageService: MessageService,
        private leaderboardService: LeaderboardService,
        ) {
    }

    public errorWasFound(): void {
        this.diffCounter.incrementPlayerCountSolo();
        this.errorFound.emit();
        this.verifyErrorCount();
    }

    public verifyErrorCount(): void {
        const winTimeout: number = 100;
        if (this.isPlayerWinner(this.playerId)) {
            setTimeout(() => this.endGame(), winTimeout);
        }
    }

    private endGame(): void {
        this.chrono.stop();

        const leaderboardRequest: LeaderboardRequest = {
            id: this.game._id,
            partyMode: GamePartyMode.Solo,
            time: this.chrono.elapsedTime,
            playerName: this.playerId
        };
        this.leaderboardService.sendGameScore(leaderboardRequest);

        $("#open-win-end-game-modal").click();
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
