import { Component, OnInit } from "@angular/core";
import { User } from "../user";
import { UserService } from "../user.service";

@Component({
  selector: "app-user-component",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"]
})
export class UserComponent implements OnInit {
  public currentUser: User = {
    name : "MrBidon"
  };

  public users: User[];

  public constructor(private userService: UserService) { }

  public ngOnInit(): void {
    this.userService.getUsernames().subscribe((incommingUsers: User[]) => (this.users = incommingUsers));
  }

  public validateUsername(): boolean  {
     return this.userService.validateUsername(this.currentUser.name);
  }

}
