import * as SocketIO from "socket.io-client";
import { SocketEvents } from "../../../../../common/communication/sockets/socket-requests";

export class SocketService {

    private socket: SocketIOClient.Socket;

    public constructor() {
        this.socket = SocketIO("http://localhost:3000");
        this.listen();
    }

    public emit<T>(requestType: SocketEvents, data: T): void {
        this.socket.emit(requestType, data);
    }

    public listen(): void {
        this.socket.on(SocketEvents.Message, console.log);
    }

}
