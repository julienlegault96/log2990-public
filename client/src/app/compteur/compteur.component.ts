import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-compteur',
  templateUrl: './compteur.component.html',
  styleUrls: ['./compteur.component.css']
})
export class CompteurComponent implements OnInit {

  constructor() { }

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

  ngOnInit() {

  }

}
