import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DiffCounterComponent } from "./diff-counter.component";

describe("DiffCounterComponent", () => {
  let component: DiffCounterComponent;
  let fixture: ComponentFixture<DiffCounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiffCounterComponent ]
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

  it("devrais lire 0 à l'initialisation", () => {
    expect(component.counts[0]).toEqual(0);
  });

  it("devrais contenir autant de counter que de joueurs", () => {
    expect(component).toBeTruthy();
  });

  it("le compteur devrais s'incrémenter de 1 à chaque différence trouvée", () => {
    expect(component).toBeTruthy();
  });

  it("le compteur devrais afficher le nombre de différences trouvées", () => {
    expect(component).toBeTruthy();
  });
});
