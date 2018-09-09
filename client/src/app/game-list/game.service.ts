import { Injectable } from '@angular/core';

import { Game } from '../../../../common/game/game';
import { Leaderboard } from '../../../../common/game/leaderboard';

import { Observable, of } from 'rxjs';
// import { HttpClient } from '@angular/common/http';
// import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class GameService {

    // private gamesUrl = 'api/games';  // URL to web api

    // constructor(private http: HttpClient) { }
    constructor() { }

    getSingleViewGames(): Observable<Game[]> {
        let game = new Game();
        game.title = "test";
        game.imageUrl = "url123.txt";

        let tempLeaderboard = new Leaderboard();
        tempLeaderboard.title = "solo";
        tempLeaderboard.times = [12, 46, 36];
        game.leaderboards = new Array();
        game.leaderboards.push(tempLeaderboard);

        tempLeaderboard = new Leaderboard();
        tempLeaderboard.title = "1v1";
        tempLeaderboard.times = [35, 57, 92];
        game.leaderboards.push(tempLeaderboard);

        let games = new Array(game);

        game.title = "beaioj";

        games.push(game);
        return of(games);
        // return this.http.get<Game[]>(this.gamesUrl)
        //     .pipe(
        //         tap(games => this.log('fetched games')),
        //         catchError(this.handleError('getGames', []))
        //     );
    }

    getDoubleViewGames(): Observable<Game[]> {
        let game = new Game();
        game.title = "test";
        game.imageUrl = "url123.txt";

        let tempLeaderboard = new Leaderboard();
        tempLeaderboard.title = "solo";
        tempLeaderboard.times = [12, 46, 36];
        game.leaderboards = new Array();
        game.leaderboards.push(tempLeaderboard);

        tempLeaderboard = new Leaderboard();
        tempLeaderboard.title = "1v1";
        tempLeaderboard.times = [35, 57, 92];
        game.leaderboards.push(tempLeaderboard);

        let games = new Array(game);

        game.title = "beaioj";

        games.push(game);
        return of(games);
    }
}
