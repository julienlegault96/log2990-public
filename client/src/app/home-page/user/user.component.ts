import { Component } from "@angular/core";

import { UserService } from "../../services/user.service";
import { Router } from "@angular/router";

@Component({
    selector: "app-user-component",
    templateUrl: "./user.component.html",
})

/**
 * this component takes the inputed string and calls submitUsername with it
 */
export class UserComponent {

    public errorMessages: Array<string>;
    private username: string;

    public constructor(private userService: UserService, private router: Router) {
        this.errorMessages = [""];
        this.username = "";
    }

    public submit(): void {
        try {
            this.userService.submitUsername(this.username);
            this.router.navigate(["/", "gameList"]);
        } catch (error) {
            this.errorMessages = error.message.split("\n");
        }
    }

}
