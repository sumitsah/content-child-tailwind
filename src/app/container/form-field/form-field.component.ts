import { CommonModule } from '@angular/common';
import { Component, ContentChild, Input } from '@angular/core';
import { NgControl, ReactiveFormsModule } from '@angular/forms'

@Component({
  selector: 'app-form-field',
  imports: [CommonModule],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.css'
})
export class FormFieldComponent {
  @Input() label!: string;

  // 💡 THE QUERY: Search for ANY Angular form control directive (like formControlName or ngModel)
  // We set { static: false } because validation states change dynamically as the user types
  @ContentChild(NgControl) controlDir!: NgControl;

  isInvalid(): boolean {
    // If the control exists, check if it's invalid and has been touched or modified
    return !!(
      this.controlDir &&
      this.controlDir.invalid &&
      (this.controlDir.dirty || this.controlDir.touched)
    );
  }
}
