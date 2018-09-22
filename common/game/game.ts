import { GameType } from './game-type';
import { Leaderboard } from './leaderboard';

export class Game {
    type: GameType;
    title: string;
    imageUrl: string[];
    leaderboards: Leaderboard[];
}

export const newGameTemplate: Game = {
    "type": GameType.SingleView,
    "title": "Nouveau jeu",
    "imageUrl": ["", ""],
    "leaderboards": [
        {
            "title": "Solo",
            "scores": [
                {
                    "username": "Username1",
                    "time": 34
                },
                {
                    "username": "Username2",
                    "time": 46
                },
                {
                    "username": "Username3",
                    "time": 67
                },
            ]
        },
        {
            "title": "1 vs 1",
            "scores": [
                {
                    "username": "Username11",
                    "time": 15
                },
                {
                    "username": "Username22",
                    "time": 25
                },
                {
                    "username": "Username33",
                    "time": 35
                },
            ]
        }
    ]
};