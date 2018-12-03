import { injectable } from "inversify";
import * as SocketIO from "socket.io";
import { SocketMessage } from "../../../../common/communication/sockets/socket-message";
import { SocketMessageType } from "../../../../common/communication/sockets/socket-message-type";
import { SocketEvents } from "../../../../common/communication/sockets/socket-requests";
import { SocketManager } from "../../socket.manager";

@injectable()
export class MessageSocket {

    public manage(manager: SocketManager, ioSocket: SocketIO.Socket, message: SocketMessage): void {
        switch (message.type) {
            case SocketMessageType.ErrorFound:
                manager.ioServer.to(manager.connections[ioSocket.id].gameRoomName).emit(SocketEvents.Message, message);
                break;
            case SocketMessageType.NoErrorFound:
                manager.ioServer.to(manager.connections[ioSocket.id].gameRoomName).emit(SocketEvents.Message, message);
                break;
            case SocketMessageType.Connection:
                manager.ioServer.sockets.emit(SocketEvents.Message, message);
                break;
            case SocketMessageType.Disconnection:
                manager.ioServer.sockets.emit(SocketEvents.Message, message);
                break;
            case SocketMessageType.JoinedRoom:
                manager.manageJoinedRoom(message, ioSocket);
                break;
            case SocketMessageType.EndedGame:
                manager.removeUserFromRoom(message, ioSocket);
                break;
            default:
                break;
        }
    }
}
