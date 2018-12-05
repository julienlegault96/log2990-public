import { expect } from "chai";
import * as SocketIO from "socket.io";
import { Mongo } from "./services/mongo/mongo";
import { SocketManager } from "./socket.manager";
import { MessageSocket } from "./sockets/message/message.socket";
import { UserSocket } from "./sockets/user/user.socket";
import { USERS } from "../../common/user/mock-users";

describe("Socket Manager", () => {
    // set up fixtures
    const TEST_SOCKET_ID: string = "1";
    const manager: SocketManager = new SocketManager(new UserSocket(new Mongo()), new MessageSocket());
    const TEST_SOCKET: SocketIO.Socket = {id: TEST_SOCKET_ID} as SocketIO.Socket;
    const sockets: {[id: string]: boolean} = {};
    const TEST_ROOM: SocketIO.Room = {sockets: sockets, length: 1};

    it("should index & unindex new connections", () => {
        manager["indexConnection"](USERS[0]._id, TEST_SOCKET);
        expect(manager.connections[TEST_SOCKET_ID]).not.to.equal(undefined);
        manager["unindexConnection"](USERS[0]._id, TEST_SOCKET);
        expect(manager.connections[TEST_SOCKET_ID]).to.be.equal(undefined);
    });

    it("should extract latest socketid in a room", () => {
        expect(manager["extractLastSocketId"](TEST_ROOM)).to.equal(undefined);
        sockets[TEST_SOCKET_ID] = false;
        expect(manager["extractLastSocketId"](TEST_ROOM)).to.equal(TEST_SOCKET_ID);
        sockets[TEST_SOCKET_ID + TEST_SOCKET_ID] = true;
        expect(manager["extractLastSocketId"](TEST_ROOM)).to.equal(TEST_SOCKET_ID + TEST_SOCKET_ID);
    });
});
