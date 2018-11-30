import { injectable } from "inversify";
import * as SocketIO from "socket.io";
import { SocketMessage } from "../../../../common/communication/sockets/socket-message";
import { SocketMessageType } from "../../../../common/communication/sockets/socket-message-type";
import { SocketEvents } from "../../../../common/communication/sockets/socket-requests";
import { Socket } from "../../socket";

@injectable()
export class MessageSocket {

    public manage(socket: Socket, ioSocket: SocketIO.Socket, message: SocketMessage): void {
        switch (message.type) {
            case SocketMessageType.ErrorFound:
                // il faut envoyer cet evenement du client (image-diff comp)
                socket.ioServer.sockets.emit(SocketEvents.Message, message);
                break;
            case SocketMessageType.Connection:
                socket.ioServer.sockets.emit(SocketEvents.Message, message);
                break;
            case SocketMessageType.Disconnection:
                socket.ioServer.sockets.emit(SocketEvents.Message, message);
                break;
            case SocketMessageType.JoinedRoom:
                this.manageJoinedRoom(socket, message, ioSocket);
                break;
            default:
                break;
        }
    }

    // TODO update when sophie is done
    private manageJoinedRoom(socket: Socket, message: SocketMessage, ioSocket: SocketIO.Socket): void {
        let i: number = 0;
        const maxPlayer: number = 2;

        // find the first available room
        while (socket.ioServer.sockets.adapter.rooms[`${message.message}_${i}`]
            && socket.ioServer.sockets.adapter.rooms[`${message.message}_${i}`].length >= maxPlayer) {
            i++;
        }

        socket.usersRoom[message.userId] = `${message.message}_${i}`;
        ioSocket.join(socket.usersRoom[message.userId]);
        this.emitToUsersRoom<SocketMessage>(
            socket,
            message.userId,
            SocketEvents.Message,
            {
                userId: message.userId,
                type: SocketMessageType.JoinedRoom,
                timestamp: Date.now()
            });
    }

    private emitToUsersRoom<T>(io: Socket, userId: string, event: SocketEvents, message: T): void {
        io.ioServer.to(io.usersRoom[userId]).emit(event, message);
    }

}
