import { GameType } from './game-type';
import { Leaderboard } from './leaderboard';

export class Game {
    type: GameType;
    _id: number;
    title: string;
    imageUrl: string[];
    leaderboards: Leaderboard[];
}

export const newGameTemplate: Game = {
    "type": GameType.SingleView,
    "_id": 1,
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