import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { GameService } from "src/app/services/game/game.service";
import { AbstractGameCardComponent } from "src/app/views/abstract-game-card/abstract-game-card.component";
import { SocketService } from "src/app/services/socket/socket.service";
import { SocketMessage } from "../../../../../../common/communication/sockets/socket-message";
import { SocketEvents } from "../../../../../../common/communication/sockets/socket-requests";
import { SocketMessageType } from "../../../../../../common/communication/sockets/socket-message-type";
import { UserService } from "src/app/services/user/user.service";
import { MessageService } from "src/app/services/message/message.service";

@Component({
    selector: "app-game",
    templateUrl: "./game-card.component.html",
})

export class GameCardComponent extends AbstractGameCardComponent {

    public constructor(
        public socketService: SocketService,
        private userService: UserService,
        gameService: GameService,
        private messageService: MessageService,
        private router: Router,
    ) {
        super(gameService);
    }

    public joinGame(): void {
        const message: SocketMessage = {
            userId: this.userService.loggedUser._id,
            type: SocketMessageType.JoinedRoom
        };

        this.messageService.manage(message);

        this.socketService.emit<SocketMessage>(SocketEvents.Message, message);
        this.router.navigate(["/", "waiting"]);
    }

}
