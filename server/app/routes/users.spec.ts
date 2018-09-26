import { expect } from "chai";
import { User } from "../../../common/user/user";
import { USERS } from "../../../common/user/mock-users";
import { Users } from "./users";
import { Mongo } from "../services/mongo";
import { InsertOneWriteOpResult, DeleteWriteOpResultObject } from "mongodb";

describe("Users db services", () => {
    // set up fixtures
    const users: Users = new Users(new Mongo());
    /*
    // dummy test to purge the DB, actually works tho
    it("should delete all users", async () => {
        let getResponse: User[] = await users.findUsers();
        for (const iterator of getResponse) {
            users.removeUser(iterator);
        }

        getResponse = await users.findUsers();
        expect(getResponse.length).to.equal(0);
    });
    */

    it("should create mock user", async () => {
        // insert
        const insResponse: InsertOneWriteOpResult = await users.insertUser(USERS[0]);

        expect(insResponse.insertedCount).to.equal(1);
    });

    it("shouldn't create mock user a second time", async () => {
        // insert
        try{
            await users.insertUser(USERS[0]);
        } catch (err) {
            expect(String(err).includes("duplicate key error")).to.equal(true);
        }
    });

    it("should fetch mock user", async () => {
        // get
        const getResponse: User[] = await users.findUsers();

        expect(getResponse.length).to.equal(1);
        expect(getResponse[0]._id).to.equal(USERS[0]._id);
    });

    it("should delete mock user", async () => {
        // delete
        const delResponse: DeleteWriteOpResultObject = await users.removeUser(USERS[0]);

        expect(Number(delResponse.deletedCount)).to.equal(1);
    });

});
