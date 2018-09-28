import { inject, injectable } from "inversify";
import { InsertOneWriteOpResult, DeleteWriteOpResultObject } from "mongodb";

import Types from "../../types";
import { Mongo, Collections } from "../../services/mongo";

@injectable()
export class Games<T> {

    public constructor(@inject(Types.Mongo) private mongo: Mongo) { }

    public async getAll(collection: Collections): Promise<T[]> {
        return this.mongo.findDocuments<T>(collection);
    }

    public async insert(elem: T, collection: Collections): Promise<InsertOneWriteOpResult> {
        return this.mongo.insertDocument<T>(collection, elem);
    }

    public async remove(elem: T, collection: Collections): Promise<DeleteWriteOpResultObject> {
        return this.mongo.removeDocument<T>(collection, elem);
    }

}
