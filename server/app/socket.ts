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
    private io: SocketIO.Server;

    public constructor(
        @inject(Types.UserSocket) private userSocket: UserSocket,
        @inject(Types.MessageSocket) private messageSocket: MessageSocket,
    ) {
        this.usersSocketId = {};
    }

    public init(server: http.Server): void {
        this.io = SocketIO(server);
        this.defineEvents();
    }

    public emitToUser<T>(user: User, event: SocketEvents, message: T): void {
        this.io.to(this.usersSocketId[user._id]).emit(event, message);
    }

    public emitToRoom<T>(room: string, event: SocketEvents, message: T): void {
        this.io.to(room).emit(event, message);
    }

    private defineEvents(): void {
        const connections: { [key: string]: User } = {};

        // tslint:disable-next-line:max-func-body-length
        this.io.on(SocketEvents.Connection, (socket: SocketIO.Socket) => {
            // On connection, index
            socket.on(SocketEvents.Message, (message: SocketMessage) => {
                // creating a unique game room id
                let i: number = 0;
                const maxPlayer: number = 2;
                // find the first available room
                // tslint:disable-next-line:no-empty
                while (this.io.sockets.adapter.rooms[`${message.message}_${i}`]
                    && this.io.sockets.adapter.rooms[`${message.message}_${i}`].length >= maxPlayer) {
                    i++;
                }

                socket.join(`${message.message}_${i}`);
                const socketMessage: SocketMessage = { userId: connections[socket.id]._id, type: SocketMessageType.JoinedRoom };
                this.emitToRoom<SocketMessage>(`${message.message}_${i}`, SocketEvents.Message, socketMessage);
            });

            socket.on(SocketEvents.UserConnection, (user: User) => {
                connections[socket.id] = user;
                this.usersSocketId[user._id] = socket.id;
            });

            socket.on(SocketEvents.Message, (message: SocketMessage) => {
                this.messageSocket.manage(message, this.io);
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
