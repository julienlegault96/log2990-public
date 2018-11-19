import { Directive, ElementRef } from "@angular/core";

@Directive({
  selector: "[appSoloGame]"
})
export class SoloGameDirective {

  public constructor(private element: ElementRef) {
    this.setErrorPosition(100, 100);  // A remplacer par les coordonnées du clic.

   }

  private setErrorPosition(x: number, y: number): void {
     this.element.nativeElement.style.position = "absolute";
     this.element.nativeElement.bottom = x + "px";
     this.element.nativeElement.right = y + "px";

   }
}
