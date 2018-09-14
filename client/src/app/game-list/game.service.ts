import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { Game } from '../../../../common/game/game';
import { BasicService } from '../basic.service';

@Injectable({
    providedIn: 'root'
})

export class GameService extends BasicService {

    private gamesUrl = this.BASE_URL + 'games';  // URL to web api

    public constructor(http: HttpClient) {
        super(http);
     }

    getGames(): Observable<Game[]> {
        return this.http.get<Game[]>(this.gamesUrl).pipe(
            catchError(this.handleError<Game[]>("getGames"))
        );
    }

    isJoinable(game: Game): Observable<boolean> {
        return of(false);
    }

}