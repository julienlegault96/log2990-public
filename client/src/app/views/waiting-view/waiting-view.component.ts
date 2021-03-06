import { Component, AfterViewInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { SocketEvents } from "../../../../../common/communication/sockets/socket-requests";
import { SocketMessage, MessageOptions } from "../../../../../common/communication/sockets/socket-message";
import { SocketMessageType } from "../../../../../common/communication/sockets/socket-message-type";
import { SocketGame } from "../../../../../common/communication/sockets/socket-game";
import { GamePartyMode } from "../../../../../common/game/game-party-mode";

import { SocketService } from "src/app/services/socket/socket.service";
import { UserService } from "src/app/services/user/user.service";
import { Routing, RoutingGameMatchId } from "src/app/routing";

@Component({
    selector: "app-waiting-view",
    templateUrl: "./waiting-view.component.html"
})

export class WaitingViewComponent implements AfterViewInit {
    private waitingGameId: string;
    private exited: boolean;

    public constructor(
        private activatedRoute: ActivatedRoute,
        private socketService: SocketService,
        private userService: UserService,
        private router: Router,
    ) {
        this.socketService.registerFunction(SocketEvents.Message, this.retrieveMessages.bind(this));
        this.exited = false;
    }

    public retrieveMessages(message: SocketMessage): void {
        if (!this.exited && message.type === SocketMessageType.StartedGame &&
            message.extraMessageInfo && message.extraMessageInfo.game) {
            const socketGame: SocketGame = message.extraMessageInfo.game;
            if (socketGame.gameId === this.waitingGameId) {
                this.router.navigate(["/", Routing.Game, socketGame.gameId, RoutingGameMatchId.Duel]);
            }
        }
    }

    public ngAfterViewInit(): void {
        this.activatedRoute.params.subscribe((params) => {
            this.waitingGameId = params.id;
        });
    }

    public cancelGameCreation(): void {
        this.exited = true;
        const messageGame: SocketGame = {
            gameId : this.waitingGameId,
            mode: GamePartyMode.Multiplayer
        };

        const messageOptions: MessageOptions = {
            game: messageGame
        };

        const exitMessage: SocketMessage = {
            userId: this.userService.loggedUser._id,
            type: SocketMessageType.LeftRoom,
            timestamp: Date.now(),
            extraMessageInfo : messageOptions
        };
        this.socketService.emit(SocketEvents.Message, exitMessage);
        this.router.navigate(["/", Routing.GameList]);
    }
}
