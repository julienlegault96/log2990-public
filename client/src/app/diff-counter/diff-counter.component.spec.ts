import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DiffCounterComponent } from "./diff-counter.component";
import { catchError } from "rxjs/operators";

describe("DiffCounterComponent", () => {
    let component: DiffCounterComponent;
    let fixture: ComponentFixture<DiffCounterComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
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

    it("devrais lire 0 à l'initialisation pour un joueur", () => {
        component.setPlayerOne("playerOneId");

        expect(component.getPlayerCount("playerOneId")).toEqual(0);
    });

    it("devrais contenir autant de counter que de joueurs", () => {
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

    it("devrais lire 0 à l'initialisation pour deux joueur", () => {
        component.setPlayerOne("playerOneId");
        component.setPlayerTwo("playerTwoId");

        expect(component.getPlayerCount("playerOneId")).toEqual(0);
        expect(component.getPlayerCount("playerTwoId")).toEqual(0);
    });

    it("le compteur devrais s'incrémenter de 1 à chaque différence trouvée", () => {
        component.setPlayerOne("playerOneId");
        component.diffFound("playerOneId");

        expect(component.getPlayerCount("playerOneId")).toEqual(1);
    });

});
