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
    if (value !== this._readonly) {
      this._readonly = value;
      if (value === true) {
        this.el.nativeElement.setAttribute('readonly', 'readonly');
        this.el.nativeElement.setAttribute('disabled', 'true');
        this.el.nativeElement.blur();
      }
      else {
        this.el.nativeElement.removeAttribute('readonly');
        this.el.nativeElement.removeAttribute('disabled');
      }
    }
  }

  get readonly(): boolean {
    return this._readonly;
  }
}
