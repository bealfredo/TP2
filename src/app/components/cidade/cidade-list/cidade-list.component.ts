import { Component, OnInit } from '@angular/core';
import { Estado } from '../../../models/estado.model';
import { EstadoService } from '../../../services/estado.service';
import { NgFor } from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { Cidade } from '../../../models/cidade.model';
import { CidadeService } from '../../../services/cidade.service';

@Component({
  selector: 'app-cidade-list',
  standalone: true,
  imports: [NgFor, MatTableModule, MatToolbarModule, MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './cidade-list.component.html',
  styleUrl: './cidade-list.component.css'
})
export class CidadeListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'nome', 'estado', 'frete', 'acao'];
  cidades: Cidade[] = [];
  orderBy: string = 'id';

  constructor(private cidadeService: CidadeService) {} // injeção de dependência

  ngOnInit(): void {
    this.cidadeService.findAll().subscribe(data => {
      this.cidades = data;
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
    } else if (orderBy === 'estado') {
      this.orderByEstado();
    }
  }

  orderByID(): void {
    this.cidades.sort((a, b) => a.id - b.id);
    this.cidades = [...this.cidades];
  }

  orderByNome(): void {
    this.cidades.sort((a, b) => {
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

    this.cidades = [...this.cidades];
  }

  orderByEstado(): void {
    this.cidades.sort((a, b) => {
      const estadoA = a.estado.nome.toLowerCase();
      const estadoB = b.estado.nome.toLowerCase();

      if (estadoA < estadoB) {
        return -1;
      }
      if (estadoA > estadoB) {
        return 1;
      }
      return 0;
    });

    this.cidades = [...this.cidades];
  }
}
