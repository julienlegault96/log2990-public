import { GamePartyMode } from "../game/game-party-mode";

export interface LeaderboardRequest {
    id: string;
    partyMode: GamePartyMode;
    time: number;
    playerName: string;
}
