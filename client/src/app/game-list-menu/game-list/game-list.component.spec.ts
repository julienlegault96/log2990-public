import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';

import { GameListComponent } from './game-list.component';
import { GameCardComponent } from '../game-card/game-card.component';
import { LeaderboardComponent } from '../leaderboard/leaderboard.component';
import { GameService } from '../game.service';
import { HttpClientModule } from '@angular/common/http';
import { Game } from '../../../../../common/game/game';
import { TestHelper } from '../../../test.helper';

describe('GamesComponent', () => {
    let component: GameListComponent;
    let fixture: ComponentFixture<GameListComponent>;
    // tslint:disable-next-line:no-any Used to mock the http call
    let httpClientSpy: any;
    let gameService: GameService;


    beforeEach(() => {

        httpClientSpy = jasmine.createSpyObj("HttpClient", ["get"]);
        gameService = new GameService(httpClientSpy);

        TestBed.configureTestingModule({
            declarations: [
                GameListComponent,
                GameCardComponent,
                LeaderboardComponent,
            ],
            providers: [{ provide: GameService, useValue: gameService }],
            imports: [HttpClientModule]
        });

        fixture = TestBed.createComponent(GameListComponent);
        component = fixture.componentInstance;
    });

    it('should filter', fakeAsync(() => {
        const expectedGames: Game[] = [
            {
                "type": 1,
                "title": "DoubleViewGame 1",
                "imageUrl": ["https://www.techworm.net/wp-content/uploads/2018/03/google-is-shutting-down-URL-shortner-service-Goo.gl_.png"],
                "leaderboards": [
                    {
                        "title": "Solo",
                        "times": [54, 66, 89]
                    },
                    {
                        "title": "One versus One",
                        "times": [33, 144, 200]
                    }
                ]
            }
        ];

        httpClientSpy.get.and.returnValue(TestHelper.asyncData(expectedGames));
        fixture.detectChanges(); //force onInit()

        tick(); // flush the component's setTimeout()
 
        fixture.detectChanges(); // update errorMessage within setTimeout()
        
        expect(component.doubleViewGames.length).toEqual(1);

    }));
});
