import { Component, OnInit } from "@angular/core";
import { UserService } from "../../services/user.service";

@Component({
    selector: "app-user-component",
    templateUrl: "./user.component.html",
    styleUrls: ["./user.component.css"]
})

/**
 * this component takes the inputed string and calls submitUsername with it
 */
export class UserComponent implements OnInit {
    public constructor(private userService: UserService) { }
    private username: string;

    public ngOnInit(): void {
        this.username = "";
    }

    public submit(): void {
        try {
            this.userService.submitUsername(this.username);
        } catch (error) {
            alert(error);
        }
    }
}
