import { Leaderboard } from './leaderboard';

export enum GameType {
    SingleView = 0,
    DoubleView = 1
}

export class Game { //TODO : faire une interface
    type: GameType;
    title: string;
    imageUrl: string[];
    leaderboards: Leaderboard[];
}