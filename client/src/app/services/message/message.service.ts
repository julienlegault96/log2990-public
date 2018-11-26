import { SocketMessage } from "../../../../../common/communication/sockets/socket-message";
import { SocketMessageType } from "../../../../../common/communication/sockets/socket-message-type";
import { SocketEvents } from "../../../../../common/communication/sockets/socket-requests";
import { SocketService } from "../socket/socket.service";
import { Injectable } from "@angular/core";
import { UserService } from "../user/user.service";

@Injectable()
export class MessageService {

    public messages: Array<string>;
    private initMessage: string = "Aucun message";

    public constructor(
        public socketService: SocketService,
        private userService: UserService,
    ) {
        this.messages = [this.initMessage];
        socketService.registerFunction(SocketEvents.Message, this.manageFromServer.bind(this));
    }

    public addMessage(message: string): void {
        if (this.messages[0] === this.initMessage) {
            this.messages = [];
        }
        this.messages.push(message);
    }

    public manageFromServer(message: SocketMessage): void {
        if (message.userId === this.userService.loggedUser._id) {
            return;
        }
        this.manage(message);
    }

    public manage(message: SocketMessage): void {
        switch (message.type) {
            case SocketMessageType.Connection:
                this.addMessage(`${message.userId} vient de se connecter.`);
                break;
            case SocketMessageType.Disconnection:
                this.addMessage(`${message.userId} vient de se déconnecter.`);
                break;
            case SocketMessageType.Highscore:
                this.addMessage(`${message.userId} a battu un temps record!`);
                break;
            case SocketMessageType.NoErrorFound:
                this.addMessage(`Erreur par ${message.userId}`);
                break;
            case SocketMessageType.ErrorFound:
                this.addMessage(`Différence trouvée par ${message.userId}`);
                break;
            case SocketMessageType.JoinedRoom:
                this.addMessage(`${message.userId} a joint la partie!`);
                break;
            default:
                this.addMessage(`${message.userId} a fait quelque chose d'inattendu!`);
                break;
        }
    }

}
