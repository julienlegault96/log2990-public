import { Component } from "@angular/core";

@Component({
    selector: "app-message-bar",
    templateUrl: "./message-bar.component.html",
    styleUrls: ["./message-bar.component.css"]
})
export class MessageBarComponent {
    public messages: string[] = [];

    public addMessage(message: string): void {
        this.messages.push(message);
    }
}
