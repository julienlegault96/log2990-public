import { injectable, inject } from "inversify";
import { Router, Request, Response, NextFunction } from "express";

import Types from "./types";
import { Games } from "./routes/games";
import { Users } from "./routes/users";
import { ImgDiff } from "./routes/img-diff/imgdiff";
import { LeaderboardRoute } from "./routes/leaderboard/leaderboard.route";

@injectable()
export class Routes {

    public constructor(
        @inject(Types.Games) private games: Games,
        @inject(Types.Users) private users: Users,
        @inject(Types.ImgDiff) private imgDiff: ImgDiff,
        @inject(Types.LeaderboardRoute) private leaderboardRoute: LeaderboardRoute,
    ) {
    }

    public get routes(): Router {
        const router: Router = Router();

        router.get(
            "/imgdiff",
            (req: Request, res: Response, next: NextFunction) => this.imgDiff.get(req, res, next)
        );

        // GAMES
        router.get(
            "/games",
            (req: Request, res: Response, next: NextFunction) => this.games.get(req, res, next)
        );
        router.get(
            "/games/:id",
            (req: Request, res: Response, next: NextFunction) => this.games.getById(req, res, next)
        );
        router.post(
            "/games",
            (req: Request, res: Response, next: NextFunction) => this.games.post(req, res, next)
        );
        router.post(
            "/score",
            (req: Request, res: Response, next: NextFunction) => this.leaderboardRoute.post(req, res, next)
        );
        router.delete(
            "/games/:id",
            (req: Request, res: Response, next: NextFunction) => this.games.deleteById(req, res, next)
        );
        router.put(
            "/leaderboard/:id",
            (req: Request, res: Response, next: NextFunction) => this.games.updateLeaderboard(req, res, next)
        );

        // USERS
        router.get(
            "/users",
            (req: Request, res: Response, next: NextFunction) => this.users.get(req, res, next)
        );
        router.post(
            "/users",
            (req: Request, res: Response, next: NextFunction) => this.users.post(req, res, next)
        );
        router.delete(
            "/users/:id",
            (req: Request, res: Response, next: NextFunction) => this.users.deleteById(req, res, next)
        );

        return router;
    }

}
