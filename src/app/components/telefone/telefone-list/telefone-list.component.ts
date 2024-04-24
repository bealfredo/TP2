import { Component, OnInit } from '@angular/core';
import { Telefone } from '../../../models/telefone.model';
import { TelefoneService } from '../../../services/telefone.service';
import { NgFor } from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-telefone-list',
  standalone: true,
  imports: [NgFor, MatTableModule, MatToolbarModule, MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './telefone-list.component.html',
  styleUrl: './telefone-list.component.css'
})
export class TelefoneListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'ddd', 'numero', 'acao'];
  telefones: Telefone[] = [];
  orderBy: string = 'id';

  constructor(private telefoneService: TelefoneService) {} // injeção de dependência

  ngOnInit(): void {
    this.telefoneService.findAll().subscribe(data => {
      this.telefones = data;
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
    } else if (orderBy === 'ddd') {
      this.orderByDdd();
    } else if (orderBy === 'numero') {
      this.orderByNumero();
    }
  }

  orderByID(): void {
    this.telefones.sort((a, b) => a.id - b.id);
    this.telefones = [...this.telefones];
  }

  orderByDdd(): void {
    this.telefones.sort((a, b) => {
      const dddA = (a.ddd || '').toLowerCase();
      const dddB = (b.ddd || '').toLowerCase();

      if (dddA < dddB) {
        return -1;
      }
      if (dddA > dddB) {
        return 1;
      }
      return 0;
    });

    this.telefones = [...this.telefones];
  }

  orderByNumero(): void {
    this.telefones.sort((a, b) => {
      const numeroA = (a.numero || '').toLowerCase();
      const numeroB = (b.numero || '').toLowerCase();

      if (numeroA < numeroB) {
        return -1;
      }
      if (numeroA > numeroB) {
        return 1;
      }
      return 0;
    });

    this.telefones = [...this.telefones];
  }
}
