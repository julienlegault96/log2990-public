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

@injectable()
export class Socket {
    
    public usersRoom: { [key: string]: string };
    public ioServer: SocketIO.Server;
    public socketUser: { [key: string]: UserConnection };

    public constructor(
        @inject(Types.UserSocket) private userSocket: UserSocket,
        @inject(Types.MessageSocket) private messageSocket: MessageSocket,
    ) {
        this.usersRoom = {};
        this.socketUser = {};
    }

    public init(server: http.Server): void {
        this.ioServer = SocketIO(server);
        this.defineEvents();
    }

    private defineEvents(): void {
        //const connections: { [key: string]: User } = {};

        this.ioServer.on(SocketEvents.Connection, (socket: SocketIO.Socket) => {

            socket.on(SocketEvents.UserConnection, (user: User) => {
                this.disconnectConnectedUser(this.socketUser[socket.id]);
                this.socketUser[socket.id] = new UserConnection(user._id);
            });

            socket.on(SocketEvents.Message, (message: SocketMessage) => {
                this.messageSocket.manage(this, socket, message);
            });

            socket.on(SocketEvents.Disconnect, () => {
                this.disconnectConnectedUser(this.socketUser[socket.id]);
            });
        });
    }

    private disconnectConnectedUser(connection: UserConnection | undefined): void {
        if (connection) {
            this.userSocket.deleteUser(connection.userId);
            const message: SocketMessage = {
                userId: connection.userId,
                type: SocketMessageType.Disconnection,
                timestamp: Date.now()
            };
            this.ioServer.sockets.emit(
                SocketEvents.Message,
                message
            );
        }
    }
}
