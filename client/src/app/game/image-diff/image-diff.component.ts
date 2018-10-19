import { Component, OnInit } from "@angular/core";

@Component({
    selector: "app-image-diff",
    templateUrl: "./image-diff.component.html",
    styleUrls: ["./image-diff.component.css"]
})

export class ImageDiffComponent implements OnInit {

    public constructor() { }

    public ngOnInit(): void {
    }

    public isClicked(event: MouseEvent): void {
        // https://stackoverflow.com/questions/3234256/find-mouse-position-relative-to-element
        // tslint:disable-next-line:no-any
        const target: any = event.target;
        if (target) {
            const rect: DOMRect = target.getBoundingClientRect();
            const x: number = event.clientX - rect.left;
            const y: number = event.clientY - rect.top;
            console.log(x, y);
        }
    }

}
