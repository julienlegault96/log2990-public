import { Component } from "@angular/core";
import { AbstractGameListComponent } from "../../game/game-list-menu/game-list/game-list.component";
import { GameService } from "../../services/game.service";

@Component({
    selector: "app-admin-view",
    templateUrl: "./admin-view.component.html",
})

export class AdminViewComponent extends AbstractGameListComponent {

    public constructor(protected gameService: GameService) {
        super(gameService);
    }

}
