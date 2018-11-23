import { NgModule, Injectable } from "@angular/core";
import { RouterModule, Routes, Router } from "@angular/router";

import { GameListComponent } from "./views/game-list/game-list.component";
import { AdminViewComponent } from "./views/admin/admin-view.component";
import { HomePageComponent } from "./views/home-page/home-page.component";
import { GameViewComponent } from "./views/game-view/game-view.component";
import { UserService } from "./services/user/user.service";
import { WaitingViewComponent } from "./views/waiting-view/waiting-view.component";

const routes: Routes = [
    { path: "", component: HomePageComponent },
    { path: "gameList", component: GameListComponent },
    { path: "game/:id", component: GameViewComponent },
    { path: "admin", component: AdminViewComponent },
    { path: "waiting" , component : WaitingViewComponent }
];

@NgModule({
    exports: [
        RouterModule
    ],
    imports: [RouterModule.forRoot(routes)],
})

@Injectable()
export class AppRoutingModule {

    public constructor(
        userService: UserService,
        router: Router,
    ) {
        if (!userService.loggedIn) {
            router.navigate([""]);
        }
    }

}
