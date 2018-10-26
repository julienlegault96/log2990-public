import { GameType } from './game-type';
import { Leaderboard } from './leaderboard';

export class Game {
    _id: string;
    type: GameType;
    title: string;
    imageUrl: string[];
    leaderboards: Leaderboard[];
}

export const newGameTemplate: Game = {
    "_id": "1",
    "type": GameType.SingleView,
    "title": "Nouveau jeu",
    "imageUrl": ["", ""],
    "leaderboards": [
        {
            "title": "Solo",
            "scores": [
                {
                    "username": "Sophie",
                    "time": Math.floor(Math.random() * 30) + 50
                },
                {
                    "username": "Gabriel",
                    "time": Math.floor(Math.random() * 30) + 50
                },
                {
                    "username": "Louis",
                    "time": Math.floor(Math.random() * 30) + 50
                },
            ]
        },
        {
            "title": "1 vs 1",
            "scores": [
                {
                    "username": "Julien",
                    "time": Math.floor(Math.random() * 30) + 50
                },
                {
                    "username": "Dine",
                    "time": Math.floor(Math.random() * 30) + 50
                },
                {
                    "username": "Kevin",
                    "time": Math.floor(Math.random() * 30) + 50
                },
            ]
        }
    ]
};