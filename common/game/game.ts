import { GameType } from './game-type';
import { Leaderboard, generateSoloLeaderboard, generateDuoLeaderboard } from './leaderboard';

export class Game {
    _id: string;
    type: GameType;
    title: string;
    imageUrl: string[];
    leaderboards: Leaderboard[];
}

export function generateGameTemplate(): Game {
    const gameTemplate = new Game();
    gameTemplate.leaderboards.push(generateSoloLeaderboard());
    gameTemplate.leaderboards.push(generateDuoLeaderboard());

    return gameTemplate;
};