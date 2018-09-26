class Score {
    username: string;
    time: number;
}

export class Leaderboard {
    title: string;
    scores: Score[];
}

export const defaultLeaderboards: Leaderboard[] = [
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
];

export const resetLeaderboards: Leaderboard[] = [
    {
        "title": "Solo",
        "scores": [
            {
                "username": "Sophie",
                "time": 5
            },
            {
                "username": "Gabriel",
                "time": 5
            },
            {
                "username": "Louis",
                "time": 5
            },
        ]
    },
    {
        "title": "1 vs 1",
        "scores": [
            {
                "username": "Julien",
                "time": 5
            },
            {
                "username": "Din",
                "time": 5
            },
            {
                "username": "Kevin",
                "time": 5
            },
        ]
    }
];