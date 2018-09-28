import { Component } from "@angular/core";

import { GameService } from "src/app/services/game.service";
import { AbstractGameListComponent } from "src/app/game/game-list-menu/abstract-game-list/abstract-game-list.component";

@Component({
    selector: "app-games",
    templateUrl: "./game-list.component.html",
})
export class GameListComponent extends AbstractGameListComponent {

    public constructor(gameService: GameService) {
        super(gameService);
    }
}
