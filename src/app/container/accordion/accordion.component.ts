import { AfterContentInit, Component, ContentChild, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-accordion',
  imports: [],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.css'
})
export class AccordionComponent implements AfterContentInit {
  @ContentChild('btnRef', { read: ElementRef<HTMLButtonElement> }) btnRef!: ElementRef<HTMLButtonElement>;
  isOpen: boolean = false;

  clickListenerDestroyer!: () => void;

  constructor(private renderer: Renderer2) {

  }
  ngAfterContentInit() {
    this.clickListenerDestroyer = this.renderer.listen(this.btnRef.nativeElement, 'click', () => this.toggelAccordion())
  }

  toggelAccordion() {
    this.isOpen = !this.isOpen
  }

  ngOnDestroy() {
    if (this.clickListenerDestroyer) {
      this.clickListenerDestroyer()
    }
  }


}
