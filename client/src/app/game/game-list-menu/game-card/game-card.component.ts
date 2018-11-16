import { Component } from "@angular/core";

import { GameService } from "src/app/services/game/game.service";
import { AbstractGameCardComponent } from "src/app/game/abstract-game-card/abstract-game-card.component";

@Component({
    selector: "app-game",
    templateUrl: "./game-card.component.html",
})

export class GameCardComponent extends AbstractGameCardComponent {

    public constructor(gameService: GameService) {
        super(gameService);
    }

}
