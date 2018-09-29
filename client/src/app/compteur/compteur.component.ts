import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-compteur',
  templateUrl: './compteur.component.html',
  styleUrls: ['./compteur.component.css']
})
export class CompteurComponent implements OnInit {

  public constructor() { }

  private readonly MAXDIF: number = 7;
  private readonly MAXBASE: number = 100;
  private difFound: number = 0;
  public percentageFound: number;

  public getDif(): number {

      return this.difFound;
    }

  public setDif(): void {
      this.difFound = 0;
    }

  public decrementDif(): void {
      this.difFound--;
    }

  public incrementDif(): void {
    this.difFound++;
    this.percentageFound = this.difFound * this.MAXBASE / this.MAXDIF ;
    this.percentageFound = parseFloat(this.percentageFound.toFixed(0));
}

  public ngOnInit() {

  }

}
