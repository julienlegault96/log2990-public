import { SocketMessage } from "../../../../../common/communication/sockets/socket-message";
import { SocketMessageType } from "../../../../../common/communication/sockets/socket-message-type";
import { SocketEvents } from "../../../../../common/communication/sockets/socket-requests";
import { SocketService } from "../socket/socket.service";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "../user/user.service";
import { GamePartyMode } from "../../../../../common/game/game-party-mode";
import { SocketGame } from "../../../../../common/communication/sockets/socket-game";

@Injectable()
export class MessageService {

    public messages: Array<string>;
    private initMessage: string = "Aucun message";

    public constructor(
        public socketService: SocketService,
        private userService: UserService,
        private router: Router,
    ) {
        this.messages = [this.initMessage];
        socketService.registerFunction(SocketEvents.Message, this.manageFromServer.bind(this));
    }

    public addMessage(message: string, timestamp?: number): void {
        if (this.messages[0] === this.initMessage) {
            this.messages = [];
        }

        this.messages.push((timestamp ? new Date(timestamp).toLocaleTimeString() + " – " : "") + message);
    }

    public manageFromServer(message: SocketMessage): void {
        if (message.type !== SocketMessageType.Highscore
            && message.userId === this.userService.loggedUser._id) {
            return;
        }
        this.manage(message);
    }

    // tslint:disable-next-line:max-func-body-length
    public manage(message: SocketMessage): void {
        let messageText: string = "";
        switch (message.type) {
            case SocketMessageType.Connection:
                messageText += message.userId + " vient de se connecter.";
                break;
            case SocketMessageType.Disconnection:
                messageText += message.userId + " vient de se déconnecter.";
                break;
            case SocketMessageType.Highscore:
                messageText += this.formatHighscoreMessage(message);
                break;
            case SocketMessageType.NoErrorFound:
                messageText += "Erreur";
                messageText += this.formatMultiplayerUserId(message);
                messageText += ".";
                break;
            case SocketMessageType.ErrorFound:
                messageText += "Différence trouvée";
                messageText += this.formatMultiplayerUserId(message);
                messageText += ".";
                break;
            case SocketMessageType.StartedGame:
                console.log("start");
                if (message.extraMessageInfo && message.extraMessageInfo.Game) {

                    const socketGame: SocketGame = message.extraMessageInfo.Game as SocketGame;
                    this.router.navigate(["/", "game", socketGame.gameId, socketGame.RoomName]);

                    return;
                }
                break;
            case SocketMessageType.JoinedRoom:
                messageText += message.userId + " a joint la partie.";
                break;
            default:
                messageText += message.userId + " a fait quelque chose d'inattendu.";
                break;
        }
        this.addMessage(messageText, message.timestamp);
    }

    private formatHighscoreMessage(message: SocketMessage): string {
        const firstPos: number = 1;
        const scndPos: number = 2;
        let messageText: string = "";
        if (message.extraMessageInfo && message.extraMessageInfo.HighScore) {
            const position: string = message.extraMessageInfo.HighScore.position === firstPos ? "première" :
                message.extraMessageInfo.HighScore.position === scndPos ? "deuxième" : "troisième";

            messageText = message.userId + " obtient la " + position;
            messageText += " place dans les meilleurs temps du jeu " + message.extraMessageInfo.HighScore.gameName + " en ";
            messageText += (message.extraMessageInfo.HighScore.gameMode === GamePartyMode.Solo ? "solo" : "un contre un") + ".";
        }

        return messageText;
    }

    private formatMultiplayerUserId(message: SocketMessage): string {
        let messageText: string = "";
        if (message.extraMessageInfo && message.extraMessageInfo.Game
            && message.extraMessageInfo.Game.Mode === GamePartyMode.Multiplayer) {
            messageText += " par " + message.userId;
        }

        return messageText;
    }

}
