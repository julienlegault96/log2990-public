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

@injectable()
export class Socket {

    public usersSocketId: { [key: string]: string };
    public usersRoom: { [key: string]: string };
    public ioServer: SocketIO.Server;

    public constructor(
        @inject(Types.UserSocket) private userSocket: UserSocket,
        @inject(Types.MessageSocket) private messageSocket: MessageSocket,
    ) {
        this.usersSocketId = {};
        this.usersRoom = {};
    }

    public init(server: http.Server): void {
        this.ioServer = SocketIO(server);
        this.defineEvents();
    }

    public emitToUser<T>(user: User, event: SocketEvents, message: T): void {
        this.ioServer.to(this.usersSocketId[user._id]).emit(event, message);
    }

    private defineEvents(): void {
        const connections: { [key: string]: User } = {};

        this.ioServer.on(SocketEvents.Connection, (socket: SocketIO.Socket) => {

            socket.on(SocketEvents.UserConnection, (user: User) => {
                this.usersSocketId[user._id] = socket.id;
                connections[socket.id] = user;
            });

            socket.on(SocketEvents.Message, (message: SocketMessage) => {
                this.messageSocket.manage(this, socket, message);
            });

            // On disconnection, if user was connected, clean its username from DB
            socket.on(SocketEvents.Disconnect, () => {
                if (connections[socket.id]) {
                    const notification: SocketMessage = {
                        userId: connections[socket.id]._id,
                        type: SocketMessageType.Disconnection
                    };

                    this.userSocket.deleteUser(connections[socket.id]._id);
                    this.ioServer.sockets.emit(SocketEvents.Message, notification);
                }
            });

        });
    }
}
