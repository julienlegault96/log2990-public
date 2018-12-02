import { SocketMessageType } from "./socket-message-type";
import { SocketHighscore } from "./socket-highscore";
import { SocketGame } from "./socket-game";
import { ErrorLocation } from "./socket-error-location";

export interface SocketMessage {
    userId: string;
    type: SocketMessageType;
    timestamp: number;
    extraMessageInfo?: MessageOptions;
}

export interface MessageOptions {
    highScore?: SocketHighscore,
    game?: SocketGame,
    errorLocation?: ErrorLocation,
};
