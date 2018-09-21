import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SoloGameComponent } from "./game/solo-game/solo-game.component";
import { UserComponent } from "./User/user-component/user.component";
import { GameListComponent } from "./game-list-menu/game-list/game-list.component";

const routes: Routes = [
    { path: "soloGame", component: SoloGameComponent },
    { path: "index", component: UserComponent },
    { path: "listeJeux", component: GameListComponent },
    { path: "", redirectTo: "/index", pathMatch: "full" },
];

@NgModule({
    exports: [
        RouterModule
    ],
    imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule { }
