import { Game } from "./game";
import { GameType } from "./game-type";

export const GAMES: Game[] = [
    {
        type: GameType.DoubleView,
        title: "DoubleViewGame 1",
        imageUrl: ["double-view-game-1.bmp"],
        leaderboards: [
            {
                title: "Solo",
                scores: [
                    {
                        username: "test",
                        time: 54
                    },
                    {
                        username: "test2",
                        time: 66
                    },
                    {
                        username: "test3",
                        time: 89
                    }
                ]
            },
            {
                title: "One versus One",
                scores: [
                    {
                        username: "test",
                        time: 33
                    },
                    {
                        username: "test2",
                        time: 14
                    },
                    {
                        username: "test3",
                        time: 24
                    }
                ]
            }
        ]
    },
    {
        type: GameType.DoubleView,
        title: "DoubleViewGame 2",
        imageUrl: ["double-view-game-2.bmp"],
        leaderboards: [
            {
                title: "Solo",
                scores: [
                    {
                        username: "test",
                        time: 54
                    },
                    {
                        username: "test2",
                        time: 66
                    },
                    {
                        username: "test3",
                        time: 89
                    }
                ]
            },
            {
                title: "One versus One",
                scores: [
                    {
                        username: "test",
                        time: 33
                    },
                    {
                        username: "test2",
                        time: 14
                    },
                    {
                        username: "test3",
                        time: 23
                    }
                ]
            }
        ]
    },
    {
        type: GameType.SingleView,
        title: "SingleViewGame 1",
        imageUrl: ["single-view-game-1.bmp"],
        leaderboards: [
            {
                title: "Solo",
                scores: [
                    {
                        username: "test",
                        time: 54
                    },
                    {
                        username: "test2",
                        time: 66
                    },
                    {
                        username: "test3",
                        time: 89
                    }]
            },
            {
                title: "One versus One",
                scores: [
                    {
                        username: "test",
                        time: 33
                    },
                    {
                        username: "test2",
                        time: 14
                    },
                    {
                        username: "test3",
                        time: 24
                    }
                ]
            }
        ]
    }
];