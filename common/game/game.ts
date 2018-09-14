import { Leaderboard } from './leaderboard';

enum GameType {
    SingleView = 0,
    DoubleView = 1
}

export class Game {
    type: GameType;
    title: string;
    imageUrl: string[];
    leaderboards: Leaderboard[];
}