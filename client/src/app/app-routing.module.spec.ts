import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { AppRoutingModule } from "./app-routing.module";
import { UserService } from "./services/user/user.service";

describe("AppRoutingModule", () => {
    let appRoutingModule: AppRoutingModule;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppRoutingModule
            ],
            providers: [
                UserService,
                RouterTestingModule,
            ],
            imports: [
            ]
        });
        appRoutingModule = TestBed;
    });

    it("should create an instance", () => {
        expect(appRoutingModule).toBeTruthy();
    });
});
