import { Component, Input } from "@angular/core";
import { SocketService } from "src/app/services/socket/socket.service";
import { SocketEvents } from "../../../../../../common/communication/sockets/socket-requests";
import { SocketMessage } from "../../../../../../common/communication/sockets/socket-message";
import { SocketMessageType } from "../../../../../../common/communication/sockets/socket-message-type";

@Component({
    selector: "app-message-bar",
    templateUrl: "./message-bar.component.html",
})

export class MessageBarComponent {

    @Input() public messages: string[] = [];

    public constructor(socketService: SocketService) {
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
