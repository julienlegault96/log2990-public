import { Component, OnInit } from "@angular/core";
import { user } from "../user";

@Component({
  selector: "app-user-component",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"]
})
export class UserComponent implements OnInit {
  public mockUser: user = {
    name : "mr.bidon"
  }

  public constructor() { }

  public ngOnInit(): void {
  }

}
