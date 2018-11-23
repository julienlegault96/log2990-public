import { injectable } from "inversify";
import * as SocketIO from "socket.io";
import { SocketMessage } from "../../../../common/communication/sockets/socket-message";
import { SocketMessageType } from "../../../../common/communication/sockets/socket-message-type";
import { SocketEvents } from "../../../../common/communication/sockets/socket-requests";
import { User } from "../../../../common/user/user";

@injectable()
export class MessageSocket {

    public manage(server: SocketIO.Server, socket: SocketIO.Socket, connections: { [key: string]: User }, message: SocketMessage): void {
        switch (message.type) {
            case SocketMessageType.ErrorFound:
                break;
            case SocketMessageType.Connection:
                server.sockets.emit(SocketEvents.Message, message);
                break;
            case SocketMessageType.Disconnection:
                server.sockets.emit(SocketEvents.Message, message);
                break;
            case SocketMessageType.JoinedRoom:
                let i: number = 0;
                const maxPlayer: number = 2;
                // find the first available room
                // tslint:disable-next-line:no-empty
                while (server.sockets.adapter.rooms[`${message.message}_${i}`]
                    && server.sockets.adapter.rooms[`${message.message}_${i}`].length >= maxPlayer) {
                    i++;
                }

                socket.join(`${message.message}_${i}`);
                const socketMessage: SocketMessage = { userId: connections[socket.id]._id, type: SocketMessageType.JoinedRoom };
                server.to(`${message.message}_${i}`).emit(SocketEvents.Message, socketMessage);
                break;
            default:
                break;
        }
    }

}
