import { Game } from "../game/game";
import { GenMultiParameters } from "../communication/gen-multi-parameters";

export interface GameCreationRequest {
    newGame: Game;
    options?: GenMultiParameters;
}
