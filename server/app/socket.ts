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

    private io: SocketIO.Server;

    public constructor(
        @inject(Types.UserSocket) private userSocket: UserSocket,
        @inject(Types.MessageSocket) private messageSocket: MessageSocket,
    ) { }

    public init(server: http.Server): void {
        this.io = SocketIO(server);
        this.defineEvents();
    }

    private defineEvents(): void {
        const connections: { [key: string]: User} = {};

        this.io.on(SocketEvents.Connection, (socket: SocketIO.Socket) => {
            // On connection, index
            socket.on(SocketEvents.UserConnection, (user: User) => {
                connections[socket.id] = user;
                this.io.sockets.emit(connections[socket.id]._id + " connected.");
            });

            socket.on(SocketEvents.Message, (message: SocketMessage) => {
                this.messageSocket.manage(message, this.io);
                // socketio.emit(SocketEvents.Message, message); // Emits to the current user
            });

            // On disconnection, if user was connected, clean its username from DB
            socket.on(SocketEvents.Disconnect, () => {
                if (connections[socket.id]) {
                    const notification: SocketMessage = {
                        userId: connections[socket.id]._id,
                        type: SocketMessageType.Disconnection
                    };

                    this.userSocket.deleteUser(connections[socket.id]._id);
                    this.io.sockets.emit(SocketEvents.Message, notification);
                }
            });
        });
    }
}
