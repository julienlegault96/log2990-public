import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { GameListComponent } from "./game/game-list-menu/game-list/game-list.component";
import { AdminViewComponent } from "./admin/admin-view/admin-view.component";
import { HomePageComponent } from "./home-page/home-page.component";
import { GameViewComponent } from "./game/game-view/game-view.component";
import { ImageDiffComponent } from "./game/image-diff/image-diff.component";

const routes: Routes = [
    { path: "game/:id", component: GameViewComponent },
    { path: "index", component: HomePageComponent },
    { path: "listeJeux", component: GameListComponent },
    { path: "admin", component: AdminViewComponent },
    { path: "", redirectTo: "index", pathMatch: "full" },
    { path: "test", component: ImageDiffComponent},
];

@NgModule({
    exports: [
        RouterModule
    ],
    imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule { }
