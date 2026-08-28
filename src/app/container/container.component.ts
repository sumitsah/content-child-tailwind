import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TabComponent } from './tab/tab.component';
import { TabsComponent } from './tabs/tabs.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { FormFieldComponent } from './form-field/form-field.component';
import { AccordionComponent } from "./accordion/accordion.component";

@Component({
  selector: 'app-container',
  imports: [TabComponent, TabsComponent, DropdownComponent, FormFieldComponent, ReactiveFormsModule, AccordionComponent],
  templateUrl: './container.component.html',
  styleUrl: './container.component.css'
})
export class ContainerComponent {

  authForm!: FormGroup;
  // open: boolean = false;

  ngOnInit() {
    this.authForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });

    // Forces validation messages to display instantly on load for troubleshooting
    // this.authForm.markAllAsTouched()
  }
  onSubmit() {

  }


}
