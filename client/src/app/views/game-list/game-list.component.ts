import { Component } from "@angular/core";

import { GameService } from "src/app/services/game/game.service";
import { SocketService } from "src/app/services/socket/socket.service";

import { AbstractGameListComponent } from "src/app/views/abstract-game-list/abstract-game-list.component";

@Component({
    selector: "app-games",
    templateUrl: "./game-list.component.html",
})

export class GameListComponent extends AbstractGameListComponent {

    public constructor(gameService: GameService, socketService: SocketService) {
        super(gameService, socketService);
    }

}
