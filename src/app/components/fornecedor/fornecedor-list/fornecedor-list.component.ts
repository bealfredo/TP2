import { Component, OnInit } from '@angular/core';
import { Estado } from '../../../models/estado.model';
import { EstadoService } from '../../../services/estado.service';
import { NgFor } from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { Fornecedor } from '../../../models/fornecedor.model';
import { FornecedorService } from '../../../services/fornecedor.service';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { Telefone } from '../../../models/telefone.model';

@Component({
  selector: 'app-fornecedor-list',
  standalone: true,
  imports: [NgFor, MatTableModule, MatToolbarModule, MatIconModule, MatButtonModule, RouterModule, CommonModule, MatTooltipModule, MatSlideToggleModule],
  templateUrl: './fornecedor-list.component.html',
  styleUrl: './fornecedor-list.component.css'
})
export class FornecedorListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'nome', 'email', 'telefone', 'cnpj', 'acao'];
  fornecedores: Fornecedor[] = [];
  orderBy: string = 'id';

  constructor(private fornecedorService: FornecedorService) {} // injeção de dependência

  ngOnInit(): void {
    this.fornecedorService.findAll().subscribe(data => {
      this.fornecedores = data;
      this.oderBy(this.orderBy);
    })
  }

  formatarCnpj(cnpj: string): string {
    if (cnpj && cnpj.length === 14) {
      return `${cnpj.substring(0, 2)}.${cnpj.substring(2, 5)}.${cnpj.substring(5, 8)}/${cnpj.substring(8, 12)}-${cnpj.substring(12, 14)}`;
    }
    return cnpj;
  }

  formatarTelefone(telefone: Telefone): string {
    // if (telefone && telefone.length === 11) {
    //   return `(${telefone.substring(0, 2)}) ${telefone.substring(2, 7)}-${telefone.substring(7, 11)}`;
    // }

    if (telefone) {
      return `(${telefone.ddd}) ${telefone.numero}`;
    }

    return telefone;
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
    } else if (orderBy === 'email') {
      this.orderByEmail();
    // } else if (orderBy === 'telefone') {
    //   this.orderByTelefone();
    } else if (orderBy === 'cnpj') {
      this.orderByCnpj();
    }
  }

  orderByID(): void {
    this.fornecedores.sort((a, b) => a.id - b.id);
    this.fornecedores = [...this.fornecedores];
  }

  orderByNome(): void {
    this.fornecedores.sort((a, b) => {
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

    this.fornecedores = [...this.fornecedores];
  }

  orderByEmail(): void {
    this.fornecedores.sort((a, b) => {
      const emailA = a.email.toLowerCase();
      const emailB = b.email.toLowerCase();

      if (emailA < emailB) {
        return -1;
      }
      if (emailA > emailB) {
        return 1;
      }
      return 0;
    });

    this.fornecedores = [...this.fornecedores];
  }

  // orderByTelefone(): void {
  //   this.fornecedores.sort((a, b) => {
  //     const telefoneA = a.telefone.toLowerCase();
  //     const telefoneB = b.telefone.toLowerCase();

  //     if (telefoneA < telefoneB) {
  //       return -1;
  //     }
  //     if (telefoneA > telefoneB) {
  //       return 1;
  //     }
  //     return 0;
  //   });

  //   this.fornecedores = [...this.fornecedores];
  // }

  orderByCnpj(): void {
    this.fornecedores.sort((a, b) => {
      const cnpjA = (a.cnpj || '').toLowerCase();
      const cnpjB = (b.cnpj || '').toLowerCase();

      if (cnpjA < cnpjB) {
        return -1;
      }
      if (cnpjA > cnpjB) {
        return 1;
      }
      return 0;
    });

    this.fornecedores = [...this.fornecedores];
  }
}
