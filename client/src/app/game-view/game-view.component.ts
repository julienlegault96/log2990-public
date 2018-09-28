import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.css']
})
export class GameViewComponent implements OnInit {

  constructor() { }

  ngOnInit() {

  }

}
export class Compteur {

private imageDiff: number = 0;

public incrementImageDiff(): void {
  this.imageDiff++;
}

public getImageDiff(): number {

  return this.imageDiff;
}

}
