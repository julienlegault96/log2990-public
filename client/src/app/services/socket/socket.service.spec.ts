import { TestBed, inject } from "@angular/core/testing";

import { SocketService } from "./socket.service";

import { SocketEvents } from "../../../../../common/communication/socket-requests";

describe("SocketService", () => {
    // setting  up fixtures
    let socketService: SocketService;

    beforeEach(() => {
        socketService = new SocketService();

        TestBed.configureTestingModule({
            providers: [SocketService]
        });
    });

    it("should be created", inject([SocketService], (service: SocketService) => {
        expect(service).toBeTruthy();
    }));

    it("should reach a real socket when registering functions", () => {
        // setup spy
        spyOn(socketService, "registerFunction").and.callFake(
            (socket: SocketIO.Socket) =>  { expect(socket).toBeTruthy(); }
            );

        // call spy
        socketService.registerFunction(SocketEvents.Message, () => { });

        // check that spy really did get called
        expect(socketService.registerFunction).toHaveBeenCalledTimes(1);
    });
});
