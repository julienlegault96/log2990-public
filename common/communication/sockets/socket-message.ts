import { SocketMessageType } from "./socket-message-type";
import { SocketHighscore } from "./socket-highscore";
import { SocketGame } from "./socket-game";

export interface SocketMessage {
    userId: string;
    type: SocketMessageType;
    timestamp: number;
    extraMessageInfo?: MessageOptions;
}

export interface MessageOptions{ 
    HighScore?: SocketHighscore
    Game?: SocketGame
};
