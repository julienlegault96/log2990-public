import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
// import { HttpClient } from '@angular/common/http';
// import { catchError, map, tap } from 'rxjs/operators';

import { Game } from '../../../../common/game/game';

@Injectable({
    providedIn: 'root'
})

export class GameService {

    // private gamesUrl = 'api/games';  // URL to web api

    // constructor(private http: HttpClient) { }
    constructor() { }

    getSingleViewGames(): Observable<Game[]> {
        // return this.http.get<Game[]>(this.gamesUrl)
        //     .pipe(
        //         tap(games => this.log('fetched games')),
        //         catchError(this.handleError('getGames', []))
        //     );
        return of(dummySingleViewGames);
    }

    getDoubleViewGames(): Observable<Game[]> {
        return of(dummyDoubleViewGames);
    }
}

const dummySingleViewGames = [
    {
        id: 1,
        title: 'SingleViewGame 1',
        imageUrl: 'singleViewGameImage1.bmp',
        leaderboards: [
            {
                title: 'Solo',
                times: [65, 72, 83]
            },
            {
                title: 'One versus One',
                times: [45, 51, 58]
            }
        ]
    },
    {
        id: 2,
        title: 'SingleViewGame 2',
        imageUrl: 'singleViewGameImage2.bmp',
        leaderboards: [
            {
                title: 'Solo',
                times: [46, 53, 59]
            },
            {
                title: 'One versus One',
                times: [35, 39, 41]
            }
        ]
    }
];

const dummyDoubleViewGames = [
    {
        id: 3,
        title: 'DoubleViewGame 1',
        imageUrl: 'doubleviewgameimage1.bmp',
        leaderboards: [
            {
                title: 'Solo',
                times: [65, 72, 83]
            },
            {
                title: 'One versus One',
                times: [45, 51, 58]
            }
        ]
    },
    {
        id: 4,
        title: 'DoubleViewGame 2',
        imageUrl: 'doubleviewgameimage2.bmp',
        leaderboards: [
            {
                title: 'Solo',
                times: [46, 53, 59]
            },
            {
                title: 'One versus One',
                times: [35, 39, 41]
            }
        ]
    }
];