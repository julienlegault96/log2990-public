import { Component } from "@angular/core";

import { GenMultiParameters } from "../../../../../../../common/communication/gen-multi-parameters";
import { CreateGameComponent } from "../create-game.component";
import { CreateGameService } from "src/app/services/create-game/create-game.service";

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

    public constructor(createGameService: CreateGameService) {
        super(createGameService);
    }

    public submit(): void {
        if (!this.createGameService.validator.isStandardStringLength(this.name)
            || !this.hasValidGeneratorOptions()) {
            alert("Erreur(s) dans le formulaire");

            return;
        }

        const options: GenMultiParameters = {
            type: this.gameType,
            quantity: this.objectNumber,
            modifications: {
                add: this.add,
                delete: this.remove,
                color: this.color
            }
        };

        this.createGameService.submitMultiple(this.name, options);
    }

    public onRangeChange(event: Event): void {
        const target: HTMLInputElement | null = event.target as HTMLInputElement;
        if (target) {
            this.objectNumber = Number(target.value);
        }
    }

    private hasValidGeneratorOptions(): boolean {
        return (this.add || this.remove || this.color);
    }

}
