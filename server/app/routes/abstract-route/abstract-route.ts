import { inject, injectable } from "inversify";
import { InsertOneWriteOpResult, DeleteWriteOpResultObject, UpdateWriteOpResult } from "mongodb";
import { Request, Response, NextFunction } from "express";

import Types from "../../types";
import { Mongo, Collections } from "../../services/mongo";

import { CODES } from "../../../../common/communication/response-codes";

@injectable()

export class AbstractRoute<T> {

    protected collection: Collections;

    public constructor(@inject(Types.Mongo) private mongo: Mongo) {
    }

    public async get(req: Request, res: Response, next: NextFunction): Promise<void> {
        res.status(CODES.OK).send(JSON.stringify(await this.getAll()));
    }

    public async post(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const elem: T = req.body;
            const response: InsertOneWriteOpResult = await this.insert(elem);

            if (response.result.ok) {
                res.status(CODES.OK).send();
            } else {
                res.status(CODES.SERVER_ERROR).send("Failed to insert element into Mongo");
            }
        } catch (e) {
            res.status(CODES.BAD_REQUEST).send("Element provided does not follow the valid format...");
        }
    }

    public async updateById(req: Request, res: Response, next: NextFunction, id: number): Promise<void> {
        try {
            const elem: T = req.body;
            const response: UpdateWriteOpResult = await this.update(id, elem);

            if (response.result.ok) {
                res.status(CODES.OK).send();
            } else {
                res.status(CODES.SERVER_ERROR).send("Failed to update element into Mongo");
            }
        } catch (e) {
            res.status(CODES.BAD_REQUEST).send("Element provided does not follow the valid format");
        }
    }

    public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const elem: T = req.body;
            const response: DeleteWriteOpResultObject = await this.remove(elem);

            if (response.result.ok) {
                res.status(CODES.OK).send();
            } else {
                res.status(CODES.SERVER_ERROR).send("Failed to remove element from Mongo");
            }
        } catch (e) {
            res.status(CODES.BAD_REQUEST).send("Element provided does not follow the valid format");
        }
    }

    public async getAll(): Promise<T[]> {
        return this.mongo.findDocuments<T>(this.collection);
    }

    public async insert(elem: T): Promise<InsertOneWriteOpResult> {
        return this.mongo.insertDocument<T>(this.collection, elem);
    }

    private async update(id: number, elem: T): Promise<UpdateWriteOpResult> {
        return this.mongo.updateDocumentById<T>(Collections.Games, id, elem);
    }

    public async remove(elem: T): Promise<DeleteWriteOpResultObject> {
        return this.mongo.removeDocument<T>(this.collection, elem);
    }

}