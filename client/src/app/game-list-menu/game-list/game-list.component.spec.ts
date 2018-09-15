import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { TestHelper } from '../../../test.helper';
import { GameListComponent } from './game-list.component';
import { GameCardComponent } from '../game-card/game-card.component';
import { LeaderboardComponent } from '../leaderboard/leaderboard.component';
import { GameService } from '../game.service';

import { Game } from '../../../../../common/game/game';
import { GameType } from '../../../../../common/game/game-type';

describe('GameListComponent', () => {
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

    it('should filter games', fakeAsync(() => {
        const returnedGames: Game[] = [
            {
                type: GameType.DoubleView,
                title: "DoubleViewGame 1",
                imageUrl: ["double-view-game-1.bmp"],
                leaderboards: [
                    {
                        title: "Solo",
                        times: [54, 66, 89]
                    },
                    {
                        title: "One versus One",
                        times: [33, 144, 200]
                    }
                ]
            },
            {
                type: GameType.DoubleView,
                title: "DoubleViewGame 2",
                imageUrl: ["double-view-game-2.bmp"],
                leaderboards: [
                    {
                        title: "Solo",
                        times: [54, 66, 89]
                    },
                    {
                        title: "One versus One",
                        times: [33, 144, 200]
                    }
                ]
            },
            {
                type: GameType.SingleView,
                title: "SingleViewGame 1",
                imageUrl: ["single-view-game-1.bmp"],
                leaderboards: [
                    {
                        title: "Solo",
                        times: [54, 66, 89]
                    },
                    {
                        title: "One versus One",
                        times: [33, 144, 200]
                    }
                ]
            }
        ];

        httpClientSpy.get.and.returnValue(TestHelper.asyncData(returnedGames));
        fixture.detectChanges(); // force onInit()

        tick(); // flush the component's setTimeout()

        fixture.detectChanges(); // update errorMessage within setTimeout()

        expect(component.singleViewGames.length).toEqual(1);
        for (let i = 0; i < component.singleViewGames.length; i++) {
            expect(component.singleViewGames[0].type).toEqual(GameType.SingleView);
        }

        expect(component.doubleViewGames.length).toEqual(2);
        for (let i = 0; i < component.doubleViewGames.length; i++) {
            expect(component.doubleViewGames[0].type).toEqual(GameType.DoubleView);
        }

    }));
});
