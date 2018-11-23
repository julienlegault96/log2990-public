import { SocketMessageType } from "./socket-message-type";

export interface SocketMessage {
    userId: string;
    type: SocketMessageType;
    message?: string | number;
}
