import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-user-template',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, RouterOutlet, MatButton, MatIcon],
  templateUrl: './cliente-template.component.html',
  styleUrl: './cliente-template.component.css'
})
export class ClienteTemplateComponent {

}
