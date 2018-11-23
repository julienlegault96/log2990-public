import Types from "../../types";
import { inject, injectable } from "inversify";

import { Mongo, Collections } from "../../services/mongo/mongo";

import { User } from "../../../../common/user/user";

@injectable()
export class UserSocket {

    private collection: Collections;

    public constructor(@inject(Types.Mongo) private mongo: Mongo) {
        this.collection = Collections.Users;
    }

    public async deleteUser(id: string): Promise<void> {
        await this.mongo.removeDocumentById<User>(this.collection, id);
    }

}
