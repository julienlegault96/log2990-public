import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DiffCounterComponent } from "./diff-counter.component";

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
        component.playerOneId = "playerOneId";
        expect(component.counters[0]).toEqual(0);
    });

    it("devrais contenir autant de counter que de joueurs", () => {
        component.playerOneId = "playerOneId";
        component.playerTwoId = "playerTwoId";
        fixture.detectChanges();

        const arrayLength: number = 2;
        expect(component.counters.length).toEqual(arrayLength);
    });

    it("devrais lire 0 à l'initialisation pour deux joueur", () => {
        component.playerOneId = "playerOneId";
        component.playerTwoId = "playerTwoId";
        fixture.detectChanges();

        expect(component.counters[0]).toEqual(0);
        expect(component.counters[1]).toEqual(0);
    });

    it("le compteur devrais s'incrémenter de 1 à chaque différence trouvée", () => {
        component.playerOneId = "playerOneId";
        component.diffFound("playerOneId");
        expect(component.counters[0]).toBe(1);
    });

});
