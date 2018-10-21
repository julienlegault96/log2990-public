import { Component, OnInit } from "@angular/core";

import { CreateGameService } from "../../services/create-game.service";

@Component({
    selector: "app-create-multiple-view",
    templateUrl: "./create-multiple-view.component.html",
})

export class CreateMultipleViewComponent implements OnInit {

    public constructor(private createGameService: CreateGameService) {
        
    }

    public ngOnInit(): void {
    }

  public generateMultipleViewImages(): void {
    this.createGameService.generateMultipleView();
  }

}
