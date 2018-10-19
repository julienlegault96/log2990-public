import { inject, injectable } from "inversify";
import { Request, Response, NextFunction } from "express";

import Types from "../types";
import { Mongo, Collections } from "../services/mongo";
import { Game } from "../../../common/game/game";
import { CODES } from "../../../common/communication/response-codes";

@injectable()
export class ImgDiff {

    private mongo: Mongo;
    private collection: Collections;

    public constructor(@inject(Types.Mongo) mongo: Mongo) {
        this.mongo = mongo;
        this.collection = Collections.Games;
    }

    public async get(req: Request, res: Response, next: NextFunction): Promise<void> {
        res.status(CODES.OK).send(
            JSON.stringify(
                await this.getDifferencePixel(
                    req.query.id,
                    {
                        x: Number(req.query.x),
                        y: Number(req.query.y)
                    }
                )
            )
        );
    }

    private async getDifferencePixel(id: string, coordinates: Coordinates): Promise<Coordinates[]> {
        // tslint:disable-next-line:max-line-length
        const imgData: string | undefined = "Qk3mBAAAAAAAADYAAAAoAAAAFAAAABQAAAABABgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////AAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////////////////AAAAAAAAAAAA////////////////////////////////////////AAAAAAAAAAAA////////////////////////////////////////////////////////////AAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////////////////////////////////////////////";
        if (imgData) {
            // const base64Prefix: string = "data:image/bmp;base64,";
            // (imgData.startsWith(base64Prefix)) ? imgData : `${base64Prefix}${imgData}`;
            // tslint:disable-next-line:no-console

            return this.getConnectedPixels(coordinates, new Buffer(imgData, "base64"));
        }

        return [];
    }

    private getConnectedPixels(initialCoordinates: Coordinates, image: Buffer): Array<Coordinates> {
        const connectedPixels: Array<Coordinates> = [];
        if (this.isDifference(initialCoordinates, image)) {
            const stack: Array<Coordinates> = [initialCoordinates];
            let currentCoordinates: Coordinates | undefined;
            while (currentCoordinates = stack.pop()) {
                const adjacentPixels: Array<Coordinates> = this.getAdjacentPixels(currentCoordinates);
                adjacentPixels.map((coordinates: Coordinates) => {
                    if (this.isDifference(coordinates, image)
                        && connectedPixels.findIndex((elem: Coordinates) => coordinates.x === elem.x && coordinates.y === elem.y) === -1
                        && stack.findIndex((elem: Coordinates) => coordinates.x === elem.x && coordinates.y === elem.y) === -1) {
                        stack.push(coordinates);
                    }
                });
                connectedPixels.push(currentCoordinates);
            }
        }

        return connectedPixels;
    }

    private getAdjacentPixels(coordinates: Coordinates): Array<Coordinates> {
        const adjacentPixels: Array<Coordinates> = [
            { x: coordinates.x + 1, y: coordinates.y },
            { x: coordinates.x, y: coordinates.y + 1 },
            { x: coordinates.x + 1, y: coordinates.y + 1 },
        ];

        if (coordinates.x > 0) {
            adjacentPixels.push(
                { x: coordinates.x - 1, y: coordinates.y },
                { x: coordinates.x - 1, y: coordinates.y + 1 }
            );
        }

        if (coordinates.y > 0) {
            adjacentPixels.push(
                { x: coordinates.x, y: coordinates.y - 1 },
                { x: coordinates.x + 1, y: coordinates.y - 1 }
            );
        }

        if (coordinates.x > 0 && coordinates.y > 0) {
            adjacentPixels.push(
                { x: coordinates.x - 1, y: coordinates.y - 1 }
            );
        }

        return adjacentPixels;
    }

    private isDifference(coordinates: Coordinates, image: Buffer): boolean {
        const pixel: Pixel = this.getPixelValue(coordinates, image);

        return pixel.red === 0
            && pixel.green === 0
            && pixel.blue === 0;
    }

    private getPixelValue(coordinates: Coordinates, image: Buffer): Pixel {
        const redOffset: number = 0;
        const greenOffset: number = 1;
        const blueOffset: number = 2;

        const position: number = this.getPosition(coordinates, image);

        return {
            red: image[position + redOffset],
            green: image[position + greenOffset],
            blue: image[position + blueOffset],
        };
    }

    private getPosition(coordinates: Coordinates, image: Buffer): number {
        const paddingByte: number = 4;
        const byteDepth: number = 3;
        const width: number = this.getImageWidth(image);
        const headerSize: number = 54;

        return headerSize + (width * (width - 1 - coordinates.y) + coordinates.x) * byteDepth
            + (width * (width - 1 - coordinates.y)) % paddingByte;
    }

    private getImageWidth(image: Buffer): number {
        // Le width de l'image bmp est sur 4 bytes
        // tslint:disable-next-line:no-bitwise no-magic-numbers
        return ((image[21] << 8 | image[20]) << 8 | image[19]) << 8 | image[18];
    }

    private getImageHeight(image: Buffer): number {
        // Le height de l'image bmp est sur 4 bytes
        // tslint:disable-next-line:no-bitwise no-magic-numbers
        return ((image[25] << 8 | image[24]) << 8 | image[23]) << 8 | image[22];
    }

    private async getDiffImg(id: string): Promise<string | undefined> {
        const games: Game[] = await this.getById(id);
        if (games[0]) {
            return games[0].imageUrl[2];
        } else {
            return undefined;
        }
    }

    private async getById(id: string): Promise<Game[]> {
        return this.mongo.findDocuments<Game>(this.collection, { _id: id });
    }

}

interface Coordinates {
    x: number;
    y: number;
}

interface Pixel {
    red: number;
    green: number;
    blue: number;
}
