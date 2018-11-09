import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";

import Types from "../../types";
import { Mongo, Collections } from "../../services/mongo/mongo";
import { AbstractRoute } from "../abstract-route/abstract-route";
import { ImagesIndex } from "../../models/images-index";
import { GameCreator } from "../../services/game-creator/game-creator";
import { GameCreationRequest } from "../../../../common/communication/game-creation-request";

import { Game } from "../../../../common/game/game";
import { GameType } from "../../../../common/game/game-type";
import { CODES } from "../../../../common/communication/response-codes";

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
        const request: GameCreationRequest = req.body as GameCreationRequest;

        let imgurPromise: Promise<Array<string>>;

        if (request.options) {
            imgurPromise = this.gameCreator.doubleViewUpload(request.options);
        } else {
            imgurPromise = this.gameCreator.singleViewUpload(
                request.newGame.imageUrl[ImagesIndex.FirstViewOriginal],
                request.newGame.imageUrl[ImagesIndex.FirstViewModified]
            );
        }

        return imgurPromise
            .then((imagesUrl: Array<string>) => {
                req.body = req.body.newGame;
                req.body._id = this.generateId();
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
