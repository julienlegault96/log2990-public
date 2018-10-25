import { Component, Input, OnInit } from "@angular/core";

import { Leaderboard, Score } from "../../../../../../common/game/leaderboard";

@Component({
    selector: "app-leaderboard",
    templateUrl: "./leaderboard.component.html",
})

export class LeaderboardComponent implements OnInit {
    @Input() public leaderboard: Leaderboard;

    public ngOnInit(): void {
        this.sortScores(this.leaderboard.scores);
    }

    public sortScores(pScores: Array<Score>): Array<Score> {
        return pScores.sort((a: Score, b: Score) => {
            return a.time - b.time;
        });
    }
}
