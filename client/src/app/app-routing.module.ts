import { NgModule, Injectable } from "@angular/core";
import { RouterModule, Routes, Router, NavigationStart, Event } from "@angular/router";

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
    { path: "game/:id/:matchId", component: GameViewComponent },
    { path: "waiting/:id", component: WaitingViewComponent },
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
        router.events.subscribe((event: Event) => {
            if (event instanceof NavigationStart) {
                if (event.url !== "/" + APP_ROUTES[0].path
                    && event.url !== "/" + APP_ROUTES[1].path) {
                    if (!userService.loggedIn) {
                        router.navigate([APP_ROUTES[0].path]);
                    }
                }
            }
        });
    }

}
