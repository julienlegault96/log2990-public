import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
library.add(fas);

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { HomePageComponent } from "./views/home-page/home-page.component";

import { GameService } from "./services/game/game.service";
import { GameListComponent } from "./views/game-list/game-list.component";
import { GameCardComponent } from "./views/game-list/game-card/game-card.component";
import { LeaderboardComponent } from "./views/game-list/leaderboard/leaderboard.component";
import { SoloGameComponent } from "./views/game-view/solo-game/solo-game.component";
import { GameViewComponent } from "./views/game-view/game-view.component";
import { ChronoComponent } from "./views/game-view/chrono/chrono.component";
import { DiffCounterComponent } from "./views/game-view/diff-counter/diff-counter.component";
import { MessageBarComponent } from "./views/game-view/message-bar/message-bar.component";
import { MessageComponent } from "./views/game-view/message/message.component";

import { UserComponent } from "./views/home-page/user/user.component";

import { AdminViewComponent } from "./views/admin/admin-view.component";
import { AdminViewCardComponent } from "./views/admin/admin-view-card/admin-view-card.component";
import { CreateGameService } from "./services/create-game/create-game.service";

import { ImageDiffComponent } from "./views/game-view/image-diff/image-diff.component";
import { ImgDiffService } from "./services/img-diff/img-diff.service";

import { CreateSingleViewComponent } from "./views/admin/create-game/create-single-game/create-single-view.component";
import { CreateMultipleViewComponent } from "./views/admin/create-game/create-multiple-view/create-multiple-view.component";
import { LeaderboardService } from "./services/leaderboard/leaderboard.service";

@NgModule({
    declarations: [
        AppComponent,
        HomePageComponent,
        GameListComponent,
        GameCardComponent,
        LeaderboardComponent,
        SoloGameComponent,
        GameViewComponent,
        ChronoComponent,
        UserComponent,
        AdminViewComponent,
        AdminViewCardComponent,
        CreateSingleViewComponent,
        GameViewComponent,
        CreateMultipleViewComponent,
        HomePageComponent,
        MessageBarComponent,
        MessageComponent,
        DiffCounterComponent,
        ImageDiffComponent,
    ],
    imports: [
        AppRoutingModule,
        BrowserModule,
        HttpClientModule,
        FormsModule,
        FontAwesomeModule,
    ],
    providers: [
        GameService,
        CreateGameService,
        ImgDiffService,
        LeaderboardService,
    ],
    bootstrap: [
        AppComponent,
    ]
})
export class AppModule { }
