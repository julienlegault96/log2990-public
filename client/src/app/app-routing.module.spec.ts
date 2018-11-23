import { AppRoutingModule } from "./app-routing.module";
import { UserService } from "./services/user/user.service";
import { HttpClient } from "@angular/common/http";
import { SocketService } from "./services/socket/socket.service";
import { RouterModule } from "@angular/router";

describe("AppRoutingModule", () => {
    let appRoutingModule: AppRoutingModule;

    beforeEach(() => {
        const userService: UserService = new UserService(new HttpClient(), new SocketService());
        appRoutingModule = new AppRoutingModule(userService, new RouterModule());
    });

    it("should create an instance", () => {
        expect(appRoutingModule).toBeTruthy();
    });
});
