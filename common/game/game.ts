import { GameType } from './game-type';
import { Leaderboard } from './leaderboard';

export class Game {
    type: GameType;
    _id: number;
    title: string;
    imageUrl: string[];
    leaderboards: Leaderboard[];
}