import { GamePartyMode } from "../../game/game-party-mode";

export interface SocketGame {
    gameId: string;
    roomName?: string;
    mode: GamePartyMode;
}