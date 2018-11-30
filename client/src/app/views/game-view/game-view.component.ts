import { Component, AfterViewInit, ViewChildren, QueryList } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { UserService } from "../../services/user/user.service";
import { Game } from "../../../../../common/game/game";
import { GameService } from "src/app/services/game/game.service";
import { MessageService } from "src/app/services/message/message.service";
import { SocketService } from "src/app/services/socket/socket.service";
import { SocketEvents } from "../../../../../common/communication/sockets/socket-requests";
import { SocketMessage } from "../../../../../common/communication/sockets/socket-message";
import { SocketMessageType } from "../../../../../common/communication/sockets/socket-message-type";
import { SoloGameComponent } from "./solo-game/solo-game.component";
import { MultiplayerGameComponent } from "./multiplayer-game/multiplayer-game.component";

@Component({
    selector: "app-game-view",
    templateUrl: "./game-view.component.html",
    styleUrls: ["./game-view.component.css"]
})

export class GameViewComponent implements AfterViewInit {

    @ViewChildren("gameComponent") public gameComponent: QueryList<SoloGameComponent | MultiplayerGameComponent>;

    public playerIds: string[] = [];
    public game: Game;

    public constructor(
        public messageService: MessageService,
        private activatedRoute: ActivatedRoute,
        private userService: UserService,
        private gameService: GameService,
        private socketService: SocketService,
    ) {
        this.playerIds.push(this.userService.loggedUser._id);
        this.playerIds.push("tesbsf");
    }

    public ngAfterViewInit(): void {
        this.activatedRoute.params.subscribe((paramsId) => {
            this.gameService.getGame(paramsId.id).subscribe((game) => {
                this.game = game;
                setTimeout(() => this.gameComponent.first.chrono.start());
            });
        });
    }

    public userFoundError(): void {
        this.emitMessage(SocketMessageType.ErrorFound);
    }

    public userFoundBadError(): void {
        this.emitMessage(SocketMessageType.NoErrorFound);
    }

    private emitMessage(messageType: SocketMessageType): void {
        const message: SocketMessage = {
            userId: this.userService.loggedUser._id,
            type: messageType
        };
        this.messageService.manage(message);
        this.socketService.emit<SocketMessage>(SocketEvents.Message, message);
    }
}
