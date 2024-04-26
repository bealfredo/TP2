import { Component, OnInit } from '@angular/core';
import { Endereco } from '../../../models/endereco.model';
import { EnderecoService } from '../../../services/endereco.service';
import { NgFor } from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-endereco-list',
  standalone: true,
  imports: [NgFor, MatTableModule, MatToolbarModule, MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './endereco-list.component.html',
  styleUrl: './endereco-list.component.css'
})
export class EnderecoListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'cep', 'codigo', 'rua', 'bairro', 'numeroLote', 'cidade', 'estado', 'acao'];
  enderecos: Endereco[] = [];
  orderBy: string = 'id';

  constructor(private enderecoService: EnderecoService) {} // injeção de dependência

  ngOnInit(): void {
    this.enderecoService.findAll().subscribe(data => {
      this.enderecos = data;
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
    } else if (orderBy === 'cep') {
      this.orderByCep();
    } else if (orderBy === 'codigo') {
      this.orderByCodigo();
    } else if (orderBy === 'rua') {
      this.orderByRua();
    } else if (orderBy === 'bairro') {
      this.orderByBairro();
    } else if (orderBy === 'numeroLote') {
      this.orderByNumeroLote();
    }
  }

  orderByID(): void {
    this.enderecos.sort((a, b) => a.id - b.id);
    this.enderecos = [...this.enderecos];
  }

  orderByCep(): void {
    this.enderecos.sort((a, b) => {
      const cepA = (a.cep || '').toLowerCase();
      const cepB = (b.cep || '').toLowerCase();

      if (cepA < cepB) {
        return -1;
      }
      if (cepA > cepB) {
        return 1;
      }
      return 0;
    });

    this.enderecos = [...this.enderecos];
  }

  orderByCodigo(): void {
    this.enderecos.sort((a, b) => {
      const codigoA = (a.codigo || '').toLowerCase();
      const codigoB = (b.codigo || '').toLowerCase();

      if (codigoA < codigoB) {
        return -1;
      }
      if (codigoA > codigoB) {
        return 1;
      }
      return 0;
    });

    this.enderecos = [...this.enderecos];
  }
  
  orderByRua(): void {
    this.enderecos.sort((a, b) => {
      const ruaA = (a.rua || '').toLowerCase();
      const ruaB = (b.rua || '').toLowerCase();

      if (ruaA < ruaB) {
        return -1;
      }
      if (ruaA > ruaB) {
        return 1;
      }
      return 0;
    });

    this.enderecos = [...this.enderecos];
  }

  orderByBairro(): void {
    this.enderecos.sort((a, b) => {
      const bairroA = (a.bairro || '').toLowerCase();
      const bairroB = (b.bairro || '').toLowerCase();

      if (bairroA < bairroB) {
        return -1;
      }
      if (bairroA > bairroB) {
        return 1;
      }
      return 0;
    });

    this.enderecos = [...this.enderecos];
  }

  orderByNumeroLote(): void {
    this.enderecos.sort((a, b) => {
      const numeroLoteA = (a.numeroLote || '').toLowerCase();
      const numeroLoteB = (b.numeroLote || '').toLowerCase();

      if (numeroLoteA < numeroLoteB) {
        return -1;
      }
      if (numeroLoteA > numeroLoteB) {
        return 1;
      }
      return 0;
    });

    this.enderecos = [...this.enderecos];
  }
}
