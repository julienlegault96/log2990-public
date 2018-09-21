import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SoloGameComponent } from "./game/solo-game/solo-game.component";
import { GameListComponent } from "./game/game-list-menu/game-list/game-list.component";
import { HomePageComponent } from "./home-page/home-page.component";

const routes: Routes = [
    { path: "soloGame", component: SoloGameComponent },
    { path: "pageDAcceuil", component: HomePageComponent },
    { path: "listeJeux", component: GameListComponent },
    { path: "", redirectTo: "/pageDAcceuil", pathMatch: "full" },
];

@NgModule({
    exports: [
        RouterModule
    ],
    imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule { }
