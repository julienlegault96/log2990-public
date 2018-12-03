import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { GameService } from "src/app/services/game/game.service";
import { AbstractGameCardComponent } from "src/app/views/abstract-game-card/abstract-game-card.component";
import { SocketService } from "src/app/services/socket/socket.service";
import { SocketMessage } from "../../../../../../common/communication/sockets/socket-message";
import { SocketEvents } from "../../../../../../common/communication/sockets/socket-requests";
import { SocketMessageType } from "../../../../../../common/communication/sockets/socket-message-type";
import { UserService } from "src/app/services/user/user.service";
import { MessageService } from "src/app/services/message/message.service";
import { GamePartyMode } from "../../../../../../common/game/game-party-mode";

@Component({
    selector: "app-game",
    templateUrl: "./game-card.component.html",
})

export class GameCardComponent extends AbstractGameCardComponent implements OnInit {
    public isJoinable: boolean;

    public constructor(
        public socketService: SocketService,
        private userService: UserService,
        protected gameService: GameService,
        private messageService: MessageService,
        private router: Router,
    ) {
        super(gameService);
        this.isJoinable = false;
    }

    public ngOnInit(): void {
        this.socketService.registerFunction(SocketEvents.Message, this.syncMultiplayerStatus.bind(this));
    }

    private syncMultiplayerStatus(message: SocketMessage): void {
        if (message.type === SocketMessageType.JoinedRoom || message.type === SocketMessageType.LeftRoom) {
            if (message.extraMessageInfo && message.extraMessageInfo.game && this.game._id === message.extraMessageInfo.game.gameId) {
                this.isJoinable = !this.isJoinable;
            }
        }
    }

    public joinGame(): void {
        const message: SocketMessage = this.generateSocketMessage(GamePartyMode.Multiplayer, SocketMessageType.JoinedRoom);
        this.messageService.manage(message);
        this.socketService.emit<SocketMessage>(SocketEvents.Message, message);
        this.router.navigate(["/", "waiting", this.game._id]);
    }

    public startGame(): void {
        const message: SocketMessage = this.generateSocketMessage(GamePartyMode.Solo, SocketMessageType.StartedGame);
        this.messageService.manage(message);
        this.socketService.emit<SocketMessage>(SocketEvents.Message, message);
        this.router.navigate(["/", "game", this.game._id, "solo"]);
    }

    private generateSocketMessage(mode: GamePartyMode, type: SocketMessageType): SocketMessage {
        return {
            userId: this.userService.loggedUser._id,
            type: type,
            timestamp: Date.now(),
            extraMessageInfo: {
                game: {
                    gameId: this.game._id,
                    name: this.game.title,
                    mode: mode
                }
            }
        };
    }

}
