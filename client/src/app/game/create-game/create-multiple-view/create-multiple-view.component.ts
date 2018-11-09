import { Component } from "@angular/core";

import { GenMultiParameters } from "../../../../../../common/communication/gen-multi-parameters";
import { GameService } from "../../../services/game.service";
import { CreateGameComponent } from "../create-game.component";
import { CreateGameService } from "src/app/services/create-game.service";

@Component({
    selector: "app-create-multiple-view",
    templateUrl: "./create-multiple-view.component.html",
})

export class CreateMultipleViewComponent extends CreateGameComponent {

    public gameType: "geo" | "theme" = "geo";
    public objectNumber: number = 15;
    public add: boolean = false;
    public remove: boolean = false;
    public color: boolean = false;

    public constructor(private gameService: GameService, createGameService: CreateGameService) {
        super(createGameService);
    }

    public submit(): void {
        if (!this.createGameService.validator.isStandardStringLength(this.name)) {
            alert("Erreur(s) dans le formulaire");

            return;
        }

        this.gameService.generateMultipleView().subscribe();
    }

    public onRangeChange(event: Event): void {
        const target: HTMLInputElement | null = event.target as HTMLInputElement;
        if (target) {
            this.objectNumber = Number(target.value);
        }
    }
}
