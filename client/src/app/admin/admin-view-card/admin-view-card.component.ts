import { Component } from "@angular/core";
import { GameService } from "../../services/game.service";
import { AbsGameCardComponent } from "../../game/game-list-menu/game-card/game-card.component";

@Component({
    selector: "app-admin-card",
    templateUrl: "./admin-view-card.component.html",
    styleUrls: ["../../game/game-list-menu/game-card/game-card.component.css"]
})

export class AdminViewCardComponent extends AbsGameCardComponent {

    public constructor(gameService: GameService) {
        super(gameService);
    }

    public resetLeaderboard(): void {
        this.gameService.resetLeaderboard(this.game).subscribe();
    }

    public delete(): void {
        this.gameService.deleteGame(this.game).subscribe();
        alert("Veuillez actualiser le navigateur pour voir le changement!");
    }

}