import { Component, OnInit } from '@angular/core';
import { Estado } from '../../../models/estado.model';
import { EstadoService } from '../../../services/estado.service';
import { NgFor } from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-estado-list',
  standalone: true,
  imports: [NgFor, MatTableModule, MatToolbarModule, MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './estado-list.component.html',
  styleUrl: './estado-list.component.css'
})
export class EstadoListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'nome', 'sigla', 'acao'];
  estados: Estado[] = [];
  orderBy: string = 'id';

  constructor(private estadoService: EstadoService) {} // injeção de dependência

  ngOnInit(): void {
    this.estadoService.findAll().subscribe(data => {
      this.estados = data;
      this.oderBy(this.orderBy);
    })
  }

  setOrderBy(column: string): void {
    this.orderBy = column;
    this.oderBy(column);
  }

  oderBy(orderBy: string): void {
    this.orderBy = orderBy;

    if (orderBy === 'id') {
      this.orderByID();
    } else if (orderBy === 'nome') {
      this.orderByNome();
    } else if (orderBy === 'sigla') {
      this.orderBySigla();
    }
  }

  orderByID(): void {
    this.estados.sort((a, b) => a.id - b.id);
    this.estados = [...this.estados];
  }

  orderByNome(): void {
    this.estados.sort((a, b) => {
      const nomeA = a.nome.toLowerCase();
      const nomeB = b.nome.toLowerCase();

      if (nomeA < nomeB) {
        return -1;
      }
      if (nomeA > nomeB) {
        return 1;
      }
      return 0;
    });

    this.estados = [...this.estados];
  }

  orderBySigla(): void {
    this.estados.sort((a, b) => {
      const siglaA = a.sigla.toLowerCase();
      const siglaB = b.sigla.toLowerCase();

      if (siglaA < siglaB) {
        return -1;
      }
      if (siglaA > siglaB) {
        return 1;
      }
      return 0;
    });

    this.estados = [...this.estados];
  }

}
