import { Component, ViewChild, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MessageBarComponent } from "./message-bar/message-bar.component";
import { ChronoComponent } from "./chrono/chrono.component";
import { SoloGameComponent } from "./solo-game/solo-game.component";
import { UserService } from "../../services/user.service";
import { Game } from "../../../../../common/game/game";
import { GameService } from "src/app/services/game.service";

@Component({
    selector: "app-game-view",
    templateUrl: "./game-view.component.html",
    styleUrls: ["./game-view.component.css"]
})

export class GameViewComponent implements OnInit {
    @ViewChild(MessageBarComponent) public messageBar: MessageBarComponent;
    @ViewChild(ChronoComponent) public chrono: ChronoComponent;
    @ViewChild(SoloGameComponent) public soloGame: SoloGameComponent;

    private readonly maxErrorCount: number = 7;

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
        if (this.soloGame.diffCounter.getPlayerCount(this.playerId) === this.maxErrorCount) {
            this.chrono.stop();
            alert("Bravo!");
        }
    }
}
