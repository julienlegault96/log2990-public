import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Game } from '../../../../common/game/game';
import { AbstractServerService } from '../abstract-server.service';

@Injectable({
    providedIn: 'root'
})

export class GameService extends AbstractServerService {

    getGames(): Observable<Game[]> {
        // this.addGame();
        return this.getRequest<Game[]>('games', 'getGames');
        // return this.http.get<Game[]>(this.getUrl('games')).pipe(
        //     catchError(this.handleError<Game[]>("getGames"))
        // );
    }

    addGame(): void {
        const newGame = {
            type: 0,
            title: "SingleViewGame 2",
            imageUrl: [
                "single-view-game-2-1.bmp",
                "single-view-game-2-2.bmp"
            ],
            leaderboards: [
                {
                    title: "Solo",
                    times: [
                        14,
                        16,
                        19
                    ]
                },
                {
                    title: "1 vs 1",
                    times: [
                        10,
                        15,
                        17
                    ]
                }
            ]
        }
        this.postRequest<Game>('games', newGame, 'addGame');
    }

    isJoinable(game: Game): Observable<boolean> {
        return of(false);
    }

}