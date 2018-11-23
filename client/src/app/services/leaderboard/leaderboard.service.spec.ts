import { TestBed, inject } from "@angular/core/testing";
import { HttpClientModule, HttpClient } from "@angular/common/http";

import { LeaderboardService } from "./leaderboard.service";

describe("LeaderboardService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [LeaderboardService, HttpClient],
            imports: [HttpClientModule]
        });
    });

    it("should be created", inject([LeaderboardService], (service: LeaderboardService) => {
        expect(service).toBeTruthy();
    }));
});
