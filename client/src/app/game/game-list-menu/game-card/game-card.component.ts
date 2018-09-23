import { Component, OnInit, Input } from "@angular/core";

import { GameService } from "../../../services/game.service";

import { Game } from "../../../../../../common/game/game";

@Component({
    selector: "app-game",
    templateUrl: "./game-card.component.html",
    styleUrls: ["./game-card.component.css"]
})
export class GameCardComponent implements OnInit {

    @Input() public game: Game;
    public isJoinable: boolean;

    public constructor(private gameService: GameService) { }

    public ngOnInit(): void {
        this.gameService.isJoinable(this.game)
            .subscribe((isJoinable) => this.isJoinable = isJoinable);
    }

}
