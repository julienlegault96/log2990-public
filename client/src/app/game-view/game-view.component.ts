import { Component, OnInit } from "@angular/core";

@Component({
    selector: "app-game-view",
    templateUrl: "./game-view.component.html",
    styleUrls: ["./game-view.component.css"]
})
export class GameViewComponent implements OnInit {

    public constructor() { }

    public ngOnInit(): void {
    }

}
export class Compteur {

private imageDiff: number = 0;

public incrementDiff(): void {
  this.imageDiff++;
}

public getImageDiff(): number {

  return this.imageDiff;
}

public setDiff(): void {
    this.imageDiff = 0;
}

public decrementDiff(): void {
    this.imageDiff--;
}

}