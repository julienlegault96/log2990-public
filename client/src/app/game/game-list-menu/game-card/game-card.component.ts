import { Component } from "@angular/core";

import { GameService } from "../../../services/game.service";
import { AbstractGameCardComponent } from "src/app/game/abstract-game-card/abstract-game-card.component";

@Component({
    selector: "app-game",
    templateUrl: "./game-card.component.html",
    styleUrls: ["./game-card.component.css"]
})
export class GameCardComponent extends AbstractGameCardComponent {

    public constructor(gameService: GameService) {
        super(gameService);
    }

}
