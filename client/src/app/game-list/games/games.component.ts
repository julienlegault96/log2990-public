import { Component, OnInit } from '@angular/core';

import { GameService } from '../game.service';
import { Game } from '../../../../../common/game/game';

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
        this.getSingleViewGames();
        this.getDoubleViewGames();
    }

    getSingleViewGames(): void {
        this.gameService.getSingleViewGames()
            .subscribe(games => this.singleViewGames = games);
    }

    getDoubleViewGames(): void {
        this.gameService.getDoubleViewGames()
            .subscribe(games => this.doubleViewGames = games);
    }

}
