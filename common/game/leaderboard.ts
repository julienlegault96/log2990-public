export class Score {
    username: string;
    time: number;
}

export class Leaderboard {
    title: string;
    scores: Score[];
}

export const DEFAULT_LEADERBOARDS: Leaderboard[] = [
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
                "username": "Dine",
                "time": 44
            },
            {
                "username": "Kevin",
                "time": 49
            },
        ]
    }
];

export const BLANK_LEADERBOARDS: Leaderboard[] = [
    {
        "title": "Solo",
        "scores": [
            {
                "username": "Sophie",
                "time": 0
            },
            {
                "username": "Gabriel",
                "time": 0
            },
            {
                "username": "Louis",
                "time": 0
            },
        ]
    },
    {
        "title": "1 vs 1",
        "scores": [
            {
                "username": "Julien",
                "time": 0
            },
            {
                "username": "Dine",
                "time": 0
            },
            {
                "username": "Kevin",
                "time": 0
            },
        ]
    }
];