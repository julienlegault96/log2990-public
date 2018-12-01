import { injectable } from "inversify";
import * as SocketIO from "socket.io";
import { SocketMessage } from "../../../../common/communication/sockets/socket-message";
import { SocketMessageType } from "../../../../common/communication/sockets/socket-message-type";
import { SocketEvents } from "../../../../common/communication/sockets/socket-requests";
import { Socket } from "../../socket";
import { SocketGame } from "../../../../common/communication/sockets/socket-game";

@injectable()
export class MessageSocket {

    public manage(socket: Socket, ioSocket: SocketIO.Socket, message: SocketMessage): void {
        switch (message.type) {
            case SocketMessageType.ErrorFound:
                socket.ioServer.to(socket.socketUser[ioSocket.id].gameRoomName).emit(SocketEvents.Message, message);
                break;
            case SocketMessageType.NoErrorFound:
                socket.ioServer.to(socket.socketUser[ioSocket.id].gameRoomName).emit(SocketEvents.Message, message);
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
            case SocketMessageType.EndedGame:
                this.quitRoom(socket, message, ioSocket);
                break;
            default:
                break;
        }
    }
    private quitRoom(socket: Socket, message: SocketMessage, ioSocket: SocketIO.Socket): void {
        const room: string = socket.socketUser[ioSocket.id].gameRoomName;
        ioSocket.leave(room);
    }

    // TODO update when sophie is done
    // tslint:disable-next-line:max-func-body-length
    private manageJoinedRoom(socket: Socket, message: SocketMessage, ioSocket: SocketIO.Socket): void {
        if (message.extraMessageInfo && message.extraMessageInfo.Game) {
            const socketGame: SocketGame = message.extraMessageInfo.Game as SocketGame;
            if (!socket.gameRooms[socketGame.gameId]) {
                socket.gameRooms[socketGame.gameId] = [];
            }
            const size: number = socket.gameRooms[socketGame.gameId].length;
            const roomSize: number = 2;
            if (size === 0 || socket.gameRooms[socketGame.gameId][size - 1].length >= roomSize) {
                const roomName: string = `${socketGame.gameId}_${size}`;
                ioSocket.join(roomName);
                socket.gameRooms[socketGame.gameId][size] = socket.ioServer.sockets.adapter.rooms[roomName];
                socket.socketUser[ioSocket.id].gameRoomName = roomName;
                socket.ioServer.to(socket.socketUser[ioSocket.id].gameRoomName).emit(SocketEvents.Message, message);

            } else {
                const roomName: string = `${socketGame.gameId}_${size - 1}`;
                ioSocket.join(roomName);
                socket.socketUser[ioSocket.id].gameRoomName = roomName;
                const startMessage: SocketMessage = {
                    userId: message.userId,
                    type: SocketMessageType.StartedGame,
                    timestamp: Date.now(),
                    extraMessageInfo: {
                        Game: {
                            gameId: socketGame.gameId,
                            Name: socketGame.Name,
                            Mode: socketGame.Mode,
                            RoomName: roomName
                        }
                    }
                };
                socket.ioServer.to(socket.socketUser[ioSocket.id].gameRoomName).emit(SocketEvents.Message, message);
                socket.ioServer.to(socket.socketUser[ioSocket.id].gameRoomName).emit(SocketEvents.Message, startMessage);
            }
        }
    }

}
