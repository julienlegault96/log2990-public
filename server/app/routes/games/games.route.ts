import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";

import Types from "../../types";
import { Mongo, Collections } from "../../services/mongo";
import { AbstractRoute } from "../abstract-route/abstract-route";
// import { Imgur } from "../../services/imgur/imgur";

import { Game } from "../../../../common/game/game";
import { GameType } from "../../../../common/game/game-type";

// import { ImgDiffRoute } from "../img-diff/imgdiff.route";
import { CODES } from "../../../../common/communication/response-codes";

// import { FileService } from "../../services/file/file.service";
import { ImagesIndex } from "./images-index";
// import { ImageGenerator } from "../../services/image-generator/image-generator";
import { GameCreator } from "../../services/game-creator/game-creator";

@injectable()

export class GamesRoute extends AbstractRoute<Game> {

    public static readonly cachedDiffImagesMap: { [key: string]: string[]; } = {};

    private gameCreator: GameCreator;
    private readonly ID_RANGE: number = 1000000;
    private readonly errorCountException: string = "errorCount";

    public constructor(@inject(Types.Mongo) mongo: Mongo) {
        super(mongo);
        this.collection = Collections.Games;
        this.gameCreator = new GameCreator();
    }

    public async get(req: Request, res: Response, next: NextFunction): Promise<void> {
        res.status(CODES.OK).send(
            JSON.stringify(
                (await this.getAll()).map((game: Game) => {
                    game.imageUrl[ImagesIndex.FirstViewDifference] = "";
                    game.imageUrl[ImagesIndex.SecondViewDifference] = "";

                    return game;
                })
            )
        );
    }

    public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        const game: Game = await this.getOne(req.params.id);
        if (!GamesRoute.cachedDiffImagesMap[game._id] && game) {
            GamesRoute.cachedDiffImagesMap[game._id] =
                [game.imageUrl[ImagesIndex.FirstViewDifference], game.imageUrl[ImagesIndex.SecondViewDifference]];
        }

        res.status(CODES.OK).send(JSON.stringify(game));
    }

    public async post(req: Request, res: Response, next: NextFunction): Promise<void> {
        req.body._id = this.generateId();

        const imgurPromise: Promise<string[]> = (req.body.type === GameType.SingleView) ?
            this.gameCreator.singleViewUpload(req)
            : this.gameCreator.doubleViewUpload({ type: "geo", quantity: 20, modifications: { add: true, delete: true, color: true } });

        return imgurPromise
            .then((imagesUrl: string[]) => {
                req.body.imageUrl = imagesUrl;

                return super.post(req, res, next);
            })
            .catch((error: Error) => {
                const errorCode: number = (error.message === this.errorCountException) ? CODES.BAD_REQUEST : CODES.SERVER_ERROR;
                res.status(errorCode).send("Failed to create game");
            });
    }

    private generateId(): string {
        return Math.floor(Math.random() * this.ID_RANGE).toString();
    }

}
