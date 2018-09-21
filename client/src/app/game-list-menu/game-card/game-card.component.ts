import { Component, OnInit, Input } from "@angular/core";

import { GameService } from "../game.service";

import { Game } from "../../../../../common/game/game";

export abstract class AbsGameCardComponent implements OnInit {

    @Input() public game: Game;
    public isJoinable: boolean;

    public constructor(protected gameService: GameService) { }

    ngOnInit() {
        this.gameService.isJoinable(this.game)
            .subscribe((isJoinable) => this.isJoinable = isJoinable);
    }

}


@Component({
    selector: "app-game",
    templateUrl: "./game-card.component.html",
    styleUrls: ["./game-card.component.css"]
})
export class GameCardComponent extends AbsGameCardComponent {

    constructor(gameService: GameService) {
        super(gameService);
     }

}