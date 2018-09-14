import { Component, OnInit, Input } from '@angular/core';

import { Game } from '../../../../../common/game/game';
import { GameService } from '../game.service';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

    @Input() public game: Game;
    public isJoinable: boolean;

    constructor(private gameService: GameService) { }

    ngOnInit() {
        this.gameService.isJoinable(this.game)
            .subscribe(isJoinable => this.isJoinable = isJoinable);
    }

}
