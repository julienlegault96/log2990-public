import { NgModule, Injectable } from "@angular/core";
import { RouterModule, Routes, Router, NavigationStart, Event } from "@angular/router";

import { GameListComponent } from "./views/game-list/game-list.component";
import { AdminViewComponent } from "./views/admin/admin-view.component";
import { HomePageComponent } from "./views/home-page/home-page.component";
import { GameViewComponent } from "./views/game-view/game-view.component";
import { UserService } from "./services/user/user.service";
import { WaitingViewComponent } from "./views/waiting-view/waiting-view.component";
import { Routing } from "./routing";

const APP_ROUTES: Routes = [
    { path: Routing.Homepage, component: HomePageComponent },
    { path: Routing.Admin, component: AdminViewComponent },
    { path: Routing.GameList, component: GameListComponent },
    { path: `${Routing.Game}/:id/:matchId`, component: GameViewComponent },
    { path: `${Routing.Waiting}/:id`, component: WaitingViewComponent },
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
                if (event.url !== "/" + Routing.Homepage
                    && event.url !== "/" + Routing.Admin) {
                    if (!userService.loggedIn) {
                        router.navigate([Routing.Homepage]);
                    }
                }
            }
        });
    }

}
