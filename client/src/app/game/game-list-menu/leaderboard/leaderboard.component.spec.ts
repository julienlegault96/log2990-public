import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { LeaderboardComponent } from "./leaderboard.component";
import { Leaderboard } from "../../../../../../common/game/leaderboard";

describe("LeaderboardComponent", () => {
    let component: LeaderboardComponent;
    let fixture: ComponentFixture<LeaderboardComponent>;
    const mockLeaderboard: Leaderboard = { title: "test-Leaderboard", scores: [] };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LeaderboardComponent],
            providers: [{ provide: Leaderboard, useValue: mockLeaderboard }]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LeaderboardComponent);
        component = fixture.componentInstance;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("leaderboard should change on input", () => {
        component.leaderboard = mockLeaderboard;
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector("h5").innerText).toEqual(mockLeaderboard.title);
    });
});
