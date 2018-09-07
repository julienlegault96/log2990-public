import { Leaderboard } from './leaderboard';

export class Game {
    id: number;
    title: string;
    imageUrl: string;
    leaderboards: Leaderboard[];
}