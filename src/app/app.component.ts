import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

}


/* 
you need that two-level hierarchy, but it is easier to think of it as a relationship between
three distinct players: a Parent, a Wrapper (Child), and the Projected Elements

1. PARENT VIEW (e.g., ContainerComponent)
   │
   └─── 2. WRAPPER CONTAINER (Holds the @ContentChild code & <ng-content>)
         │
         └─── 3. PROJECTED PIECES (Passed down from the Parent)


  Why does it have to be this way?
  It comes down to ownership of the HTML tags:Who wrote the tag? 
    If a tag is written inside app.component.html, the ContainerComponent class owns that layout view.
  Who can query it? 
  A component can only use @ContentChild to inspect elements that it does not own natively, 
  but were handed down to it through its <ng-content> gateway.
*/

/* 
dropdown: This is a plain HTML attribute selector. It acts as a target identifier for the HTML layout engine.
[LEVEL 1] Parent Component  ──► ContainerComponent (owns the files/layout)
   │
[LEVEL 2] Wrapper Component ──► DropdownComponent (owns the @ContentChild & <ng-content>)
   │
[LEVEL 3] Projected Piece   ──► <button> or <img > (the targets being passed inside)


*/