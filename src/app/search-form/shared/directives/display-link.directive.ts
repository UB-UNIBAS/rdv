import {AfterContentInit, Directive, ElementRef, Input} from '@angular/core';

@Directive({
  selector: '[appDisplayLink]'
})
export class DisplayLinkDirective implements AfterContentInit {

  @Input() display: string;
  @Input() value: string;

  constructor(private el: ElementRef) {
  }

  ngAfterContentInit(): void {
    this.el.nativeElement.innerHTML = this.display === 'link' ?
      "<a href=" + this.value + ">" + this.value + " <i class='fa fa-external-link'></i></a>" :
      this.value;
  }


}
