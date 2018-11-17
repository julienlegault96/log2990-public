import * as SocketIO from "socket.io-client";
import { SocketEvents } from "../../../../../common/communication/socket-requests";

export class SocketService {

    private socket: SocketIOClient.Socket;

    public constructor() {
        this.socket = SocketIO("http://localhost:3000");
    }

    public emit<T>(requestType: SocketEvents, data: T): void {
        this.socket.emit(requestType, data);
    }

}
