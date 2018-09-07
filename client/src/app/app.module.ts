import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";

import { AppRoutingModule } from ".//app-routing.module";
import { GameListComponent } from "./game-list-menu/game-list/game-list.component";
import { GameCardComponent } from "./game-list-menu/game-card/game-card.component";
import { LeaderboardComponent } from "./game-list-menu/leaderboard/leaderboard.component";
import { SoloGameComponent } from "./game/solo-game/solo-game.component";
import { ChronoComponent } from "./game/chrono/chrono.component";
import { FormsModule } from "@angular/forms";
import { UserComponent } from "./User/user-component/user.component";
import { GestionaireUtilisateurComponent } from './utilisateur/gestionaire-utilisateur/gestionaire-utilisateur.component';

@NgModule({
    declarations: [
        AppComponent,
        GameListComponent,
        GameCardComponent,
        LeaderboardComponent,
        SoloGameComponent,
        ChronoComponent,
        UserComponent,
        GestionaireUtilisateurComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        FormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
