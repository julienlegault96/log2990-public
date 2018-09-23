import "reflect-metadata";
import { injectable } from "inversify";
import {
    MongoClient,
    Db,
    FilterQuery,
    InsertWriteOpResult,
    InsertOneWriteOpResult,
    UpdateWriteOpResult,
    DeleteWriteOpResultObject,
    Collection
} from "mongodb";


export enum Collections {
    Games = "Games",
    Users = "Users"
}

@injectable()
export class Mongo {

    private readonly url: string = "mongodb://log2990-01:log2990-01@ds149672.mlab.com:49672/log2990-01";
    private readonly dbName: string = "log2990-01";
    private client: MongoClient;
    private db: Db;

    public constructor() {}

    private async connect(): Promise<void> {
        this.client = await MongoClient.connect(this.url, { useNewUrlParser: true });
        this.db = this.client.db(this.dbName);
    }

    public async findDocuments<Type>(collectionName: Collections, query: { [key: string]: any } = {}): Promise<Type[]> {
        if (!this.client || !this.client.isConnected) {
            await this.connect();
        }

        const collection: Collection<any> = this.db.collection(collectionName);

        return collection.find<Type>(query).toArray();
    }

    public async insertDocument<Type>(collectionName: Collections, doc: Type): Promise<InsertOneWriteOpResult> {
        if (!this.client || !this.client.isConnected) {
            await this.connect();
        }

        const collection: Collection<any> = this.db.collection(collectionName);

        return collection.insertOne(doc);
    }

    public async insertDocuments<Type>(collectionName: Collections, docs: Type[]): Promise<InsertWriteOpResult> {
        if (!this.client || !this.client.isConnected) {
            await this.connect();
        }

        const collection: Collection<any> = this.db.collection(collectionName);

        return collection.insertMany(docs);
    }

    public async updateDocument<Type>(collectionName: Collections,
                                      update: Type,
                                      filter: FilterQuery<Type> = {}
                                     ): Promise<UpdateWriteOpResult> {
        if (!this.client || !this.client.isConnected) {
            await this.connect();
        }

        const collection: Collection<any> = this.db.collection(collectionName);

        return collection.updateOne(filter, update);
    }

    public async removeDocument<Type>(collectionName: Collections, filter: FilterQuery<Type> = {}): Promise<DeleteWriteOpResultObject> {
        if (!this.client || !this.client.isConnected) {
            await this.connect();
        }

        const collection: Collection<any> = this.db.collection(collectionName);

        return collection.deleteOne(filter);
    }
}
