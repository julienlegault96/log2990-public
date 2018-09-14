import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chrono',
  templateUrl: './chrono.component.html',
  styleUrls: ['./chrono.component.css']
})

export class ChronoComponent implements OnInit {
  readonly MINUTES_IN_HOUR: number = 60;
  public time: number;
  private startTime: Date;
  private endTime: Date;
  public printedTime: String;
  private timer: number;
  private verrouTimer: boolean;
  constructor() {
    this.time = 0;
    this.printedTime = "00:00";
    this.verrouTimer = false;
  }
  start(): void {
    if(!this.verrouTimer){
      this.startTime = new Date();
      this.timer = window.setInterval(() => {
        this.calculate();
      }, 1);
      this.verrouTimer = true;
    }
  }

  private calculate(): void {
    this.endTime = new Date();
    let diff: Date;
    let timeElapsed: number;
    timeElapsed = this.endTime.getTime() - this.startTime.getTime();
    diff = new Date(timeElapsed);
    diff.setHours(diff.getHours());
    let minutes: number;
    let seconds: number;
    seconds = diff.getSeconds();
    minutes = diff.getMinutes() + (diff.getUTCHours() * this.MINUTES_IN_HOUR);

    this.printedTime = "";
    this.printedTime += minutes < 10 ? '0' + minutes + ":" : minutes + ":";
    this.printedTime += seconds < 10 ? '0' + seconds : '' + seconds;
  }

  stop() {
    if(this.verrouTimer){
      clearInterval(this.timer);
      this.verrouTimer = false;
    }
  }

  ngOnInit() {
  }

}
