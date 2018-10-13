import { Component, OnInit, Input } from "@angular/core";

@Component({
    selector: "app-message",
    templateUrl: "./message.component.html",
    styleUrls: ["./message.component.css"]
})
export class MessageComponent implements OnInit {
    @Input() public message: string;
    public playerId: string = "1";

    public constructor() {
    }

    public ngOnInit(): void {
        this.message = "Joueur #" + this.playerId + " " + "nouvelle différence trouvée !";
    }
}
