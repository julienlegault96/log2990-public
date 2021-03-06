import * as SocketIO from "socket.io-client";
import { SocketEvents } from "../../../../../common/communication/sockets/socket-requests";
import { DEFAULT_SERVER_HOST_URL } from "../../../../../common/communication/default-urls";

export class SocketService {

    private socket: SocketIOClient.Socket;
    public reconnectionPackage: Object;

    public constructor() {
        this.socket = SocketIO(DEFAULT_SERVER_HOST_URL, {query : this.reconnectionPackage});
        this.reconnectionPackage = {};
    }

    public emit<T>(requestType: SocketEvents, data: T): void {
        this.socket.emit(requestType, data);
    }

    public registerFunction(requestType: SocketEvents, f: Function): void {
        this.socket.on(requestType, f);
    }

    public unregisterFunction(requestType: SocketEvents, f: Function): void {
        this.socket.removeListener(requestType, f);
    }
}
