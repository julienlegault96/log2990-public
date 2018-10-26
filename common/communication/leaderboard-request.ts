import { GamePartyMode } from "../game/game-party-mode";

export interface LeaderboardRequest {
    id: number;
    partyMode: GamePartyMode;
    time: number;
    playerName: string;
}
