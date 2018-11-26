import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: "app-waiting-view",
    templateUrl: "./waiting-view.component.html"
})

export class WaitingViewComponent {

    public constructor(
        private router: Router
    ) {}

    public cancelGameCreation(): void {
        this.router.navigate(["/", "gameList"]);
    }

}
