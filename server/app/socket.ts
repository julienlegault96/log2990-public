import * as SocketIO from "socket.io";
import * as http from "http";
import { inject, injectable } from "inversify";
import Types from "./types";

import { SocketEvents } from "../../common/communication/socket-requests";
import { UserSocket } from "./sockets/user/user.socket";

import { User } from "../../common/user/user";

@injectable()
export class Socket {

    private io: SocketIO.Server;

    public constructor(
        @inject(Types.UserSocket) private userSocket: UserSocket,
    ) { }

    public init(server: http.Server): void {
        this.io = SocketIO(server);
        this.defineEvents();
    }

    private defineEvents(): void {
        const connections: { [key: string]: User } = {};

        this.io.on(SocketEvents.Connection, (socketio: SocketIO.Socket) => {

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
