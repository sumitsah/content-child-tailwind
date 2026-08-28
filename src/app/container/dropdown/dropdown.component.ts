import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, ContentChild, ElementRef, inject, OnDestroy, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css'
})
export class DropdownComponent implements AfterContentInit, OnDestroy {
  private renderer = inject(Renderer2);
  isOpen = false;
  private clickListenerDestroyer?: () => void;

  // 💡 THE QUERY: Look for an element with the #dropdownTrigger reference variable
  @ContentChild('dropdownTrigger', { read: ElementRef }) triggerElement!: ElementRef;

  ngAfterContentInit() {
    // console.log(this.triggerElement)
    if (!this.triggerElement) {
      console.error('Error: app-dropdown requires a projected element with #dropdownTrigger!');
      return;
    }

    // Use Angular's Renderer2 to safely listen for a click event on the projected element
    this.clickListenerDestroyer = this.renderer.listen(
      this.triggerElement.nativeElement,
      'click',
      () => this.toggleMenu()
    );
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  ngOnDestroy() {
    // Always clean up native browser event listeners to avoid memory leaks
    if (this.clickListenerDestroyer) {
      this.clickListenerDestroyer();
    }
  }
}
