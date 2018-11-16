import { OnInit } from "@angular/core";

import { GameService } from "../../services/game/game.service";

import { Game } from "../../../../../common/game/game";
import { GameType } from "../../../../../common/game/game-type";

export abstract class AbstractGameListComponent implements OnInit {

    public singleViewGames: Game[];
    public doubleViewGames: Game[];

    public constructor(protected gameService: GameService) {
        this.singleViewGames = new Array();
        this.doubleViewGames = new Array();
    }

    public ngOnInit(): void {
        this.getGames();
    }

    protected getGames(): void {
        this.gameService.getGames()
            .subscribe((games: Game[]) => {
                this.filterGames(games);
            });
    }

    protected filterGames(games: Game[]): void {
        this.singleViewGames = games.filter((game: Game) => game.type === GameType.SingleView);
        this.doubleViewGames = games.filter((game: Game) => game.type === GameType.DoubleView);
    }

}