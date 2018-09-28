import { Component } from "@angular/core";
import { AbsGameListComponent } from "../../game/game-list-menu/game-list/game-list.component";
import { GameService } from "../../services/game.service";

@Component({
    selector: "app-admin-view",
    templateUrl: "./admin-view.component.html",
})

export class AdminViewComponent extends AbsGameListComponent {

    public constructor(protected gameService: GameService) {
        super(gameService);
    }

}
