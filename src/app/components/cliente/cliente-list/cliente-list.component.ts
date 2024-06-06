import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { Cliente } from '../../../models/cliente.model';
import { Telefone } from '../../../models/telefone.model';
import { ClienteService } from '../../../services/cliente.service';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [NgFor, MatTableModule, MatToolbarModule, MatIconModule, MatButtonModule,
    RouterModule, CommonModule, MatTooltipModule, MatSlideToggleModule, MatPaginatorModule],
  templateUrl: './cliente-list.component.html',
  styleUrl: './cliente-list.component.css'
})
export class ClienteListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'nome', 'sobrenome', 'email', 'telefone', 'cpf', 'acao'];
  clientes: Cliente[] = [];
  orderBy: string = 'id';

  // paginacao
  totalRecords = 0;
  pageSize = 10;
  page = 0;


  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.clienteService.findAll(this.page, this.pageSize).subscribe(data => {
      this.clientes = data;
    })

    this.clienteService.count().subscribe(data => {
      this.totalRecords = data;
    })
  }
   // paginar os resultados
   paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.ngOnInit();
  }

  formatarCpf(cpf: string): string {
    if (cpf && cpf.length === 11) {
      return `${cpf.substring(0, 3)}.${cpf.substring(3, 6)}.${cpf.substring(6, 9)}-${cpf.substring(9, 11)}`;
    }
    return cpf;
  }

  formatarTelefone(telefone: Telefone): string {
    if (telefone) {
      return `(${telefone.ddd}) ${telefone.numero}`;
    }

    return telefone;
  }
}
