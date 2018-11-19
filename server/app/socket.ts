import * as SocketIO from "socket.io";
import * as http from "http";
import { inject, injectable } from "inversify";
import Types from "./types";

import { SocketEvents } from "../../common/communication/sockets/socket-requests";
import { UserSocket } from "./sockets/user/user.socket";
import { SocketMessage } from "../../common/communication/sockets/socket-message";


import { User } from "../../common/user/user";
import { MessageSocket } from "./sockets/message/message.socket";

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
        const connections: { [key: string]: User } = {};

        this.io.on(SocketEvents.Connection, (socketio: SocketIO.Socket) => {

            socketio.on(SocketEvents.Message, (message: SocketMessage) => {
                console.log(message);
                this.messageSocket.manage(message);
                this.io.sockets.emit(SocketEvents.Message, message); // Emits to everyone connected
                // socketio.emit(SocketEvents.Message, message); // Emits to the current user
            });

            socketio.on(SocketEvents.UserConnection, (user: User) => {
                connections[socketio.id] = user;
            });

            // On disconnection, if user was connected, clean its username from DB
            socketio.on(SocketEvents.Disconnect, () => {
                if (connections[socketio.id]) {
                    this.userSocket.deleteUser(connections[socketio.id]._id);
                }
            });

        });
    }
}
