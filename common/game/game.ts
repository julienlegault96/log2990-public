import { GameType } from './game-type';
import { Leaderboard } from './leaderboard';

export class Game {
    type: GameType;
    title: string;
    imageUrl: string[];
    leaderboards: Leaderboard[];
}