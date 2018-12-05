import { Input } from "@angular/core";

import { GameService } from "../../services/game/game.service";

import { Game } from "../../../../../common/game/game";

export abstract class AbstractGameCardComponent {

    @Input() public game: Game;

    public constructor(protected gameService: GameService) { }
}
