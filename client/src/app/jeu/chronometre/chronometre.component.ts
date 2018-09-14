import { Component, OnInit } from '@angular/core';

@Component({
  selector: "app-chronometre",
  templateUrl: './chronometre.component.html',
  styleUrls: ['./chronometre.component.css']
})
export class ChronometreComponent implements OnInit {
  public temps: number;

  ngOnInit(): void {
  }
  public constructor() {
    this.temps = 0;

  }

  public commencer(): void {

  }

}
