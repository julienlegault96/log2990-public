import { TestBed, inject } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";

import { CreateGameService } from "./create-game.service";

describe("CreateGameService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                CreateGameService
            ],
            imports: [
                HttpClientModule
            ]
        });
    });

    it("should be created", inject([CreateGameService], (service: CreateGameService) => {
        expect(service).toBeTruthy();
    }));
});
