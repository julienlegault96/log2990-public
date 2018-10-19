import { Component, ViewChild, Input, EventEmitter, Output } from "@angular/core";
import { DiffCounterComponent } from "../diff-counter/diff-counter.component";
import { Game } from "../../../../../../common/game/game";

@Component({
    selector: "app-solo-game",
    templateUrl: "./solo-game.component.html",
    styleUrls: ["./solo-game.component.css"]
})

export class SoloGameComponent {
    @ViewChild(DiffCounterComponent) public diffCounter: DiffCounterComponent;

    @Input() public playerId: string;
    @Input() public game: Game;
    @Output() public errorFound: EventEmitter<string> = new EventEmitter<string>();
}
