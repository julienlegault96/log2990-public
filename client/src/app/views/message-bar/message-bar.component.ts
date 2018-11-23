import { Component, Injectable } from "@angular/core";
import { MessageService } from "src/app/services/message/message.service";

@Component({
    selector: "app-message-bar",
    templateUrl: "./message-bar.component.html",
    styleUrls: ["./message-bar.component.css"]
})

@Injectable()
export class MessageBarComponent {

    public constructor(public messageService: MessageService) {
    }

}
