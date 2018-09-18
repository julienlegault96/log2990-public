import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { AbstractServerService } from '../abstract-server.service';

import { Game } from '../../../../common/game/game';

@Injectable({
    providedIn: 'root'
})

export class GameService extends AbstractServerService {

    getGames(): Observable<Game[]> {
        return this.getRequest<Game[]>('games', 'getGames');
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
                    scores: [
                        {
                            username: "test",
                            time: 14
                        },
                        {
                            username: "test2",
                            time: 16
                        },
                        {
                            username: "test3",
                            time: 19
                        }
                    ]
                },
                {
                    title: "1 vs 1",
                    scores: [
                        {
                            username: "test",
                            time: 10
                        },
                        {
                            username: "test2",
                            time: 15
                        },
                        {
                            username: "test3",
                            time: 17
                        }
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