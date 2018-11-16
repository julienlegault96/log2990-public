import { Component } from "@angular/core";

import { GameService } from "../../services/game/game.service";
import { AbstractGameListComponent } from "src/app/views/abstract-game-list/abstract-game-list.component";

@Component({
    selector: "app-admin-view",
    templateUrl: "./admin-view.component.html",
})

export class AdminViewComponent extends AbstractGameListComponent {

    public constructor(protected gameService: GameService) {
        super(gameService);
    }

}