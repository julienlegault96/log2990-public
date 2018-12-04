import { Component, AfterViewInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { SocketEvents } from "../../../../../common/communication/sockets/socket-requests";
import { SocketMessage, MessageOptions } from "../../../../../common/communication/sockets/socket-message";
import { SocketMessageType } from "../../../../../common/communication/sockets/socket-message-type";
import { SocketGame } from "../../../../../common/communication/sockets/socket-game";
import { GamePartyMode } from "../../../../../common/game/game-party-mode";

import { SocketService } from "src/app/services/socket/socket.service";
import { UserService } from "src/app/services/user/user.service";
import { Routing } from "src/app/routing";

@Component({
    selector: "app-waiting-view",
    templateUrl: "./waiting-view.component.html"
})

export class WaitingViewComponent implements AfterViewInit {
    private waitingGameId: string;

    public constructor(
        private activatedRoute: ActivatedRoute,
        private socketService: SocketService,
        private userService: UserService,
        private router: Router,
    ) {}

    public ngAfterViewInit(): void {
        this.activatedRoute.params.subscribe((params) => {
            this.waitingGameId = params.id;
        });
    }

    public cancelGameCreation(): void {
        const messageGame: SocketGame = {
            gameId : this.waitingGameId,
            name: "unknown",
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
        this.router.navigate(["/", Routing.Waiting]);
    }

}
