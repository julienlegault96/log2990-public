import { NgModule, Injectable } from "@angular/core";
import { RouterModule, Routes, Router } from "@angular/router";

import { GameListComponent } from "./views/game-list/game-list.component";
import { AdminViewComponent } from "./views/admin/admin-view.component";
import { HomePageComponent } from "./views/home-page/home-page.component";
import { GameViewComponent } from "./views/game-view/game-view.component";
import { UserService } from "./services/user/user.service";
import { WaitingViewComponent } from "./views/waiting-view/waiting-view.component";

const APP_ROUTES: Routes = [
    { path: "", component: HomePageComponent },
    { path: "admin", component: AdminViewComponent },
    { path: "gameList", component: GameListComponent },
    { path: "game/:id", component: GameViewComponent },
    { path: "waiting", component: WaitingViewComponent },
];

@NgModule({
    exports: [
        RouterModule
    ],
    imports: [RouterModule.forRoot(APP_ROUTES)],
})

@Injectable()
export class AppRoutingModule {

    public constructor(
        userService: UserService,
        router: Router,
    ) {
        if (!userService.loggedIn
            && router.url !== "/" + APP_ROUTES[0].path
            && router.url !== "/" + APP_ROUTES[1].path) {
            router.navigate([APP_ROUTES[0].path]);
        }
    }

}
