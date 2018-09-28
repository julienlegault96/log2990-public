import { Component, OnInit, Input } from "@angular/core";

import { Leaderboard } from "../../../../../../common/game/leaderboard";

@Component({
    selector: "app-leaderboard",
    templateUrl: "./leaderboard.component.html",
})

export class LeaderboardComponent implements OnInit {

    @Input() public leaderboard: Leaderboard;

    public constructor() { }

    public ngOnInit(): void {
    }

}
