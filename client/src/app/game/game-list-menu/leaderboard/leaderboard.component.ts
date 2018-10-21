import { Component, Input } from "@angular/core";

import { Leaderboard } from "../../../../../../common/game/leaderboard";

@Component({
    selector: "app-leaderboard",
    templateUrl: "./leaderboard.component.html",
})

export class LeaderboardComponent {
    @Input() public leaderboard: Leaderboard;
}
