import { Component } from "@angular/core";
import { AbsGameListComponent } from "../../game/game-list-menu/game-list/game-list.component";
import { GameService } from "../../services/game.service";
import { AbsGameCardComponent } from "../../game/game-list-menu/game-card/game-card.component";
@Component({
  selector: "app-admin-view",
  templateUrl: "./admin-view.component.html",
  styleUrls: ["./admin-view.component.css"]
})
export class AdminViewComponent extends AbsGameListComponent {

  public constructor(gameService: GameService) {
    super(gameService);
  }

}

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

}