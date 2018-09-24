import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

import { AbstractServerService, Endpoints } from "./abstract-server.service";

import { Game } from "../../../../common/game/game";
import { defaultLeaderboards } from "../../../../common/game/leaderboard";

@Injectable()
export class GameService extends AbstractServerService {

    public getGames(): Observable<Game[]> {
        return this.getRequest<Game[]>(Endpoints.Games);
    }

    public addGame(newGame: Game): Observable<{} | Game> {
        return this.postRequest<Game>(Endpoints.Games, newGame);
    }

    public resetLeaderboard(toReset: Game): Observable<Game> {
        toReset.leaderboards = defaultLeaderboards;

        return this.putRequest<Game>(Endpoints.Leaderboard, toReset);
    }

    public isJoinable(game: Game): Observable<boolean> {
        return of(false);
    }
}
