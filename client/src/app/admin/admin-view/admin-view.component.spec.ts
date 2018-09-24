import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AdminViewComponent, AdminViewCardComponent  } from "./admin-view.component";
import { LeaderboardComponent} from "../../game/game-list-menu/leaderboard/leaderboard.component";
import {GameService} from "../../services/game.service";

describe("AdminViewComponent", () => {
  let component: AdminViewComponent;
  let fixture: ComponentFixture<AdminViewComponent>;
  let gameService: GameService;
  let httpClientSpy: any;
  beforeEach(async(() => {
    httpClientSpy = jasmine.createSpyObj("HttpClient", ["get"]);
    gameService = new GameService(httpClientSpy);
    TestBed.configureTestingModule({
      declarations: [ AdminViewComponent, AdminViewCardComponent, LeaderboardComponent ],
      providers: [{ provide: GameService, useValue: gameService }],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
