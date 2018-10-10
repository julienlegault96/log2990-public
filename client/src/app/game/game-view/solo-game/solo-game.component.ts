import { Component, ViewChild, Input, EventEmitter, Output } from "@angular/core";
import { DiffCounterComponent } from "../diff-counter/diff-counter.component";

@Component({
    selector: "app-solo-game",
    templateUrl: "./solo-game.component.html"
})

export class SoloGameComponent {
    @ViewChild(DiffCounterComponent) diffCounter: DiffCounterComponent;

    @Output() errorFound = new EventEmitter<string>();

    // Used to pass down to diff counter
    @Input() private playerId: string;
}
