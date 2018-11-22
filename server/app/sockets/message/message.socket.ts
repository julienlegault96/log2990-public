import { injectable } from "inversify";
import * as SocketIO from "socket.io";
import { SocketMessage } from "../../../../common/communication/sockets/socket-message";
import { SocketMessageType } from "../../../../common/communication/sockets/socket-message-type";
import { SocketEvents } from "../../../../common/communication/sockets/socket-requests";

@injectable()
export class MessageSocket {

    public manage(message: SocketMessage, server: SocketIO.Server): void {
        switch (message.type) {
            case SocketMessageType.ErrorFound:
                break;
            case SocketMessageType.Connection:
                server.sockets.emit(SocketEvents.Message, message);
                break;
            case SocketMessageType.Disconnection:
                server.sockets.emit(SocketEvents.Message, message);
                break;
            default:
                break;
        }
    }

}
