import { Component, OnInit } from "@angular/core";

import { GameService } from "../../services/game.service";

@Component({
    selector: "app-create-multiple-view",
    templateUrl: "./create-multiple-view.component.html",
})

export class CreateMultipleViewComponent implements OnInit {

    public constructor(private gameService: GameService) {

    }

    public ngOnInit(): void {
    }

    public generateMultipleViewImages(): void {
        this.gameService.generateMultipleView().subscribe((paths: String[]) => {
            console.log(paths[0]);
        });
  }

}
