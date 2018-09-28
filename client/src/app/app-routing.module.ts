import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { GameListComponent } from "./game/game-list-menu/game-list/game-list.component";
import { AdminViewComponent } from "./admin/admin-view/admin-view.component";
import { HomePageComponent } from "./home-page/home-page.component";
import { GameViewComponent } from "./game/game-view/game-view.component";

const routes: Routes = [
    { path: "game", component: GameViewComponent },
    { path: "index", component: HomePageComponent },
    { path: "listeJeux", component: GameListComponent },
    { path: "admin", component: AdminViewComponent },
    { path: "", redirectTo: "/index", pathMatch: "full" },
];

@NgModule({
    exports: [
        RouterModule
    ],
    imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule { }
