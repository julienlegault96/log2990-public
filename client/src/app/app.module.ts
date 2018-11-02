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
import { HomePageComponent } from "./home-page/home-page.component";

import { GameService } from "./services/game.service";
import { GameListComponent } from "./game/game-list-menu/game-list/game-list.component";
import { GameCardComponent } from "./game/game-list-menu/game-card/game-card.component";
import { LeaderboardComponent } from "./game/game-list-menu/leaderboard/leaderboard.component";
import { SoloGameComponent } from "./game/game-view/solo-game/solo-game.component";
import { GameViewComponent } from "./game/game-view/game-view.component";
import { ChronoComponent } from "./game/game-view/chrono/chrono.component";
import { DiffCounterComponent } from "./game/game-view/diff-counter/diff-counter.component";
import { MessageBarComponent } from "./game/game-view/message-bar/message-bar.component";
import { MessageComponent } from "./game/game-view/message/message.component";

import { UserComponent } from "./user/user-component/user.component";

import { AdminViewComponent } from "./admin/admin-view/admin-view.component";
import { AdminViewCardComponent } from "./admin/admin-view-card/admin-view-card.component";

import { CreateGameService } from "./services/create-game.service";
import { CreateGameComponent } from "./game/create-game/create-game.component";
import { ImageDiffComponent } from "./game/game-view/image-diff/image-diff.component";
import { ImgDiffService } from "./services/img-diff.service";

import { CreateMultipleViewComponent } from "./game/create-multiple-view/create-multiple-view.component";

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
        CreateGameComponent,
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
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
