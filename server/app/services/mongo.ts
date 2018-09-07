import { injectable } from "inversify";
import { MongoClient, Db, InsertWriteOpResult, FilterQuery, UpdateWriteOpResult, DeleteWriteOpResultObject } from "mongodb";

@injectable()
export class Mongo {

    private readonly url: string = 'mongodb://log2990-01:log2990-01@ds149672.mlab.com:49672/log2990-01';
    private readonly dbName: string = 'log2990-01';
    private client: MongoClient;
    private db: Db;

    public constructor() {
    }

    private async connect(): Promise<void> {
        this.client = await MongoClient.connect(this.url, { useNewUrlParser: true });
        this.db = this.client.db(this.dbName);
    }

    public async findDocuments<Type>(collectionName: string, query: { [key: string]: any } = {}): Promise<Type[]> {
        if (!this.client || !this.client.isConnected) {
            await this.connect();
        }

        const collection = this.db.collection(collectionName);
        return await collection.find<Type>(query).toArray();
    }

    public async insertDocuments<Type>(collectionName: string, docs: Type[]): Promise<InsertWriteOpResult> {
        if (!this.client || !this.client.isConnected) {
            await this.connect();
        }

        const collection = this.db.collection(collectionName);
        return await collection.insertMany(docs);
    }

    public async updateDocument<Type>(collectionName: string, update: Type, filter: FilterQuery<Type> = {}): Promise<UpdateWriteOpResult> {
        if (!this.client || !this.client.isConnected) {
            await this.connect();
        }

        const collection = this.db.collection(collectionName);
        return await collection.updateOne(filter, update);
    }

    public async  removeDocument<Type>(collectionName: string, filter: FilterQuery<Type> = {}): Promise<DeleteWriteOpResultObject> {
        if (!this.client || !this.client.isConnected) {
            await this.connect();
        }

        const collection = this.db.collection(collectionName);
        return await collection.deleteOne(filter);
    }
}
