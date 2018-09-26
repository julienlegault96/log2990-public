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
        _id: ""
    };

    public users: User[];

    public constructor(private userService: UserService) { }

    public ngOnInit(): void {
        this.getUsers();
    }

    private getUsers(): void {
        this.userService.getUsers().subscribe((newUsers: User[]) => { this.users = newUsers; });
        }

    public submit(): void {
        const newUsername: string = this.currentUser._id;
        try {
            this.userService.submitUsername(newUsername);
        } catch (error) {
            alert(error);
        }

        // update component
        this.currentUser._id = "";
        this.getUsers();
    }
}
