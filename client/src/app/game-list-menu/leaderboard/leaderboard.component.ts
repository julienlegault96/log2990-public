import { Component, OnInit, Input } from '@angular/core';

import { Leaderboard } from '../../../../../common/game/leaderboard';

@Component({
    selector: 'app-leaderboard',
    templateUrl: './leaderboard.component.html',
    styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {

    @Input() leaderboard: Leaderboard;

    constructor() { }

    ngOnInit() {
    }

}
