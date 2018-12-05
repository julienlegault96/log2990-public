import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SocketService } from "src/app/services/socket/socket.service";

import { DiffCounterComponent } from "./diff-counter.component";

describe("DiffCounterComponent", () => {
    let component: DiffCounterComponent;
    let fixture: ComponentFixture<DiffCounterComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                SocketService
            ],
            declarations: [DiffCounterComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DiffCounterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should read 0 on counter for 1 player", () => {
        component.setPlayerOne("playerOneId");

        expect(component.getPlayerCount("playerOneId")).toEqual(0);
    });

    it("should have right amount of counters", () => {
        component.setPlayerOne("playerOneId");

        expect(component.getPlayerCount("playerOneId")).toEqual(0);
        try {
            component.getPlayerCount("playerTwoId");
        } catch (e) {
            expect(e instanceof Error).toBeTruthy();
        }

        component.setPlayerTwo("playerTwoId");
        expect(component.getPlayerCount("playerTwoId")).toEqual(0);
    });

    it("should read read 0 on counters for 2 players", () => {
        component.setPlayerOne("playerOneId");
        component.setPlayerTwo("playerTwoId");

        expect(component.getPlayerCount("playerOneId")).toEqual(0);
        expect(component.getPlayerCount("playerTwoId")).toEqual(0);
    });

    it("should add 1 if a diff is found", () => {
        component.setPlayerOne("playerOneId");
        component.incrementPlayerCount("playerOneId");

        expect(component.getPlayerCount("playerOneId")).toEqual(1);
    });

});
