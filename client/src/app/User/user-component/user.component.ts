import { Component, OnInit } from "@angular/core";
import { User } from "../../../../../common/user/user";
import { UserService } from "../../services/user.service";

@Component({
    selector: "app-user-component",
    templateUrl: "./user.component.html",
    styleUrls: ["./user.component.css"]
})
export class UserComponent implements OnInit {
    public currentUser: User = {
        _id: "MrBidon"
    };

    public users: User[];

    public constructor(private userService: UserService) { }

    public ngOnInit(): void {
        this.getUsers();
    }

    public validateUsername(): boolean {
        return this.userService.validateUsername(this.currentUser._id);
    }

    private getUsers(): void {
        this.userService.getUsers().subscribe((newUsers: User[]) => { this.users = newUsers; });
        }

    public submit(): void {
        this.userService.submitUsername(this.currentUser._id);

        // update component
        this.currentUser._id = "";
        this.getUsers();
    }
}
