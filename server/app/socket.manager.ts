import * as SocketIO from "socket.io";
import * as http from "http";
import { inject, injectable } from "inversify";
import Types from "./types";

import { User } from "../../common/user/user";
import { SocketEvents } from "../../common/communication/sockets/socket-requests";
import { SocketMessage } from "../../common/communication/sockets/socket-message";
import { GamePartyMode } from "../../common/game/game-party-mode";
import { SocketMessageType } from "../../common/communication/sockets/socket-message-type";

import { UserSocket } from "./sockets/user/user.socket";
import { MessageSocket } from "./sockets/message/message.socket";
import { UserConnection } from "./sockets/userConnection.socket";

type LobbyFunctor = (gameId: string, lobbies: Array<SocketIO.Room>, ) => void;
type ConnectionFunctor = (socketId: string, connection: UserConnection) => void;

@injectable()
export class SocketManager {

    private readonly LOBBY_SEPARATION_CHAR = "_";
    public gameLobbies: { [gameId: string]: Array<SocketIO.Room> };
    public ioServer: SocketIO.Server;
    public connections: { [socketId: string]: UserConnection };

    public constructor(
        @inject(Types.UserSocket) private userSocket: UserSocket,
        @inject(Types.MessageSocket) private messageSocket: MessageSocket,
    ) {
        this.connections = {};
        this.gameLobbies = {};
    }

    public init(server: http.Server): void {
        this.ioServer = SocketIO(server);
        this.defineEvents();
    }

    private defineEvents(): void {
        this.ioServer.on(SocketEvents.Connection, (socket: SocketIO.Socket) => {
            if (socket.handshake.query && socket.handshake.query._id) {
                this.indexConnection(socket.handshake.query._id, socket);
            }

            socket.on(SocketEvents.UserConnection, (user: User) => {
                if (this.connections[socket.id]) {
                    this.disconnectConnectedUser(this.connections[socket.id].userId, socket);
                }
                this.indexConnection(user._id, socket);
            });

            socket.on(SocketEvents.Message, (message: SocketMessage) => {
                this.messageSocket.manage(this, socket, message);
            });

            socket.on(SocketEvents.GameStateRequest, () => {
                this.sendWaitingGames(socket);
            });
            socket.on(SocketEvents.Disconnect, () => {
                if (this.connections[socket.id]) {
                    this.disconnectConnectedUser(this.connections[socket.id].userId, socket);
                    this.unindexConnection(this.connections[socket.id].userId, socket);
                }
            });

        });
    }

    private forEachLobby( functor: LobbyFunctor): void {
        for (const gameId in this.gameLobbies) {
            if (this.gameLobbies.hasOwnProperty(gameId)) {
                const lobbies: Array<SocketIO.Room> = this.gameLobbies[gameId];
                functor(gameId, lobbies);
            }
        }
    }

    private forEachConnection( functor: ConnectionFunctor): void {
        for (const socketId in this.connections) {
            if (this.connections.hasOwnProperty(socketId)) {
                const userConnection: UserConnection = this.connections[socketId];
                functor(socketId, userConnection);
            }
        }
    }

    private sendWaitingGames(socket: SocketIO.Socket): void {
        this.forEachLobby( (gameId: string, lobbies: Array<SocketIO.Room> ) => {
                if (lobbies && lobbies[lobbies.length - 1] && lobbies[lobbies.length - 1].length === 1 ) {
                    const joinMessage: SocketMessage = {
                        userId: "Someone",
                        type: SocketMessageType.JoinedRoom,
                        timestamp: Date.now(),
                        extraMessageInfo: {
                            game: {
                                gameId: gameId,
                                mode: GamePartyMode.Multiplayer,
                            }
                        }
                    };
                    socket.emit(SocketEvents.Message, joinMessage);
                }
            }
        );
    }

    private indexConnection(userId: string, socket: SocketIO.Socket): void {        
        this.connections[socket.id] = new UserConnection(userId);
    }

    private unindexConnection(userId: string, socket: SocketIO.Socket): void {
        const newConnections: { [socketId: string]: UserConnection } = {};
        this.forEachConnection( (socketId: string, connection: UserConnection) => {
            if (socketId !== socket.id && connection.userId !== userId) {
                newConnections[socketId] = connection;
            }
        });
        this.connections = newConnections;
    }

    private indexLobby(gameId: string, lobbyCount: number): void {
        this.gameLobbies[gameId][lobbyCount] = this.ioServer.sockets.adapter.rooms[this.generateLobbyName(gameId, lobbyCount)];
    }

    /**
     * removes all unused lobbies in a server's game
     *
     * @param gameId the game whose lobbies are to be cleaned
     */
    private unindexLobbies(gameId: string): void {
        this.gameLobbies[gameId] = this.gameLobbies[gameId].filter(
            (ioSocketRoom: SocketIO.Room) => ioSocketRoom.length > 0
            );
    }

    private disconnectConnectedUser(userId: string, socket: SocketIO.Socket ): void {
        this.userSocket.deleteUser(userId);

        if (this.connections[socket.id].gameRoomName !== "") {
            const leaveMessage: SocketMessage = {
                userId: userId,
                type: SocketMessageType.LeftRoom,
                timestamp: Date.now(),
                extraMessageInfo: {
                    game: {
                        gameId: this.extractGameName(this.connections[socket.id].gameRoomName),
                        mode: GamePartyMode.Multiplayer,
                        roomName: this.connections[socket.id].gameRoomName
                    }
                }
            };
            this.ioServer.sockets.emit(SocketEvents.Message, leaveMessage);
            socket.leave(this.connections[socket.id].gameRoomName);
            this.unindexLobbies(this.extractGameName(this.connections[socket.id].gameRoomName));
        }        
        const message: SocketMessage = {
            userId: userId,
            type: SocketMessageType.Disconnection,
            timestamp: Date.now()
        };

        this.ioServer.sockets.emit(SocketEvents.Message, message);
        
        this.connections[socket.id].reset();
    }

    private generateLobbyName(gameId: string, lobbyCount: number): string {
        return gameId + this.LOBBY_SEPARATION_CHAR + lobbyCount;
    }

    private extractGameName(lobbyName: string): string {
        const index: number = lobbyName.indexOf(this.LOBBY_SEPARATION_CHAR);
        return lobbyName.substring(0, index);
    }

    private addUserToRoom(gameId: string, lobbyCount: number, socket: SocketIO.Socket): void {
        const roomName: string = this.generateLobbyName(gameId, lobbyCount);
        socket.join(roomName);
        this.connections[socket.id].gameRoomName = roomName;
    }

    public removeUserFromRoom(message: SocketMessage, socket: SocketIO.Socket): void {
        this.ioServer.to(this.connections[socket.id].gameRoomName).emit(SocketEvents.Message, message);
        socket.leave(this.connections[socket.id].gameRoomName);

        if (message.extraMessageInfo && message.extraMessageInfo.game) {
            this.unindexLobbies(message.extraMessageInfo.game.gameId);
        }
        this.connections[socket.id].reset();
    }

    // tslint:disable-next-line:max-func-body-length
    public manageJoinedRoom(message: SocketMessage, socket: SocketIO.Socket): void {
        this.ioServer.sockets.emit(SocketEvents.Message, message);
        if (message.extraMessageInfo && message.extraMessageInfo.game) {
            const gameId: string = message.extraMessageInfo.game.gameId;
            if (!this.gameLobbies[gameId]) {
                this.gameLobbies[gameId] = [];
            }
            const lobbyCount: number = this.gameLobbies[gameId].length;
            const roomSize: number = 2;
            let gameRoomName: string = "";
            if (lobbyCount === 0 || this.gameLobbies[gameId][lobbyCount - 1].length >= roomSize) {
                this.addUserToRoom(gameId, lobbyCount , socket);
                this.indexLobby(gameId, lobbyCount);
                gameRoomName = this.generateLobbyName(gameId, lobbyCount);
            } else {
                this.addUserToRoom(gameId, lobbyCount - 1, socket);
                this.ioServer.to(this.connections[socket.id].gameRoomName).emit(SocketEvents.Message, message);
                gameRoomName = this.generateLobbyName(gameId, lobbyCount - 1);                
                if (this.gameLobbies[gameId][lobbyCount - 1].length >= roomSize) {
                    const startMessage: SocketMessage = {
                        userId: message.userId,
                        type: SocketMessageType.StartedGame,
                        timestamp: Date.now(),
                        extraMessageInfo: {
                            game: {
                                gameId: gameId,
                                mode: GamePartyMode.Multiplayer,
                                roomName: gameRoomName
                            }
                        }
                    };
                    this.ioServer.to(this.connections[socket.id].gameRoomName).emit(SocketEvents.Message, startMessage);
                }
            }           
            this.connections[socket.id].gameRoomName = gameRoomName;
        }
    }
}
