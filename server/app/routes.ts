import { injectable, inject } from "inversify";
import { Router, Request, Response, NextFunction } from "express";

import Types from "./types";
import { Games } from "./routes/games";

@injectable()
export class Routes {

    public constructor(@inject(Types.Games) private games: Games) { }

    public get routes(): Router {
        const router: Router = Router();

        router.get("/games",
            (req: Request, res: Response, next: NextFunction) => this.games.getGames(req, res, next));
        router.post("/games",
            (req: Request, res: Response, next: NextFunction) => this.games.addGame(req, res, next));

        return router;
    }
}
