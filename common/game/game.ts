import { GameType } from './game-type';
import { Leaderboard } from './leaderboard';

export class Game {
    _id: number;
    type: GameType;
    title: string;
    imageUrl: string[];
    leaderboards: Leaderboard[];
}

export const newGameTemplate: Game = {
    "_id": 1,
    "type": GameType.SingleView,
    "title": "Nouveau jeu",
    "imageUrl": ["", ""],
    "leaderboards": [
        {
            "title": "Solo",
            "scores": [
                {
                    "username": "Sophie",
                    "time": 48
                },
                {
                    "username": "Gabriel",
                    "time": 52
                },
                {
                    "username": "Louis",
                    "time": 59
                },
            ]
        },
        {
            "title": "1 vs 1",
            "scores": [
                {
                    "username": "Julien",
                    "time": 40
                },
                {
                    "username": "Din",
                    "time": 44
                },
                {
                    "username": "Kevin",
                    "time": 49
                },
            ]
        }
    ]
};