import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesComponent } from './games.component';
import { GameComponent } from '../game/game.component';
import { LeaderboardComponent } from '../leaderboard/leaderboard.component';

describe('GamesComponent', () => {
    let component: GamesComponent;
    let fixture: ComponentFixture<GamesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                GamesComponent,
                GameComponent,
                LeaderboardComponent
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GamesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
