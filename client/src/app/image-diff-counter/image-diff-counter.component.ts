import { Component, OnInit } from '@angular/core';

const MAXFOUND: number = 7;
const BASE: number = 100;
@Component({
  selector: "app-image-diff-counter",
  templateUrl: "./image-diff-counter.component.html",
  styleUrls: ["./image-diff-counter.component.css"]
})
export class ImageDiffCounterComponent implements OnInit {

    private imageDiff: number = 0;          // Number of images difference found.
    public progressBarWidth: number = 0;    // The progress bar width.

    public constructor() { }

    public getDif(): number {

        return this.imageDiff;
    }

    public setDif(): void {
        this.imageDiff = 0;
    }

    public decrementDif(): void {
        this.imageDiff--;
        this.progressBarWidth = this.imageDiff * BASE / MAXFOUND;
        this.progressBarWidth = parseFloat(this.progressBarWidth.toFixed(0));
    }

    public incrementDif(): void {

        if (this.progressBarWidth < BASE) {
            this.imageDiff++;
            this.progressBarWidth = this.imageDiff * BASE / MAXFOUND;
            this.progressBarWidth = parseFloat(this.progressBarWidth.toFixed(0));
        } else {
            this.progressBarWidth = BASE;
        }
    }

    public ngOnInit(): void {

    }

}
