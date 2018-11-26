import { SocketMessageType } from "./socket-message-type";
import { SocketHighscore } from "./socket-highscore";

export interface SocketMessage {
    userId: string;
    type: SocketMessageType;
    message?: string | number | SocketHighscore;
}
