import { Component, Input } from "@angular/core";

import { Leaderboard } from "../../../../../../common/game/leaderboard";
import { getformattedTime } from "../../../../../../common/helpers/time";

@Component({
    selector: "app-leaderboard",
    templateUrl: "./leaderboard.component.html",
})

export class LeaderboardComponent {

    @Input() public leaderboard: Leaderboard;

    public formatLeaderboardTime(seconds: number): string {
        return getformattedTime(seconds);
    }

}
