import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from ".//app-routing.module";
import { GameListComponent } from "./game/game-list-menu/game-list/game-list.component";
import { GameCardComponent } from "./game/game-list-menu/game-card/game-card.component";
import { LeaderboardComponent } from "./game/game-list-menu/leaderboard/leaderboard.component";
import { SoloGameComponent } from "./game/solo-game/solo-game.component";
import { ChronoComponent } from "./game/chrono/chrono.component";
import { FormsModule } from "@angular/forms";
import { UserComponent } from "./User/user-component/user.component";
import { CreateGameComponent } from "./game/create-game/create-game.component";
import { GameService } from "./services/game.service";
import { CreateGameService } from "./services/create-game.service";
import { AdminViewComponent, AdminViewCardComponent} from "./admin/admin-view/admin-view.component";

@NgModule({
    declarations: [
        AppComponent,
        GameListComponent,
        GameCardComponent,
        LeaderboardComponent,
        SoloGameComponent,
        ChronoComponent,
        UserComponent,
        AdminViewComponent,
        AdminViewCardComponent,
		CreateGameComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        FormsModule
    ],
    providers: [
        GameService,
        CreateGameService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
