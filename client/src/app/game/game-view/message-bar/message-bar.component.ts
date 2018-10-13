import { Component, Input } from "@angular/core";

@Component({
    selector: "app-message-bar",
    templateUrl: "./message-bar.component.html",
    styleUrls: ["./message-bar.component.css"]
})
export class MessageBarComponent {
   @Input() public messages: string[] = [];

   public addMessage(message: string): void {
        this.messages.push(message);
    }
}
