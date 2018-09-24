import { TestBed, ComponentFixture, fakeAsync, tick, async } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { AdminViewComponent, AdminViewCardComponent  } from "./admin-view.component";
import { LeaderboardComponent} from "../../game/game-list-menu/leaderboard/leaderboard.component";
import {GameService} from "../../services/game.service";
import { TestHelper } from "../../../test.helper";
import { Game } from "../../../../../common/game/game";
import { GameType } from "../../../../../common/game/game-type";
const returnedGames: Game[] = [
  {
      _id: 1,
      type: GameType.DoubleView,
      title: "DoubleViewGame 1",
      imageUrl: ["double-view-game-1.bmp"],
      leaderboards: [
          {
              title: "Solo",
              scores: [
                  {
                      username: "test",
                      time: 54
                  },
                  {
                      username: "test2",
                      time: 66
                  },
                  {
                      username: "test3",
                      time: 89
                  }
              ]
          },
          {
              title: "One versus One",
              scores: [
                  {
                      username: "test",
                      time: 33
                  },
                  {
                      username: "test2",
                      time: 14
                  },
                  {
                      username: "test3",
                      time: 24
                  }
              ]
          }
      ]
  },
  {
      _id: 2,
      type: GameType.DoubleView,
      title: "DoubleViewGame 2",
      imageUrl: ["double-view-game-2.bmp"],
      leaderboards: [
          {
              title: "Solo",
              scores: [
                  {
                      username: "test",
                      time: 54
                  },
                  {
                      username: "test2",
                      time: 66
                  },
                  {
                      username: "test3",
                      time: 89
                  }
              ]
          },
          {
              title: "One versus One",
              scores: [
                  {
                      username: "test",
                      time: 33
                  },
                  {
                      username: "test2",
                      time: 14
                  },
                  {
                      username: "test3",
                      time: 23
                  }
              ]
          }
      ]
  },
  {
      _id: 3,
      type: GameType.SingleView,
      title: "SingleViewGame 1",
      imageUrl: ["single-view-game-1.bmp"],
      leaderboards: [
          {
              title: "Solo",
              scores: [
                  {
                      username: "test",
                      time: 54
                  },
                  {
                      username: "test2",
                      time: 66
                  },
                  {
                      username: "test3",
                      time: 89
                  }]
          },
          {
              title: "One versus One",
              scores: [
                  {
                      username: "test",
                      time: 33
                  },
                  {
                      username: "test2",
                      time: 14
                  },
                  {
                      username: "test3",
                      time: 24
                  }
              ]
          }
      ]
  }
];
describe("AdminViewComponent", () => {
  let component: AdminViewComponent;
  let fixture: ComponentFixture<AdminViewComponent>;
  let gameService: GameService;
  // tslint:disable-next-line:no-any Used to mock the http call
  let httpClientSpy: any;
  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj("HttpClient", ["get"]);
    gameService = new GameService(httpClientSpy);

    TestBed.configureTestingModule({
        declarations: [
            AdminViewCardComponent,
            AdminViewComponent,
            LeaderboardComponent,
        ],
        providers: [{ provide: GameService, useValue: gameService }],
        imports: [HttpClientModule]
    });

    fixture = TestBed.createComponent(AdminViewComponent);
    component = fixture.componentInstance;
});

  it("should create", fakeAsync(() => {
    httpClientSpy.get.and.returnValue(TestHelper.asyncData(returnedGames));
    fixture.detectChanges(); // force onInit()

    tick(); // flush the component's setTimeout()

    fixture.detectChanges(); // update errorMessage within setTimeout()
    expect(component).toBeTruthy();
  });
});
