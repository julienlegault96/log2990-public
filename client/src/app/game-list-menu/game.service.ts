import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
// import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { Game } from '../../../../common/game/game';
import { BasicService } from '../basic.service';

@Injectable({
    providedIn: 'root'
})

export class GameService extends BasicService {

    private readonly serviceUrl = this.BASE_URL + 'games';  // URL to web api

    getGames(): Observable<Game[]> {
        return this.http.get<Game[]>(this.serviceUrl).pipe(
            catchError(this.handleError<Game[]>("getGames"))
        );
    }

    isJoinable(game: Game): Observable<boolean> {
        return of(false);
    }

}