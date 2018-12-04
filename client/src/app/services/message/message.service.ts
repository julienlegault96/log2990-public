import { SocketMessage } from "../../../../../common/communication/sockets/socket-message";
import { SocketMessageType } from "../../../../../common/communication/sockets/socket-message-type";
import { SocketEvents } from "../../../../../common/communication/sockets/socket-requests";
import { SocketService } from "../socket/socket.service";
import { Injectable } from "@angular/core";
import { GamePartyMode } from "../../../../../common/game/game-party-mode";

@Injectable()
export class MessageService {

    public messages: Array<string>;
    private initMessage: string = "Aucun message";

    public constructor(
        public socketService: SocketService,
    ) {
        this.messages = [this.initMessage];
        socketService.registerFunction(SocketEvents.Message, this.manage.bind(this));
    }

    public addMessage(message: string, timestamp?: number): void {
        if (this.messages[0] === this.initMessage) {
            this.messages = [];
        }

        this.messages.push((timestamp ? new Date(timestamp).toLocaleTimeString() + " – " : "") + message);
    }

    // tslint:disable-next-line:max-func-body-length
    public manage(message: SocketMessage): void {
        let messageText: string = "";
        switch (message.type) {
            case SocketMessageType.Connection:
                messageText += `${message.userId} vient de se connecter.`;
                break;
            case SocketMessageType.Disconnection:
                messageText += `${message.userId} vient de se déconnecter.`;
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
            case SocketMessageType.JoinedRoom:
            case SocketMessageType.LeftRoom:
            case SocketMessageType.EndedGame:
                return;
            default:
                messageText += `${message.userId} a fait quelque chose d'inattendu.`;
                break;
        }

        this.addMessage(messageText, message.timestamp);
    }

    private formatHighscoreMessage(message: SocketMessage): string {
        const firstPos: number = 1;
        const scndPos: number = 2;
        let messageText: string = "";
        if (message.extraMessageInfo && message.extraMessageInfo.highScore) {
            const position: string = message.extraMessageInfo.highScore.position === firstPos ? "première" :
                message.extraMessageInfo.highScore.position === scndPos ? "deuxième" : "troisième";

            messageText = `${message.userId} obtient la ${position}`;
            messageText += ` place dans les meilleurs temps du jeu ${message.extraMessageInfo.highScore.gameName} en `;
            messageText += `${message.extraMessageInfo.highScore.gameMode === GamePartyMode.Solo ? "solo" : "un contre un"}.`;
        }

        return messageText;
    }

    private formatMultiplayerUserId(message: SocketMessage): string {
        let messageText: string = "";
        if (message.extraMessageInfo && message.extraMessageInfo.game
            && message.extraMessageInfo.game.mode === GamePartyMode.Multiplayer) {
            messageText += ` par ${message.userId}`;
        }

        return messageText;
    }

}
