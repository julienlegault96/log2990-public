import { SocketMessageType } from "./socket-message-type";
import { SocketHighscore } from "./socket-highscore";

export interface SocketMessage {
    userId: string;
    type: SocketMessageType;
    timestamp: number;
    message?: MessageOptions;
}

export interface MessageOptions{ 
    textMessage?: string,
    numbMessage?: number,
    HighScore?: SocketHighscore
};
