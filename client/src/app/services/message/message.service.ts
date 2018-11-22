import { SocketMessage } from "../../../../../common/communication/sockets/socket-message";
import { SocketMessageType } from "../../../../../common/communication/sockets/socket-message-type";
import { SocketEvents } from "../../../../../common/communication/sockets/socket-requests";
import { SocketService } from "../socket/socket.service";
import { Injectable } from "@angular/core";

@Injectable()
export class MessageService {
    public messages: Array<string>;

    public constructor(public socketService: SocketService) {
        this.messages = [];
        socketService.registerFunction(SocketEvents.Message, this.manage.bind(this));
    }

    public addMessage(message: string): void {
        this.messages.push(message);
    }

    private manage(message: SocketMessage): void {
        let action: string;
        switch (message.type) {
            case SocketMessageType.Connection:
                action = " connected.";
                break;
            case SocketMessageType.Disconnection:
                action = " disconnected.";
                break;
            default:
                action = " fucked up.";
                break;
        }
        this.addMessage(message.userId + action);
    }

}