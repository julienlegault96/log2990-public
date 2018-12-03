import * as SocketIO from "socket.io";
import * as http from "http";
import { inject, injectable } from "inversify";
import Types from "./types";

import { SocketEvents } from "../../common/communication/sockets/socket-requests";
import { UserSocket } from "./sockets/user/user.socket";
import { SocketMessage } from "../../common/communication/sockets/socket-message";

import { User } from "../../common/user/user";
import { MessageSocket } from "./sockets/message/message.socket";
import { SocketMessageType } from "../../common/communication/sockets/socket-message-type";
import { UserConnection } from "./sockets/userConnection.socket";
import { GamePartyMode } from "../../common/game/game-party-mode";

@injectable()
export class SocketManager {

    public gameRooms: { [key: string]: Array<SocketIO.Room> }; // key=gameId
    public ioServer: SocketIO.Server;
    public socketUsers: { [key: string]: UserConnection }; // key=socketId

    public constructor(
        @inject(Types.UserSocket) private userSocket: UserSocket,
        @inject(Types.MessageSocket) private messageSocket: MessageSocket,
    ) {
        this.socketUsers = {};
        this.gameRooms = {};
    }

    public init(server: http.Server): void {
        this.ioServer = SocketIO(server);
        this.defineEvents();
    }

    private defineEvents(): void {
        this.ioServer.on(SocketEvents.Connection, (socket: SocketIO.Socket) => {

            socket.on(SocketEvents.UserConnection, (user: User) => {
                if (this.socketUsers[socket.id]) {
                    this.disconnectConnectedUser(this.socketUsers[socket.id]);
                }
                this.socketUsers[socket.id] = new UserConnection(user._id);
            });

            socket.on(SocketEvents.Message, (message: SocketMessage) => {
                this.messageSocket.manage(this, socket, message);
            });

            socket.on(SocketEvents.GameStateRequest, () => {
                this.sendWaitingGames(socket);
            });
            socket.on(SocketEvents.Disconnect, () => {
                if (this.socketUsers[socket.id]) {
                    this.disconnectConnectedUser(this.socketUsers[socket.id]);
                }
            });

        });
    }

    private disconnectConnectedUser(connection: UserConnection): void {
        this.userSocket.deleteUser(connection.userId);

        const message: SocketMessage = {
            userId: connection.userId,
            type: SocketMessageType.Disconnection,
            timestamp: Date.now()
        };
        this.ioServer.sockets.emit(SocketEvents.Message, message);
    }

    private sendWaitingGames(socket: SocketIO.Socket): void {
        for (const gameId in this.gameRooms) {
            if (this.gameRooms.hasOwnProperty(gameId)) {
                const rooms: Array<SocketIO.Room> = this.gameRooms[gameId];
                if (rooms && rooms[rooms.length - 1] && rooms[rooms.length - 1].length === 1 ) {
                    const joinMessage: SocketMessage = {
                        userId: "Someone",
                        type: SocketMessageType.JoinedRoom,
                        timestamp: Date.now(),
                        extraMessageInfo: {
                            game: {
                                gameId: gameId,
                                name: "Somegame",
                                mode: GamePartyMode.Multiplayer,
                            }
                        }
                    };
                    socket.emit(SocketEvents.Message, joinMessage);
                }
            }
        }
    }

    public generateLobbyName(gameId: string, lobbyCount: number): string {
        return gameId + "_" + lobbyCount;
    }

    public indexRoom(gameId: string, lobbyCount: number): void {
        this.gameRooms[gameId][lobbyCount] = this.ioServer.sockets.adapter.rooms[this.generateLobbyName(gameId, lobbyCount)];
    }

}
