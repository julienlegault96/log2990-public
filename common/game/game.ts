import { GameType } from './game-type';
import { Leaderboard, generateSoloLeaderboard, generateDuoLeaderboard } from './leaderboard';

export class Game {
    _id: string;
    type: GameType;
    title: string;
    imageUrl: string[] = [];
    leaderboards: Leaderboard[] = [];
}

export function generateGameTemplate(leaderboardBaseTime: number): Game {
    const gameTemplate = new Game();
    gameTemplate.leaderboards.push(generateSoloLeaderboard(leaderboardBaseTime));
    gameTemplate.leaderboards.push(generateDuoLeaderboard(leaderboardBaseTime));

    return gameTemplate;
};