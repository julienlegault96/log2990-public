import { Component, ViewChildren, QueryList, AfterContentInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
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
import { ErrorLocation } from "../../../../../common/communication/sockets/socket-error-location";
import { SocketGame } from "../../../../../common/communication/sockets/socket-game";
import { GamePartyMode } from "../../../../../common/game/game-party-mode";
import { Routing, RoutingGameMatchId } from "src/app/routing";

@Component({
    selector: "app-game-view",
    templateUrl: "./game-view.component.html",
    styleUrls: ["./game-view.component.css"]
})

export class GameViewComponent implements AfterContentInit {

    @ViewChildren("gameComponent") public gameComponent: QueryList<SoloGameComponent | MultiplayerGameComponent>;

    public playerIds: string[] = [];
    public game: Game;
    public matchId: string;

    public constructor(
        public messageService: MessageService,
        private activatedRoute: ActivatedRoute,
        private userService: UserService,
        private gameService: GameService,
        private socketService: SocketService,
        private router: Router,
    ) {
        this.playerIds.push(this.userService.loggedUser._id);
    }

    public ngAfterContentInit(): void {
        this.activatedRoute.params.subscribe((paramsId) => {
            this.matchId = paramsId.matchId;
            this.gameService.getGame(paramsId.id).subscribe((game) => {
                this.game = game;
                setTimeout(() => this.gameComponent.first.chrono.start());
            });
        });

        if (this.matchId === RoutingGameMatchId.Duel) {
            this.playerIds.push("autreJoueur");
        }
    }

    public userFoundError(errorLocation: ErrorLocation): void {
        this.emitMessage(SocketMessageType.ErrorFound, errorLocation);
    }

    public userFoundBadError(): void {
        this.emitMessage(SocketMessageType.NoErrorFound);
    }

    public joinGame(): void {
        const message: SocketMessage = this.generateSocketMessage(GamePartyMode.Multiplayer, SocketMessageType.JoinedRoom);
        this.messageService.manage(message);
        this.socketService.emit<SocketMessage>(SocketEvents.Message, message);
        this.router.navigate(["/", Routing.Waiting, this.game._id]);
    }

    public startGame(): void {
        const message: SocketMessage = this.generateSocketMessage(GamePartyMode.Solo, SocketMessageType.StartedGame);
        this.messageService.manage(message);
        this.socketService.emit<SocketMessage>(SocketEvents.Message, message);
        this.router.navigate(["/", Routing.Game, this.game._id, RoutingGameMatchId.Solo]);
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

    private emitMessage(messageType: SocketMessageType, errorLocation?: ErrorLocation): void {
        const socketGame: SocketGame = {
            gameId: this.game._id,
            mode: (this.playerIds.length === 1) ? GamePartyMode.Solo : GamePartyMode.Multiplayer
        };

        const message: SocketMessage = {
            userId: this.userService.loggedUser._id,
            type: messageType,
            timestamp: Date.now(),
            extraMessageInfo: {
                game: socketGame,
                ...(messageType === SocketMessageType.ErrorFound ? { errorLocation: errorLocation } : undefined),
            },
        };

        this.messageService.manage(message);
        this.socketService.emit<SocketMessage>(SocketEvents.Message, message);
    }
}
