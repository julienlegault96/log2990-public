import { GamePartyMode } from "../../game/game-party-mode";

export interface SocketGame {
    gameId: string;
    Name: string;
    RoomName?: string;
    Mode: GamePartyMode;
}