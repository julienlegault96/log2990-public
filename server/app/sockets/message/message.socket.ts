import { injectable } from "inversify";
import { SocketMessage } from "../../../../common/communication/sockets/socket-message";

@injectable()
export class MessageSocket {

    public manage(message: SocketMessage): void {
        //
    }

}
