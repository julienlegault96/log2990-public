import { RANDOM_USER_NAMES } from "../user/user";

const SCOREBOARD_SIZE: number = 3;

export const SINGLE_VIEW_BASE_TIME = 50;
export const MULTIPLE_VIEW_BASE_TIME = 200;

export class Score {
    username: string;
    time: number;
}

export class Leaderboard {
    title: string;
    scores: Score[] = [];
}

export function generateSoloLeaderboard(baseTime: number): Leaderboard {
    let leaderboard = generateLeaderboardTemplate(baseTime);
    leaderboard.title = "Solo";

    return leaderboard;
}

export function generateDuoLeaderboard(baseTime: number): Leaderboard {
    let leaderboard = generateLeaderboardTemplate(baseTime);
    leaderboard.title = "1 vs 1";

    return leaderboard;
}

export function generateLeaderboardTemplate(baseTime: number) {
    let leaderboard = new Leaderboard();

    for (let i = 0; i < SCOREBOARD_SIZE; i++) {
        leaderboard.scores.push(
            {
                username: RANDOM_USER_NAMES[Math.floor(Math.random() * RANDOM_USER_NAMES.length)],
                time: Math.floor(Math.random() * 30) + baseTime
            }
        );
    }

    leaderboard.scores = leaderboard.scores.sort((a: Score, b: Score) => a.time - b.time);

    return leaderboard;
}
