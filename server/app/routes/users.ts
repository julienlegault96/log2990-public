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
        res.status(CODES.OK).send(JSON.stringify(await this.fetchUsers()));
    }

    public async fetchUsers(): Promise<User[]> {
        return this.mongo.findDocuments<User>(Collections.Users);
    }

    public async addUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const response: InsertOneWriteOpResult = await this. insertUser(Object.assign(new User, req.body));

            if (response.result.ok) {
                res.sendStatus(CODES.OK);
            } else {
                res.status(CODES.SERVER_ERROR).send("Failed to insert user into Mongo");
            }
        } catch (e) {
            res.status(CODES.BAD_REQUEST).send("User provided does not follow the valid format");
        }
    }

    public async insertUser(user: User): Promise<InsertOneWriteOpResult> {
        return this.mongo.insertDocument<User>(Collections.Users, user);
    }

    public async removeUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const response: DeleteWriteOpResultObject = await this. deleteUser(Object.assign(new User, req.body));

            if (response.result.ok) {
                res.sendStatus(CODES.OK);
            } else {
                res.status(CODES.SERVER_ERROR).send("Failed to remove user from Mongo");
            }
        } catch (e) {
            res.status(CODES.BAD_REQUEST).send("User provided does not follow the valid format");
        }
    }

    public async deleteUser(user: User): Promise<DeleteWriteOpResultObject> {
        const userFilter: FilterQuery<User> = {$where: user };

        return this.mongo.removeDocument<User>(Collections.Users, userFilter);
    }
}
