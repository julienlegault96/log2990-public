import { Component, OnInit } from "@angular/core";

import { GameService } from "../../../services/game.service";

import { Game } from "../../../../../../common/game/game";
import { GameType } from "../../../../../../common/game/game-type";

@Component({
    selector: "app-games",
    templateUrl: "./game-list.component.html",
    styleUrls: ["./game-list.component.css"]
})
export class GameListComponent implements OnInit {

    public singleViewGames: Game[];
    public doubleViewGames: Game[];

    public constructor(private gameService: GameService) {
        this.singleViewGames = new Array();
        this.doubleViewGames = new Array();
    }

    public ngOnInit(): void {
        this.getGames();
    }

    private getGames(): void {
        this.gameService.getGames()
            .subscribe((games: Game[]) => {
                this.filterGames(games);
            });
    }

    private filterGames(games: Game[]): void {
        this.singleViewGames = games.filter((game: Game) => game.type === GameType.SingleView);
        this.doubleViewGames = games.filter((game: Game) => game.type === GameType.DoubleView);
    }
}
