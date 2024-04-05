import { Component, OnInit } from '@angular/core';
import { Estado } from '../../../models/estado.model';
import { EstadoService } from '../../../services/estado.service';
import { NgFor } from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { CategoriaPlanta } from '../../../models/categoriaPlanta.model';
import { CategoriaPlantaService } from '../../../services/categoriaPlanta.service';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@Component({
  selector: 'app-categoriaPlanta-list',
  standalone: true,
  imports: [NgFor, MatTableModule, MatToolbarModule, MatIconModule, MatButtonModule, RouterModule, CommonModule, MatTooltipModule, MatSlideToggleModule],
  templateUrl: './categoriaPlanta-list.component.html',
  styleUrl: './categoriaPlanta-list.component.css'
})
export class CategoriaPlantaListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'nome', 'prioridade', 'ativa', 'tipoCategoria', 'acao'];
  categoriasPlanta: CategoriaPlanta[] = [];
  orderBy: string = 'id';

  constructor(private categoriaPlantaService: CategoriaPlantaService) {} // injeção de dependência

  ngOnInit(): void {
    this.categoriaPlantaService.findAll().subscribe(data => {
      this.categoriasPlanta = data;
    })
  }

  updateAtiva(categoriaPlanta: CategoriaPlanta): void {
    const currentAtiva = categoriaPlanta.ativa;

    const dto = { ativa: !categoriaPlanta.ativa };
    this.categoriaPlantaService.updateAtiva(dto, categoriaPlanta.id).subscribe(data => {
      const index = this.categoriasPlanta.findIndex(c => c.id === categoriaPlanta.id);
      this.categoriasPlanta[index].ativa = !currentAtiva;
      this.categoriasPlanta = [...this.categoriasPlanta];
    });
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
    } else if (orderBy === 'prioridade') {
      this.orderByPrioridade();
    } else if (orderBy === 'ativa') {
      this.orderByAtiva();
    } else if (orderBy === 'tipoCategoria') {
      this.orderByTipoCategoria();
    }
  }

  orderByID(): void {
    this.categoriasPlanta.sort((a, b) => a.id - b.id);
    this.categoriasPlanta = [...this.categoriasPlanta];
  }

  orderByNome(): void {
    this.categoriasPlanta.sort((a, b) => {
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

    this.categoriasPlanta = [...this.categoriasPlanta];
  }

  orderByPrioridade(): void {
    this.categoriasPlanta.sort((a, b) => b.prioridade - a.prioridade);
    this.categoriasPlanta = [...this.categoriasPlanta];
  }

  orderByAtiva(): void {
    this.categoriasPlanta.sort((a, b) => {
      if (a.ativa && !b.ativa) {
        return -1;
      }
      if (!a.ativa && b.ativa) {
        return 1;
      }
      return 0;
    });

    this.categoriasPlanta = [...this.categoriasPlanta];
  }

  orderByTipoCategoria(): void {
    this.categoriasPlanta.sort((a, b) => {
      console.log(a)
      const tipoCategoriaA = a.tipoCategoria.label.toLowerCase();
      const tipoCategoriaB = b.tipoCategoria.label.toLowerCase();

      if (tipoCategoriaA < tipoCategoriaB) {
        return -1;
      }
      if (tipoCategoriaA > tipoCategoriaB) {
        return 1;
      }
      return 0;
    });

    this.categoriasPlanta = [...this.categoriasPlanta];
  }
}
