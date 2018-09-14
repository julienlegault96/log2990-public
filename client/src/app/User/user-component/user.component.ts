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

  public constructor(private userService: UserService) { }

  public ngOnInit(): void {
  }

  public validateUsername(): boolean  {
     return this.userService.validateUsername(this.currentUser.name);
  }

}
