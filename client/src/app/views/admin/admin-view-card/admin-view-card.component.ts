import { Component } from "@angular/core";

import { GameService } from "../../../services/game/game.service";
import { AbstractGameCardComponent } from "src/app/views/abstract-game-card/abstract-game-card.component";

@Component({
    selector: "app-admin-card",
    templateUrl: "./admin-view-card.component.html"
})

export class AdminViewCardComponent extends AbstractGameCardComponent {

    public constructor(gameService: GameService) {
        super(gameService);
    }

    public resetLeaderboard(): void {
        this.gameService.resetLeaderboard(this.game).subscribe();
    }

    public delete(): void {
        this.gameService.deleteGame(this.game).subscribe();
        location.reload();
    }

}
