import { Component, Input } from "@angular/core";

@Component({
    selector: "app-message-bar",
    templateUrl: "./message-bar.component.html",
})

export class MessageBarComponent {
   @Input() public messages: string[] = [];

   public addMessage(message: string): void {
        this.messages.push(message);
    }
}
