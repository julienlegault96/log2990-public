import { expect } from "chai";
import * as SocketIO from "socket.io";
import { Mongo } from "./services/mongo/mongo";
import { SocketManager } from "./socket.manager";
import { MessageSocket } from "./sockets/message/message.socket";
import { UserSocket } from "./sockets/user/user.socket";
import {USERS} from "../../common/user/mock-users";

describe("Socket Manager", () => {
    // set up fixtures
    const TEST_SOCKET_ID: string = "1";
    const socket: SocketIO.Socket = {id: TEST_SOCKET_ID} as SocketIO.Socket;
    const manager: SocketManager = new SocketManager(new UserSocket(new Mongo()), new MessageSocket());

    it("should index & unindex new connections", async () => {
        manager.indexConnection(USERS[0]._id, socket);
        expect(manager.connections[TEST_SOCKET_ID]).not.to.be.a("undefined");
        manager.unindexConnection(USERS[0]._id, socket);
        expect(manager.connections[TEST_SOCKET_ID]).to.be.a("undefined");
    });

});
