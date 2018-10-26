import { inject, injectable } from "inversify";

import Types from "../../types";
import { Mongo, Collections } from "../../services/mongo";
import { AbstractRoute } from "../abstract-route/abstract-route";

import { User } from "../../../../common/user/user";

@injectable()
export class UsersRoute extends AbstractRoute<User> {

    public constructor(@inject(Types.Mongo) mongo: Mongo) {
        super(mongo);
        this.collection = Collections.Users;
    }

}
