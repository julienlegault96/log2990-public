import { Directive, ElementRef, HostListener, Input } from "@angular/core";

@Directive({
  selector: "[appGameError]"
})
export class GameErrorDirective {
  public numberOfClicks: number = 0;  // for debug
  @Input() public x: number;
  @Input() public y: number;

  public constructor(private element: ElementRef) {
    this.setErrorPosition(this.x, this.y);

   }

  private setErrorPosition(x: number, y: number): void {
     this.element.nativeElement.style.position = "absolute";
     this.element.nativeElement.top = x + "px";
     this.element.nativeElement.left = y + "px";

   }

  @HostListener("click", ["$event.target"])
  public onClick() {
    this.setErrorPosition(this.x, this.y);
    // tslint:disable-next-line:no-console
    console.log("button",  "number of clicks:", this.numberOfClicks++);
 }

}
