import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { GameListComponent } from "./game/game-list-menu/game-list/game-list.component";
import { AdminViewComponent } from "./admin/admin-view/admin-view.component";
import { HomePageComponent } from "./views/home-page/home-page.component";
import { GameViewComponent } from "./game/game-view/game-view.component";

const routes: Routes = [
    { path: "", component: HomePageComponent },
    { path: "gameList", component: GameListComponent },
    { path: "game/:id", component: GameViewComponent },
    { path: "admin", component: AdminViewComponent },
];

@NgModule({
    exports: [
        RouterModule
    ],
    imports: [RouterModule.forRoot(routes)],
})

export class AppRoutingModule { }
