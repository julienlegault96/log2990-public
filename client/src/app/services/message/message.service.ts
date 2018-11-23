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
        let action: string;
        switch (message.type) {
            case SocketMessageType.Connection:
                action = "s'est connecté.";
                break;
            case SocketMessageType.Disconnection:
                action = "s'est déconnecté.";
                break;
            case SocketMessageType.Highscore:
                action = "a battu un temps record!";
                break;
            case SocketMessageType.NoErrorFound:
                action = "a mal identifié une erreur...";
                break;
            case SocketMessageType.ErrorFound:
                action = "a trouvé une erreur!";
                break;
            case SocketMessageType.JoinedRoom:
                action = "a joint la partie!";
                break;
            default:
                action = "a fait quelque chose d'inattendu!";
                break;
        }
        this.addMessage(`${message.userId} ${action}`);
    }

}
