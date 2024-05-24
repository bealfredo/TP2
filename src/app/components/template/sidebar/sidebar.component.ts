import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer, MatDrawerContainer, MatDrawerContent, MatSidenav } from '@angular/material/sidenav';
import { SidebarService } from '../../../services/sidebar.service';
import { MatToolbar } from '@angular/material/toolbar';
import { MatList, MatListItem, MatNavList } from '@angular/material/list';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatSidenav, MatDrawer, MatDrawerContainer, RouterModule,
           MatDrawerContent, MatToolbar, MatList, MatNavList, MatListItem, RouterOutlet, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  @ViewChild('drawer') public drawer!: MatDrawer;

  isOpen: boolean;

  constructor(private sidebarService: SidebarService) {
    this.isOpen = this.sidebarService.isOpen();
  }

  ngOnInit(): void {
    this.sidebarService.toggle();
    this.sidebarService.getSidebarState().subscribe((isOpen: boolean) => {
      this.isOpen = isOpen;
    });
  }
}
