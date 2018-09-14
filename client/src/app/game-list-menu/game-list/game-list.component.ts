import { Component, OnInit } from '@angular/core';

import { GameService } from '../game.service';
import { Game, GameType } from '../../../../../common/game/game';

@Component({
    selector: 'app-games',
    templateUrl: './game-list.component.html',
    styleUrls: ['./game-list.component.css']
})
export class GameListComponent implements OnInit {

    public singleViewGames: Game[];
    public doubleViewGames: Game[];

    constructor(private gameService: GameService) { }

    public ngOnInit() {
        this.getGames();
    }

    private getGames(): void {
        this.gameService.getGames()
            .subscribe((games: Game[]) => {
                this.filterGames(games);
            });
    }

    private filterGames(games: Game[]) {
        this.singleViewGames = games.filter((game: Game) => game.type == GameType.SingleView);
        this.doubleViewGames = games.filter((game: Game) => game.type == GameType.DoubleView);
    }
}