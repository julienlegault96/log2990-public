import { Component, ViewChild, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ChronoComponent } from "./chrono/chrono.component";
import { SoloGameComponent } from "./solo-game/solo-game.component";
import { UserService } from "../../services/user/user.service";
import { Game } from "../../../../../common/game/game";
import { GameService } from "src/app/services/game/game.service";
import { MessageService } from "src/app/services/message/message.service";
import { SocketService } from "src/app/services/socket/socket.service";
import { SocketEvents } from "../../../../../common/communication/sockets/socket-requests";
import { SocketMessage } from "../../../../../common/communication/sockets/socket-message";
import { SocketMessageType } from "../../../../../common/communication/sockets/socket-message-type";

@Component({
    selector: "app-game-view",
    templateUrl: "./game-view.component.html",
    styleUrls: ["./game-view.component.css"]
})

export class GameViewComponent implements OnInit {

    // @ViewChild(MessageBarComponent) public messageBar: MessageBarComponent;
    @ViewChild(ChronoComponent) public chrono: ChronoComponent;
    @ViewChild(SoloGameComponent) public soloGame: SoloGameComponent;

    public playerIds: string[] = new Array<string>();
    public game: Game;

    public constructor(
        public socketService: SocketService,
        public messageService: MessageService,
        private activatedRoute: ActivatedRoute,
        private userService: UserService,
        private gameService: GameService) {
        this.playerIds.push(this.userService.loggedUser._id);
    }

    public ngOnInit(): void {
        this.activatedRoute.params.subscribe((paramsId) => {
            this.gameService.getGame(paramsId.id).subscribe((game) => {
                this.game = game;
                this.chrono.start();

                // push player id 2 here
                // this.playerIds.push("bob");
            });
        });
        // TODO A déplacer pour que l'appel soit fait lorsque la vue est affichee
        this.socketService.emit<SocketMessage>(SocketEvents.Message, { userId: this.playerId, type: SocketMessageType.JoinedRoom });
    }

}
