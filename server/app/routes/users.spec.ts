import { expect } from "chai";
import { User } from "../../../common/user/user";
import { USERS } from "../../../common/user/mock-users";
import { Users } from "./users";
import { Mongo } from "../services/mongo";
import { InsertOneWriteOpResult, DeleteWriteOpResultObject } from "mongodb";

describe("Users db services", () => {
    // set up fixtures
    const users: Users = new Users(Mongo.prototype);

    it("should create mock user", async () => {
        // insert
        const insResponse: InsertOneWriteOpResult = await users.insertUser(USERS[0]);

        expect(insResponse.insertedCount).to.equal(1);
        expect(insResponse.insertedId).to.equal(USERS[0]);
    });

    it("should fetch mock user", async () => {
        // get
        const getResponse: User[] = await users.fetchUsers();

        expect(getResponse.length).to.equal(1);
        expect(getResponse[0]).to.equal(USERS[0]);
    });

    it("should delete mock user", async () => {
        // delete
        const delResponse: DeleteWriteOpResultObject = await users.deleteUser(USERS[0]);

        expect(Number(delResponse.deletedCount)).to.equal(1);
    });

});
