import { GamePartyMode } from "../../game/game-party-mode";

export interface SocketGame {
    _id?: string;
    Name: string;
    Mode: GamePartyMode;
}