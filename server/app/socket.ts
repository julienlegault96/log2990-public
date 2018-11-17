import * as SocketIO from "socket.io";
import * as http from "http";
import { User } from "../../common/user/user";
import { SocketEvents } from "../../common/communication/socket-requests";

export class Socket {

    private io: SocketIO.Server;
    private connections: { [key: string]: User };

    public constructor(server: http.Server) {
        this.io = SocketIO(server);
        this.connections = {};

        this.io.on(SocketEvents.Connection, this.onConnection);
    }

    private onConnection(socketio: SocketIO.Socket): void {
        // User requests
        socketio.on(SocketEvents.UserConnection, (user: User) => {
            this.connections[socketio.id] = user;
        });

        socketio.on(SocketEvents.Disconnect, () => {
            if (this.connections[socketio.id] !== undefined) {
                // delete user from db with this.connections[socketio.id]._id
            }
        });
    }

}
