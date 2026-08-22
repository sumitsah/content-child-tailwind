import { Component, ContentChildren, QueryList } from '@angular/core';
import { TabComponent } from '../tab/tab.component';
import { CommonModule } from '@angular/common';
// import { ɵEmptyOutletComponent } from "@angular/router";

@Component({
  selector: 'app-tabs',
  imports: [CommonModule],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css'
})
export class TabsComponent {
  // Querying the DOM to find ALL instances of TabComponent passed down via ng-content
  @ContentChildren(TabComponent) tabs!: QueryList<TabComponent>;

  ngAfterContentInit() {
    // Wait until content projection links completely, then locate the first tab
    const activeTab = this.tabs.find(tab => tab.active);

    // If no tab was explicitly marked as active by the parent, default to the first tab
    if (!activeTab && this.tabs.first) {
      this.selectTab(this.tabs.first);
    }
  }

  selectTab(selectedTab: TabComponent) {
    // Deactivate all discovered tabs in the QueryList array loop
    this.tabs.forEach(tab => tab.active = false);

    // Turn on only the clicked tab instance
    selectedTab.active = true;
  }
}
