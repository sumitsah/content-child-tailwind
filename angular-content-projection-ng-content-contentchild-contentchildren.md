# Angular Content Projection: `<ng-content>`, `@ContentChild()` & `@ContentChildren()`

## 1. What problem do these APIs solve?

Angular components have two important concepts:

- **View** — HTML defined inside the component's own template.
- **Content** — HTML passed into the component by its parent.

For example:

```html
<app-card>
  <h2>Course Details</h2>
  <p>This content comes from the parent.</p>
</app-card>
```

The `<h2>` and `<p>` are **content** of `app-card`.

Angular gives us three closely related tools:

| API | Purpose |
|---|---|
| `<ng-content>` | Decides **where projected content is rendered** |
| `@ContentChild()` | Gets the **first matching projected element/directive** |
| `@ContentChildren()` | Gets **multiple matching projected elements/directives** |

A useful mental model:

```text
Parent
  |
  | passes content
  v
<app-card>
  |
  +-- <ng-content>        -> renders the content
  |
  +-- @ContentChild()     -> gets one projected item
  |
  +-- @ContentChildren()  -> gets multiple projected items
```

Angular's official documentation describes `<ng-content>` as a placeholder for projected content and distinguishes projected content from the receiving component's own view.

---

# 2. `<ng-content>` — Content Projection

## Basic example

### Card component

```ts
@Component({
  selector: 'app-card',
  template: `
    <div class="card">
      <ng-content></ng-content>
    </div>
  `
})
export class CardComponent {}
```

### Parent

```html
<app-card>
  <h2>Angular Course</h2>
  <p>Learn Angular step by step.</p>
</app-card>
```

The content supplied by the parent is rendered where `<ng-content>` appears.

Conceptually:

```text
Parent content
      |
      v
<app-card>
   <ng-content>
      |
      v
   projected content
</app-card>
```

`<ng-content>` itself is not a real DOM element. It is a compile-time projection placeholder.

---

# 3. Why not simply use `@Input()`?

Consider a reusable card.

With `@Input()`:

```ts
@Component({
  selector: 'app-card',
  template: `
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
  `
})
export class CardComponent {
  @Input() title = '';
  @Input() description = '';
}
```

Usage:

```html
<app-card
  title="Angular"
  description="Learn Angular"
></app-card>
```

This works when the component knows exactly what data it needs.

But what if the parent wants to provide arbitrary HTML?

```html
<app-card>
  <h2>Angular</h2>

  <button>Enroll</button>

  <img src="angular.png">

  <p>Learn Angular.</p>
</app-card>
```

`@Input()` isn't a good fit for arbitrary markup.

`<ng-content>` is designed for this.

---

# 4. Content vs View

This distinction is extremely important for interviews.

Consider:

```ts
@Component({
  selector: 'app-card',
  template: `
    <div class="card">
      <h2>Card Header</h2>

      <ng-content></ng-content>
    </div>
  `
})
export class CardComponent {}
```

And:

```html
<app-card>
  <p>Hello</p>
</app-card>
```

The component's **view** contains:

```html
<div class="card">
  <h2>Card Header</h2>
  <ng-content></ng-content>
</div>
```

The component's **content** is:

```html
<p>Hello</p>
```

Therefore:

```text
CardComponent
├── View
│   ├── div.card
│   └── h2
│
└── Content
    └── p
```

This distinction explains why Angular has:

```text
@ViewChild()
@ViewChildren()

@ContentChild()
@ContentChildren()
```

---

# 5. `select` — Multiple Projection Slots

You can have more than one `<ng-content>`.

Example:

```ts
@Component({
  selector: 'app-card',
  template: `
    <div class="card">

      <div class="card-header">
        <ng-content select="[cardTitle]"></ng-content>
      </div>

      <div class="card-body">
        <ng-content select="[cardBody]"></ng-content>
      </div>

    </div>
  `
})
export class CardComponent {}
```

Parent:

```html
<app-card>

  <h2 cardTitle>Angular Course</h2>

  <p cardBody>
    Learn Angular from fundamentals to advanced concepts.
  </p>

</app-card>
```

Angular matches the projected elements against the CSS selectors.

The result is conceptually:

```html
<div class="card">

  <div class="card-header">
    <h2>Angular Course</h2>
  </div>

  <div class="card-body">
    <p>Learn Angular from fundamentals to advanced concepts.</p>
  </div>

</div>
```

---

# 6. Projection by element

You can also use element selectors:

```ts
template: `
  <header>
    <ng-content select="header"></ng-content>
  </header>

  <main>
    <ng-content select="main"></ng-content>
  </main>
`
```

Usage:

```html
<app-layout>

  <header>
    My Application
  </header>

  <main>
    Main content
  </main>

</app-layout>
```

---

# 7. Projection by CSS class

```ts
template: `
  <ng-content select=".title"></ng-content>
  <ng-content select=".body"></ng-content>
`
```

Usage:

```html
<app-card>

  <h2 class="title">Angular</h2>

  <p class="body">
    Angular content.
  </p>

</app-card>
```

---

# 8. Default `<ng-content>`

You can combine selected slots with a default slot:

```html
<ng-content select="[header]"></ng-content>

<div class="divider"></div>

<ng-content></ng-content>
```

Example:

```html
<app-card>

  <h2 header>Angular Course</h2>

  <p>Course description.</p>

  <button>Enroll</button>

</app-card>
```

The first slot receives:

```html
<h2>Angular Course</h2>
```

The default slot receives the unmatched content:

```html
<p>Course description.</p>
<button>Enroll</button>
```

---

# 9. Fallback content

Angular also supports fallback content:

```html
<ng-content select="[title]">
  Default title
</ng-content>
```

If the parent doesn't provide matching content, Angular can render:

```text
Default title
```

Example:

```html
<app-card></app-card>
```

can display the fallback title.

---

# 10. `@ContentChild()`

`@ContentChild()` lets the component access the **first matching item from projected content**.

Example:

```ts
@Directive({
  selector: '[cardTitle]'
})
export class CardTitleDirective {}
```

Card:

```ts
@Component({
  selector: 'app-card',
  template: `
    <div class="card">
      <ng-content></ng-content>
    </div>
  `
})
export class CardComponent {

  @ContentChild(CardTitleDirective)
  title!: CardTitleDirective;

}
```

Parent:

```html
<app-card>

  <h2 cardTitle>
    Angular Course
  </h2>

</app-card>
```

Now:

```ts
this.title
```

references the `CardTitleDirective` attached to the projected `<h2>`.

---

# 11. Querying a template reference variable

You can query projected content using a template reference variable.

Parent:

```html
<app-card>

  <button #actionButton>
    Enroll
  </button>

</app-card>
```

Component:

```ts
@ContentChild('actionButton')
button!: ElementRef<HTMLButtonElement>;
```

Then:

```ts
ngAfterContentInit() {
  console.log(this.button.nativeElement);
}
```

---

# 12. `read` with `@ContentChild()`

Sometimes you want to find an element/directive but read another token from it.

For example:

```ts
@ContentChild(
  'actionButton',
  { read: ElementRef }
)
button!: ElementRef<HTMLButtonElement>;
```

Now Angular gives you the `ElementRef` associated with the matched content.

Other commonly useful tokens include:

```ts
ElementRef
TemplateRef
ViewContainerRef
```

---

# 13. When is `@ContentChild()` available?

For the traditional decorator API, content queries are resolved before:

```ts
ngAfterContentInit()
```

Therefore, this is the safest lifecycle hook when working with the result:

```ts
export class CardComponent implements AfterContentInit {

  @ContentChild(CardTitleDirective)
  title!: CardTitleDirective;

  ngAfterContentInit() {
    console.log(this.title);
  }
}
```

Typical lifecycle order to remember:

```text
constructor
    ↓
ngOnInit
    ↓
ngAfterContentInit
    ↓
ngAfterViewInit
```

The important interview distinction is:

```text
@ContentChild()  -> projected content
@ViewChild()     -> component's own view
```

---

# 14. `@ContentChildren()`

`@ContentChildren()` is used when you want **multiple projected items**.

It returns a `QueryList`.

Example directive:

```ts
@Directive({
  selector: '[accordionItem]'
})
export class AccordionItemDirective {

  @Input()
  title = '';

}
```

Accordion:

```ts
@Component({
  selector: 'app-accordion',
  template: `
    <div class="accordion">
      <ng-content></ng-content>
    </div>
  `
})
export class AccordionComponent {

  @ContentChildren(AccordionItemDirective)
  items!: QueryList<AccordionItemDirective>;

  ngAfterContentInit() {
    console.log(this.items.length);
  }

}
```

Parent:

```html
<app-accordion>

  <div accordionItem title="Angular">
    Angular content
  </div>

  <div accordionItem title="RxJS">
    RxJS content
  </div>

  <div accordionItem title="NgRx">
    NgRx content
  </div>

</app-accordion>
```

Now:

```ts
this.items
```

contains all three matching directives.

---

# 15. `QueryList`

Traditional `@ContentChildren()` returns:

```ts
QueryList<AccordionItemDirective>
```

You can:

```ts
this.items.length
```

or:

```ts
this.items.toArray()
```

or:

```ts
this.items.forEach(item => {
  console.log(item.title);
});
```

You can also listen to changes:

```ts
this.items.changes.subscribe(items => {
  console.log('Content children changed', items);
});
```

Angular updates the query when matching projected children are added, removed, or moved.

---

# 16. `descendants`

By default:

```ts
@ContentChildren(AccordionItemDirective)
items!: QueryList<AccordionItemDirective>;
```

queries direct content children.

If you want to search nested descendants:

```ts
@ContentChildren(
  AccordionItemDirective,
  { descendants: true }
)
items!: QueryList<AccordionItemDirective>;
```

Consider:

```html
<app-accordion>

  <div accordionItem></div>

  <section>
    <div accordionItem></div>
  </section>

</app-accordion>
```

With:

```ts
{ descendants: false }
```

you get only the direct matching child.

With:

```ts
{ descendants: true }
```

you can also find the nested matching child.

---

# 17. `@ContentChild()` vs `@ContentChildren()`

| Feature | `@ContentChild()` | `@ContentChildren()` |
|---|---|---|
| Number of results | First matching item | Multiple matching items |
| Return type | Item or `undefined` | `QueryList<T>` |
| Typical use | Header, button, template | Tabs, accordion items, menu items |
| Lifecycle | Available before `ngAfterContentInit()` | Available before `ngAfterContentInit()` |
| `descendants` | Supported | Supported |
| `.changes` | No | Yes |

Simple mental model:

```text
@ContentChild()
     ↓
"Give me ONE projected child"

@ContentChildren()
     ↓
"Give me ALL projected children"
```

---

# 18. `@ContentChild()` vs `@ViewChild()`

This is one of the most important Angular interview questions.

### `@ViewChild()`

Queries something inside the component's own template.

```ts
@Component({
  template: `
    <button #button>
      Save
    </button>
  `
})
export class MyComponent {

  @ViewChild('button')
  button!: ElementRef;

}
```

### `@ContentChild()`

Queries something projected by the parent.

```html
<my-component>

  <button #button>
    Save
  </button>

</my-component>
```

Then:

```ts
@ContentChild('button')
button!: ElementRef;
```

### Remember

```text
Component template
        |
        +---- @ViewChild()
        |
        v
      VIEW


Parent passes content
        |
        +---- @ContentChild()
        |
        v
     CONTENT
```

---

# 19. Important: Content queries don't cross component boundaries

Suppose:

```html
<app-wrapper>
  <app-child></app-child>
</app-wrapper>
```

The wrapper cannot use `@ContentChild()` to reach into the internal template of `app-child`.

A component's template is a black box to its ancestors.

This distinction is important:

```text
Projected content -> queryable

Another component's internal template -> NOT queryable
```

---

# 20. Real-world example: Accordion

This is where all three concepts become useful.

## Parent usage

```html
<app-accordion>

  <button accordionBtn>
    Angular
  </button>

  <div accordionData>
    Angular content
  </div>

  <button accordionBtn>
    RxJS
  </button>

  <div accordionData>
    RxJS content
  </div>

</app-accordion>
```

The parent provides the accordion items.

---

## Directives

```ts
@Directive({
  selector: '[accordionBtn]'
})
export class AccordionButtonDirective {}

@Directive({
  selector: '[accordionData]'
})
export class AccordionDataDirective {}
```

---

## Accordion component

```ts
@Component({
  selector: 'app-accordion',
  template: `
    <div class="accordion">
      <ng-content></ng-content>
    </div>
  `
})
export class AccordionComponent {

  @ContentChildren(AccordionButtonDirective)
  buttons!: QueryList<AccordionButtonDirective>;

  @ContentChildren(AccordionDataDirective)
  panels!: QueryList<AccordionDataDirective>;

  ngAfterContentInit() {
    console.log('Buttons:', this.buttons.length);
    console.log('Panels:', this.panels.length);
  }
}
```

Now the accordion component can coordinate the projected buttons and panels.

This is a very common pattern for building:

- Accordion
- Tabs
- Menu
- Stepper
- Custom form components
- Modal components
- Table components

---

# 21. Modern Angular query APIs

Angular also provides function-based query APIs.

Instead of:

```ts
@ContentChild(CardTitleDirective)
title!: CardTitleDirective;
```

you can use:

```ts
title = contentChild(CardTitleDirective);
```

The result is a signal:

```ts
title()
```

Similarly:

```ts
items = contentChildren(AccordionItemDirective);
```

Then:

```ts
items()
```

returns the current read-only collection.

These APIs became stable in Angular 19.

---

# 22. Modern `contentChild()`

Example:

```ts
import { Component, contentChild } from '@angular/core';

@Component({
  selector: 'app-card',
  template: `
    <ng-content></ng-content>
  `
})
export class CardComponent {

  title = contentChild(CardTitleDirective);

}
```

Read it using:

```ts
this.title()
```

Because it is a signal.

If no matching content exists:

```ts
this.title()
```

returns:

```ts
undefined
```

---

# 23. Required content

If content must always exist, modern Angular supports:

```ts
title = contentChild.required(CardTitleDirective);
```

Now the signal represents a matching item rather than an optional result.

This is useful when your component has a contract such as:

```text
Every app-card MUST have a card title.
```

---

# 24. Modern `contentChildren()`

Instead of:

```ts
@ContentChildren(AccordionItemDirective)
items!: QueryList<AccordionItemDirective>;
```

you can use:

```ts
items = contentChildren(AccordionItemDirective);
```

Then:

```ts
console.log(this.items());
```

returns the current collection.

Example:

```ts
@Component({
  selector: 'app-tabs',
  template: `
    <ng-content></ng-content>

    <p>Total tabs: {{ tabs().length }}</p>
  `
})
export class TabsComponent {

  tabs = contentChildren(TabComponent);

}
```

---

# 25. Modern vs decorator APIs

| Older/decorator API | Modern function API |
|---|---|
| `@ContentChild()` | `contentChild()` |
| `@ContentChildren()` | `contentChildren()` |
| Property/query result | Signal/query result |
| `QueryList` for multiple children | Read-only signal collection |
| `ngAfterContentInit()` commonly used | Signal can be read reactively |

For new Angular code, the function-based APIs are worth knowing, especially from Angular 19 onward.

However, you will still encounter `@ContentChild()` and `@ContentChildren()` extensively in existing enterprise Angular applications.

---

# 26. Common mistake: confusing content with view

Consider:

```html
<app-card>
  <button #btn>Save</button>
</app-card>
```

Inside `CardComponent`:

```ts
@ViewChild('btn')
button!: ElementRef;
```

This will NOT find the button.

Why?

Because the button belongs to the parent's content.

The correct query is:

```ts
@ContentChild('btn')
button!: ElementRef;
```

---

# 27. Common mistake: putting `<ng-content>` inside `@if`

Avoid:

```html
@if (showContent) {
  <ng-content></ng-content>
}
```

`<ng-content>` is processed by Angular at compile time. It should not be conditionally included with `@if`, `@for`, or `@switch`.

If you need conditional or dynamic template rendering, consider Angular template fragments or other dynamic rendering mechanisms.

---

# 28. Common mistake: expecting `@ContentChildren()` to find component internals

This will not work the way many developers initially expect:

```text
Parent
  |
  +-- ChildComponent
        |
        +-- <button>
```

The parent cannot use a content query to inspect the button inside `ChildComponent`'s own template.

The child component owns that view.

---

# 29. Practical decision guide

Ask yourself:

### Do I need to render arbitrary parent-provided HTML?

Use:

```html
<ng-content></ng-content>
```

### Do I need one projected child/directive?

Use:

```ts
@ContentChild(...)
```

or:

```ts
contentChild(...)
```

### Do I need several projected children/directives?

Use:

```ts
@ContentChildren(...)
```

or:

```ts
contentChildren(...)
```

### Do I need something defined in my own component template?

Use:

```ts
@ViewChild()
@ViewChildren()
```

or their modern query APIs.

---

# 30. Interview-ready answer

### What is `<ng-content>`?

> `<ng-content>` is Angular's content projection mechanism. It acts as a placeholder where content supplied by the parent component is rendered. It is useful for building reusable container components such as cards, modals, tabs, and accordions.

### What is `@ContentChild()`?

> `@ContentChild()` queries the first matching element, directive, component, or provider from the component's projected content.

### What is `@ContentChildren()`?

> `@ContentChildren()` queries multiple matching items from projected content and traditionally returns a `QueryList`. The query can optionally include nested descendants.

### Difference between `@ViewChild()` and `@ContentChild()`?

> `@ViewChild()` queries the component's own view, while `@ContentChild()` queries content projected into the component by its parent.

---

# 31. The most important mental model

Remember this:

```text
                 Angular Component
                       |
             +---------+---------+
             |                   |
           VIEW               CONTENT
             |                   |
      Component's own       Parent-provided
          template             markup
             |                   |
       @ViewChild()        @ContentChild()
       @ViewChildren()     @ContentChildren()
             |                   |
             +---------+---------+
                       |
                 <ng-content>
                       |
                renders CONTENT
```

If you remember only one thing:

> **`<ng-content>` renders projected content. `ContentChild`/`ContentChildren` let the receiving component inspect and interact with that projected content. `ViewChild`/`ViewChildren` operate on the component's own view.**

---

## Quick reference

```ts
// Project content
<ng-content></ng-content>

// One projected item - decorator API
@ContentChild(SomeDirective)
item!: SomeDirective;

// Multiple projected items - decorator API
@ContentChildren(SomeDirective)
items!: QueryList<SomeDirective>;

// One projected item - modern API
item = contentChild(SomeDirective);

// Required projected item - modern API
item = contentChild.required(SomeDirective);

// Multiple projected items - modern API
items = contentChildren(SomeDirective);
```

### Official Angular references

- Content projection: https://angular.dev/guide/components/content-projection
- `ContentChild`: https://angular.dev/api/core/ContentChild
- `ContentChildren`: https://angular.dev/api/core/ContentChildren
- `contentChild()`: https://angular.dev/api/core/contentChild
- `contentChildren()`: https://angular.dev/api/core/contentChildren
