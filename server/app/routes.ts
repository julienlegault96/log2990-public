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
            (req: Request, res: Response, next: NextFunction) => this.games.getGames(req, res, next)
            );
        router.post(
            "/games",
            (req: Request, res: Response, next: NextFunction) => this.games.addGame(req, res, next)
            );

        // USERS
        router.get(
            "/users",
            (req: Request, res: Response, next: NextFunction) => this.users.getUsers(req, res, next)
            );
        router.post(
            "/users",
            (req: Request, res: Response, next: NextFunction) => this.users.addUser(req, res, next)
            );
        router.delete(
            "/users",
            (req: Request, res: Response, next: NextFunction) => this.users.removeUser(req, res, next)
            );

        return router;
    }
}
