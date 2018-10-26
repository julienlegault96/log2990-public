import { OnInit, Input } from "@angular/core";

import { GameService } from "../../services/game.service";

import { Game } from "../../../../../common/game/game";

export abstract class AbstractGameCardComponent implements OnInit {

    @Input() public game: Game;
    public isJoinable: boolean;

    public constructor(protected gameService: GameService) { }

    public ngOnInit(): void {
        this.gameService.isJoinable(this.game)
            .subscribe((isJoinable) => this.isJoinable = isJoinable);
    }

}
