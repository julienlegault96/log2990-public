import { CreateGameService } from "../../services/create-game.service";

export abstract class CreateGameComponent {

    public name: string;

    public constructor(protected createGameService: CreateGameService) {
        this.name = "";
    }

    public abstract submit(): void;

    public isValidName(event: Event): boolean {
        // empty names should be valid
        return this.name.length === 0
            || this.createGameService.validator.isStandardStringLength(this.name);
    }

}
