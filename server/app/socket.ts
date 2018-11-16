import * as SocketIO from "socket.io";
import * as http from "http";
import { User } from "../../common/user/user";

// tslint:disable:no-console
export class Socket {

    private io: SocketIO.Server;

    public constructor(server: http.Server) {
        this.io = SocketIO(server);

        const clients: any = {};
        this.io.on("connection", (socketio: SocketIO.Socket) => {
            console.log("anon connected");

            socketio.on("0", (message: User) => {
                clients[socketio.id] = { user: message };
                console.log(`${message._id} connected`);
            });

            socketio.on("disconnect", () => {
                console.log(`${clients[socketio.id].user._id} disconnected`);
            });

        });
    }

}
