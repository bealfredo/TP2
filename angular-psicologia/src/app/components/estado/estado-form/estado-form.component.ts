import { Component } from '@angular/core';

@Component({
  selector: 'app-estado-form',
  standalone: true,
  imports: [],
  templateUrl: './estado-form.component.html',
  styleUrl: './estado-form.component.css'
})
export class EstadoFormComponent {
  exemploEstado: string = 'Tocantins';
  exemplo = 'Goias';
}
