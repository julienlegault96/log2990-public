import { injectable } from "inversify";
import * as SocketIO from "socket.io";
import { SocketMessage } from "../../../../common/communication/sockets/socket-message";
import { SocketMessageType } from "../../../../common/communication/sockets/socket-message-type";
import { SocketEvents } from "../../../../common/communication/sockets/socket-requests";
import { SocketManager } from "../../socket.manager";
import { SocketGame } from "../../../../common/communication/sockets/socket-game";

@injectable()
export class MessageSocket {

    public manage(socket: SocketManager, ioSocket: SocketIO.Socket, message: SocketMessage): void {
        switch (message.type) {
            case SocketMessageType.ErrorFound:
                socket.ioServer.to(socket.socketUsers[ioSocket.id].gameRoomName).emit(SocketEvents.Message, message);
                break;
            case SocketMessageType.NoErrorFound:
                socket.ioServer.to(socket.socketUsers[ioSocket.id].gameRoomName).emit(SocketEvents.Message, message);
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
                this.removeUserFromRoom(socket, message, ioSocket);
                break;
            default:
                break;
        }
    }

    // tslint:disable-next-line:max-func-body-length
    private manageJoinedRoom(manager: SocketManager, message: SocketMessage, socket: SocketIO.Socket): void {
        manager.ioServer.sockets.emit(SocketEvents.Message, message);
        if (message.extraMessageInfo && message.extraMessageInfo.game) {
            const socketGame: SocketGame = message.extraMessageInfo.game;
            if (!manager.gameRooms[socketGame.gameId]) {
                manager.gameRooms[socketGame.gameId] = [];
            }
            const lobbyCount: number = manager.gameRooms[socketGame.gameId].length;
            const roomSize: number = 2;
            if (lobbyCount === 0 || manager.gameRooms[socketGame.gameId][lobbyCount - 1].length >= roomSize) {
                this.addUserToRoom(socketGame.gameId, lobbyCount , manager, socket);
                manager.indexRoom(socketGame.gameId, lobbyCount);
            } else {
                this.addUserToRoom(socketGame.gameId, lobbyCount - 1, manager, socket);
                manager.ioServer.to(manager.socketUsers[socket.id].gameRoomName).emit(SocketEvents.Message, message);
                if (manager.gameRooms[socketGame.gameId][lobbyCount - 1].length >= roomSize) {
                    const startMessage: SocketMessage = {
                        userId: message.userId,
                        type: SocketMessageType.StartedGame,
                        timestamp: Date.now(),
                        extraMessageInfo: {
                            game: {
                                gameId: socketGame.gameId,
                                name: socketGame.name,
                                mode: socketGame.mode,
                                roomName: manager.generateLobbyName(socketGame.gameId, lobbyCount - 1)
                            }
                        }
                    };
                    manager.ioServer.to(manager.socketUsers[socket.id].gameRoomName).emit(SocketEvents.Message, startMessage);
                }
            }
        }
    }

    private addUserToRoom(gameId: string, lobbyCount: number, manager: SocketManager, socket: SocketIO.Socket): void {
        const roomName: string = manager.generateLobbyName(gameId, lobbyCount);
        socket.join(roomName);
        manager.socketUsers[socket.id].gameRoomName = roomName;
    }

    private removeUserFromRoom(manager: SocketManager, message: SocketMessage, socket: SocketIO.Socket): void {
        manager.ioServer.to(manager.socketUsers[socket.id].gameRoomName).emit(SocketEvents.Message, message);

        const room: string = manager.socketUsers[socket.id].gameRoomName;
        socket.leave(room);

        if (message.extraMessageInfo && message.extraMessageInfo.game) {
            const socketGame: SocketGame = message.extraMessageInfo.game;
            manager.gameRooms[socketGame.gameId] = manager.gameRooms[socketGame.gameId]
                .filter((ioSocketRoom: SocketIO.Room) => ioSocketRoom.length > 0);
        }

        manager.socketUsers[socket.id].gameRoomName = "";
        manager.socketUsers[socket.id].isPlayingMultiplayer = false;
    }

   
}