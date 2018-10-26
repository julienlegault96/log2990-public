import { injectable, inject } from "inversify";
import { Router, Request, Response, NextFunction } from "express";

import Types from "./types";
import { GamesRoute } from "./routes/games.route";
import { UsersRoute } from "./routes/users.route";
import { ImgDiffRoute } from "./routes/img-diff/imgdiff.route";
import { LeaderboardRoute } from "./routes/leaderboard/leaderboard.route";

@injectable()
export class Routes {

    public constructor(
        @inject(Types.GamesRoute) private gamesRoute: GamesRoute,
        @inject(Types.UsersRoute) private usersRoute: UsersRoute,
        @inject(Types.ImgDiffRoute) private imgDiffRoute: ImgDiffRoute,
        @inject(Types.LeaderboardRoute) private leaderboardRoute: LeaderboardRoute,
    ) {
    }

    public get routes(): Router {
        const router: Router = Router();

        router.get(
            "/imgdiff",
            (req: Request, res: Response, next: NextFunction) => this.imgDiffRoute.get(req, res, next)
        );

        // GAMES
        router.get(
            "/games",
            (req: Request, res: Response, next: NextFunction) => this.gamesRoute.get(req, res, next)
        );
        router.get(
            "/games/:id",
            (req: Request, res: Response, next: NextFunction) => this.gamesRoute.getById(req, res, next)
        );
        router.post(
            "/games",
            (req: Request, res: Response, next: NextFunction) => this.gamesRoute.post(req, res, next)
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
            (req: Request, res: Response, next: NextFunction) => this.usersRoute.get(req, res, next)
        );
        router.post(
            "/users",
            (req: Request, res: Response, next: NextFunction) => this.usersRoute.post(req, res, next)
        );
        router.delete(
            "/users/:id",
            (req: Request, res: Response, next: NextFunction) => this.users.deleteById(req, res, next)
        );

        return router;
    }

}
