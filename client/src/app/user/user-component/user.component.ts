import { Component, OnInit } from "@angular/core";

import { UserService } from "../../services/user.service";

@Component({
    selector: "app-user-component",
    templateUrl: "./user.component.html",
})

/**
 * this component takes the inputed string and calls submitUsername with it
 */
export class UserComponent implements OnInit {

    private username: string;

    public constructor(private userService: UserService) { }

    public ngOnInit(): void {
        this.username = "someone";
    }

    public submit(): void {
        try {
            this.userService.submitUsername(this.username);
        } catch (error) {
            alert(error);
        }
    }

}
