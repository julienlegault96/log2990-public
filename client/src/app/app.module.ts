import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { BasicService } from "./basic.service";
import { HttpClientModule } from "@angular/common/http";
import { GamesComponent } from './game-list/games/games.component';
import { GameComponent } from './game-list/game/game.component';
import { LeaderboardComponent } from './game-list/leaderboard/leaderboard.component';

@NgModule({
  declarations: [
    AppComponent,
    GamesComponent,
    GameComponent,
    LeaderboardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
  ],
  providers: [BasicService],
  bootstrap: [AppComponent]
})
export class AppModule { }
