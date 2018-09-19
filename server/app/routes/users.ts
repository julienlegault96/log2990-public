import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";

import Types from "../types";
import { User } from "../../../common/user/user";
import { Mongo, Collections } from "../services/mongo";

@injectable()
export class Users {

    public constructor(@inject(Types.Mongo) private mongo: Mongo) { }

    public async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        let response = await this.mongo.findDocuments<User>(Collections.Users);
        res.status(200).send(JSON.stringify(response));
    }

    public async addUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            let user: User = Object.assign(new User, req.body);
            let response = await this.mongo.insertDocument<User>(Collections.Users, user);

            if (response.result.ok) {
                res.sendStatus(200);
            } else {
                res.status(500).send("Failed to insert user into Mongo");
            }
        }
        catch (e) {
            res.status(400).send("User provided does not follow the valid format");
        }
    }
}