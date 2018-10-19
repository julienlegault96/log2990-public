import { injectable, inject } from "inversify";
import { Router, Request, Response, NextFunction } from "express";

import Types from "./types";
import { Games } from "./routes/games";
import { Users } from "./routes/users";

@injectable()
export class Routes {

    public constructor(
        @inject(Types.Games) private games: Games,
        @inject(Types.Users) private users: Users
    ) { }

    public get routes(): Router {
        const router: Router = Router();

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
        router.put(
            "/leaderboard",
            (req: Request, res: Response, next: NextFunction) => this.games.resetLeaderboard(req, res, next)
        );
        router.delete(
            "/games",
            (req: Request, res: Response, next: NextFunction) => this.games.delete(req, res, next)
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
            "/users",
            (req: Request, res: Response, next: NextFunction) => this.users.delete(req, res, next)
        );

        return router;
    }
}
