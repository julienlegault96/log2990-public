import { TestBed, inject } from "@angular/core/testing";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { TestHelper } from "../../../test.helper";

import { Endpoints } from "../abstract-server/abstract-server.service";
import { SocketService } from "../socket/socket.service";
import { UserService } from "./user.service";

import { USERS } from "../../../../../common/user/mock-users";
import { User } from "../../../../../common/user/user";
import { SocketEvents } from "../../../../../common/communication/sockets/socket-requests";
import { SocketMessage } from "../../../../../common/communication/sockets/socket-message";
import { SocketMessageType } from "../../../../../common/communication/sockets/socket-message-type";

let httpClientSpy: jasmine.SpyObj<HttpClient>;
let userService: UserService;
let socketServiceSpy: jasmine.SpyObj<SocketService>;
const socketListenersList: Function[] = [];

describe("UserService", () => {
    beforeEach(() => {
        // setup fake server responses
        httpClientSpy = jasmine.createSpyObj("HttpClient", ["get", "post", "delete"]);
        httpClientSpy.get.and.callFake(() => TestHelper.asyncData(USERS));
        httpClientSpy.post.and.callFake((endpoint: Endpoints, postedUser: User) => TestHelper.asyncData(null));
        httpClientSpy.delete.and.callFake( () => TestHelper.asyncData("delete done") );

        socketServiceSpy = jasmine.createSpyObj("SocketService", ["emit", "registerFunction"]);
        socketServiceSpy.registerFunction.and.callFake((requestType: SocketEvents, f: Function) => {
            socketListenersList.push(f);
        });

        // create tested object
        userService = new UserService(httpClientSpy, socketServiceSpy);

        TestBed.configureTestingModule({
            providers: [
                {provide: UserService, useValue: userService},
                {provide: SocketService, useValue: socketServiceSpy}
                ],
            imports: [HttpClientModule]
        });
    });

    it("should be created", inject([UserService], (service: UserService) => {
        expect(service).toBeTruthy();
        jasmine.getEnv().randomizeTests(true);
    }));

    it("should reject existing usernames", () => {
        // setup fixtures
        userService.userList = USERS;

        // test
        expect(userService.validateUsername(USERS[0]._id)).toBeFalsy();
    });

    it("should fetch the existing usernames", () => {
        // ignore calls done in constructor
        httpClientSpy.get.calls.reset();

        userService.getUsers().subscribe( (users: User[] ) => {
            expect(users).toEqual(jasmine.any(Array));
            expect(users).toEqual(USERS, "users check");
        });

        expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
    });

    it("should submit usernames", () => {
        userService.submitUsername(USERS[0]._id);

        // should have called login
        expect(httpClientSpy.post).toHaveBeenCalledTimes(1);
        expect(httpClientSpy.get).toHaveBeenCalledTimes(1);

        const expectedEmitCalls: number = 2;
        expect(socketServiceSpy.emit).toHaveBeenCalledTimes(expectedEmitCalls);
    });

    it("should delete the submited username", () => {
        userService.removeUser(USERS[0]);

        // check if only one call was made
        expect(httpClientSpy.delete).toHaveBeenCalledTimes(1);
    });

    it("should sync the connected users", () => {
        const MOCK_CONNECT: SocketMessage = {userId: USERS[0]._id, type: SocketMessageType.Connection};
        const MOCK_DISCONNECT: SocketMessage = {userId: USERS[0]._id, type: SocketMessageType.Disconnection};

        // setup fixtures
        userService.userList = [];

        // system under test
        socketListenersList.forEach((f: Function) => { f(MOCK_CONNECT); });
        expect(userService.userList.length).toEqual(1);
        expect(userService.userList[0]._id).toEqual(USERS[0]._id);

        socketListenersList.forEach((f: Function) => { f(MOCK_DISCONNECT); });
        expect(userService.userList.length).toEqual(0);
    });
});
