import { Component, OnInit } from '@angular/core';

import { GameService } from '../game.service';
import { Game, GameType } from '../../../../../common/game/game';

@Component({
    selector: 'app-games',
    templateUrl: './games.component.html',
    styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {

    public singleViewGames: Game[];
    public doubleViewGames: Game[];

    constructor(private gameService: GameService) { }

    ngOnInit() {
        this.getGames();
    }

    getGames(): void {
        this.gameService.getGames()
            .subscribe((games: Game[]) => {
                this.singleViewGames = games.filter((game: Game) => game.type == GameType.SingleView);
                this.doubleViewGames = games.filter((game: Game) => game.type == GameType.DoubleView);
            });
    }

}
