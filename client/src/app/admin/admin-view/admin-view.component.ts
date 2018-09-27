import { Component } from "@angular/core";
import { AbsGameListComponent } from "../../game/game-list-menu/game-list/game-list.component";
import { GameService } from "../../services/game.service";
import { AbsGameCardComponent } from "../../game/game-list-menu/game-card/game-card.component";
import { Router } from "@angular/router";

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

  public constructor(gameService: GameService, private router: Router) {
    super(gameService);
  }

  public resetLeaderboard(): void {
    this.gameService.resetLeaderboard(this.game).subscribe();
  }

  public delete(): void {
    this.gameService.deleteGame(this.game).subscribe();
    const link = ["admin"];
    this.router.navigate(link);
  }

}
