import { Component, OnInit } from '@angular/core';

import { GameService } from '../game.service';
import { Game } from '../../../../../common/game/game';

@Component({
    selector: 'app-games',
    templateUrl: './games.component.html',
    styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {

    public games: Game[];
    public singleViewGames: Game[];
    public doubleViewGames: Game[];

    constructor(private gameService: GameService) { }

    ngOnInit() {
        this.getGames();
    }

    getGames(): void {
        this.gameService.getGames()
            .subscribe(games => this.games = games);
    }

    getSingleViewGames(): void {

    }

    getDoubleViewGames(): void {
        
    }

}
