import { Component, ViewChild } from "@angular/core";
import { MessageBarComponent } from "./message-bar/message-bar.component";
import { ChronoComponent } from "./chrono/chrono.component";
import { SoloGameComponent } from "./solo-game/solo-game.component";

@Component({
    selector: "app-game-view",
    templateUrl: "./game-view.component.html",
    styleUrls: ["./game-view.component.css"]
})

export class GameViewComponent {
    @ViewChild(MessageBarComponent) messageBar: MessageBarComponent;
    @ViewChild(ChronoComponent) chrono: ChronoComponent;
    @ViewChild(SoloGameComponent) soloGame: SoloGameComponent;
}
