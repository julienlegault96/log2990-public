import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";

import Types from "../types";
import { User } from "../../../common/user/user";
import { CODES } from "../../../common/communication/response-codes";
import { Mongo, Collections } from "../services/mongo";
import { InsertOneWriteOpResult, DeleteWriteOpResultObject, FilterQuery } from "mongodb";

@injectable()
export class Users {

    public constructor(@inject(Types.Mongo) private mongo: Mongo) { }

    public async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        const response: User[] = await this.mongo.findDocuments<User>(Collections.Users);
        res.status(CODES.OK).send(JSON.stringify(response));
    }

    public async addUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user: User = Object.assign(new User, req.body);
            const response: InsertOneWriteOpResult =
                await this.mongo.insertDocument<User>(Collections.Users, user);

            if (response.result.ok) {
                res.sendStatus(CODES.OK);
            } else {
                res.status(CODES.SERVER_ERROR).send("Failed to insert user into Mongo");
            }
        } catch (e) {
            res.status(CODES.BAD_REQUEST).send("User provided does not follow the valid format");
        }
    }

    public async removeUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userFilter: FilterQuery<User> = {$where: Object.assign(new User, req.body) };
            const response: DeleteWriteOpResultObject = 
                await this.mongo.removeDocument<User>(Collections.Users, userFilter);

            if (response.result.ok) {
                res.sendStatus(CODES.OK);
            } else {
                res.status(CODES.SERVER_ERROR).send("Failed to remove user from Mongo");
            }
        } catch (e) {
            res.status(CODES.BAD_REQUEST).send("User provided does not follow the valid format");
        }
    }
}
