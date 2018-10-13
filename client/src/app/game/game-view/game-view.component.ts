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
    @ViewChild(MessageBarComponent) public messageBar: MessageBarComponent;
    @ViewChild(ChronoComponent) public chrono: ChronoComponent;
    @ViewChild(SoloGameComponent) public soloGame: SoloGameComponent;
    public playerId: string;

   /* public setPlayerId(id: string): string {
        return this.soloGame.setPlayerId(id);
    }*/

    public ngOnInit(): void {
        this.playerId = this.soloGame.setPlayerId("1");

     }
}
