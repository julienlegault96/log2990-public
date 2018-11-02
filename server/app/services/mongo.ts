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
    Collection,
} from "mongodb";

export enum Collections {
    Games = "Games_sprint3",
    Users = "Users"
}

@injectable()
export class Mongo {

    private readonly DB_URL: string = "mongodb://log2990-01:log2990-01@ds149672.mlab.com:49672/log2990-01";
    private readonly DB_NAME: string = "log2990-01";
    private client: MongoClient;
    private db: Db;

    public async findDocumentById<Type>(collectionName: Collections, id: string): Promise<Type> {
        if (!this.client || !this.client.isConnected) {
            await this.connect();
        }

        const collection: Collection = this.db.collection(collectionName);

        return collection.findOne({ _id: id });
    }

    public async findDocuments<Type>(collectionName: Collections, query: { [key: string]: string | number | {} } = {}): Promise<Type[]> {
        if (!this.client || !this.client.isConnected) {
            await this.connect();
        }

        const collection: Collection = this.db.collection(collectionName);

        return collection.find<Type>(query).toArray();
    }

    public async insertDocument<Type>(collectionName: Collections, doc: Type): Promise<InsertOneWriteOpResult> {
        if (!this.client || !this.client.isConnected) {
            await this.connect();
        }

        const collection: Collection = this.db.collection(collectionName);

        return collection.insertOne(doc);
    }

    public async insertDocuments<Type>(collectionName: Collections, docs: Type[]): Promise<InsertWriteOpResult> {
        if (!this.client || !this.client.isConnected) {
            await this.connect();
        }

        const collection: Collection = this.db.collection(collectionName);

        return collection.insertMany(docs);
    }

    public async updateDocument<Type>(collectionName: Collections, update: Type, filter: FilterQuery<Type> = {})
        : Promise<UpdateWriteOpResult> {
        if (!this.client || !this.client.isConnected) {
            await this.connect();
        }

        const collection: Collection = this.db.collection(collectionName);

        return collection.updateOne(filter, update);
    }

    public async updateDocumentById<Type>(collectionName: Collections, id: string, update: Type): Promise<UpdateWriteOpResult> {
        if (!this.client || !this.client.isConnected) {
            await this.connect();
        }

        const collection: Collection = this.db.collection(collectionName);

        return collection.replaceOne({ _id: id }, update);
    }

    public async removeDocument<Type>(collectionName: Collections, filter: FilterQuery<Type> = {}): Promise<DeleteWriteOpResultObject> {
        if (!this.client || !this.client.isConnected) {
            await this.connect();
        }

        const collection: Collection = this.db.collection(collectionName);

        return collection.deleteOne(filter);
    }

    public async removeDocumentById<Type>(collectionName: Collections, id: string): Promise<DeleteWriteOpResultObject> {
        if (!this.client || !this.client.isConnected) {
            await this.connect();
        }

        const collection: Collection = this.db.collection(collectionName);

        return collection.deleteOne({ _id: id });
    }

    private async connect(): Promise<void> {
        this.client = await MongoClient.connect(this.DB_URL, { useNewUrlParser: true });
        this.db = this.client.db(this.DB_NAME);
    }

}
