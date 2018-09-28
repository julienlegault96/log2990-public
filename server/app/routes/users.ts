import { inject, injectable } from "inversify";

import Types from "../types";
import { User } from "../../../common/user/user";
import { Mongo, Collections } from "../services/mongo";
import { AbstractRoute } from "./abstract-route/abstract-route";

@injectable()
export class Users extends AbstractRoute<User> {

    public constructor(@inject(Types.Mongo) mongo: Mongo) {
        super(mongo);
        this.collection = Collections.Users;
    }

}
