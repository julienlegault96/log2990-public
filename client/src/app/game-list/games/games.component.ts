import { Component, OnInit } from '@angular/core';

import { Game } from '../../../../../common/game/game';
import { Leaderboard } from '../../../../../common/game/leaderboard';

@Component({
    selector: 'app-games',
    templateUrl: './games.component.html',
    styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {

    public games: Game[];

    constructor() { }

    ngOnInit() {
        this.getGames();
    }

    getGames() {

        let game = new Game();
        game.title = "test";
        game.imageUrl = "url123.txt";

        let tempLeaderboard = new Leaderboard();
        tempLeaderboard.title = "solo";
        tempLeaderboard.times = [12,46,36];
        game.leaderboards = new Array();
        game.leaderboards.push(tempLeaderboard);
        
        tempLeaderboard = new Leaderboard();
        tempLeaderboard.title = "1v1";
        tempLeaderboard.times = [35,57,92];
        game.leaderboards.push(tempLeaderboard);

        this.games = new Array(game);

        game.title = "beaioj";

        this.games.push(game);
    }

}
