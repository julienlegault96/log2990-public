import { Component, ViewChild, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MessageBarComponent } from "./message-bar/message-bar.component";
import { ChronoComponent } from "./chrono/chrono.component";
import { SoloGameComponent } from "./solo-game/solo-game.component";
import { UserService } from "../../services/user.service";
import { Game } from "../../../../../common/game/game";
import { GameService } from "src/app/services/game.service";
import { GameType } from "../../../../../common/game/game-type";

@Component({
    selector: "app-game-view",
    templateUrl: "./game-view.component.html",
    styleUrls: ["./game-view.component.css"]
})

export class GameViewComponent implements OnInit {
    @ViewChild(MessageBarComponent) public messageBar: MessageBarComponent;
    @ViewChild(ChronoComponent) public chrono: ChronoComponent;
    @ViewChild(SoloGameComponent) public soloGame: SoloGameComponent;

    private readonly maxSingleViewErrorCount: number = 7;
    private readonly maxDoubleViewErrorCount: number = 14;

    public playerId: string;
    public game: Game;

    public constructor(private activatedRoute: ActivatedRoute, private userService: UserService, private gameService: GameService) {
        this.playerId = this.userService.loggedUser._id;
    }

    public ngOnInit(): void {
        this.activatedRoute.params.subscribe((paramsId) => {
            this.gameService.getGame(paramsId.id).subscribe((game) => {
                this.game = game;
                this.chrono.start();
            });
        });
    }

    public verifyErrorCount(): void {
        if (this.game.type === GameType.SingleView
            && this.soloGame.diffCounter.getPlayerCount(this.playerId) === this.maxSingleViewErrorCount) {
            this.chrono.stop();

            // Pour ne pas mettre en attente le script
            setTimeout(() => alert("Bravo!"), 0);
        } else if (this.game.type === GameType.DoubleView
            && this.soloGame.diffCounter.getPlayerCount(this.playerId) === this.maxDoubleViewErrorCount) {
            this.chrono.stop();
            setTimeout(() => alert("Bravo!"), 0);
        }
    }

}
