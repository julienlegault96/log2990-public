import { Injectable } from "@angular/core";

import { AbstractServerService, Endpoints } from "../abstract-server.service";

import { LeaderboardRequest } from "../../../../../common/communication/leaderboard-request";

@Injectable()

export class LeaderboardService extends AbstractServerService {

    public sendGameScore(leaderboardRequest: LeaderboardRequest): void {
        this.postRequest<LeaderboardRequest>(Endpoints.Leaderboard, leaderboardRequest)
            .subscribe();
    }

}
