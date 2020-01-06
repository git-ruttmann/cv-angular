import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appReadonly]'
})
export class ReadonlyDirective {

  private _readonly : boolean = false;

  constructor(private el: ElementRef) {
  }

  @Input('appReadonly')
  set readonly(value: boolean) {
    console.log("set readonly from " + this._readonly + " to " + value);
    if (value !== this._readonly) {
      console.log("change readonly from " + this._readonly + " to " + value);
      this._readonly = value;
      if (value === true) {
        console.log("make readonly");
        this.el.nativeElement.setAttribute('readonly', 'readonly');
        this.el.nativeElement.setAttribute('disabled', 'true');
        this.el.nativeElement.blur();
      }
      else {
        console.log("remove readonly");
        this.el.nativeElement.removeAttribute('readonly');
        this.el.nativeElement.removeAttribute('disabled');
      }
    }
  }

  get readonly(): boolean {
    return this._readonly;
  }
}
