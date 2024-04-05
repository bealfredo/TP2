import { Component, OnInit } from '@angular/core';
import { Estado } from '../../../models/estado.model';
import { EstadoService } from '../../../services/estado.service';
import { NgFor } from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { Tag } from '../../../models/tag.model';
import { TagService } from '../../../services/tag.service';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@Component({
  selector: 'app-tag-list',
  standalone: true,
  imports: [NgFor, MatTableModule, MatToolbarModule, MatIconModule, MatButtonModule, RouterModule, CommonModule, MatTooltipModule, MatSlideToggleModule],
  templateUrl: './tag-list.component.html',
  styleUrl: './tag-list.component.css'
})
export class TagListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'nome', 'prioridade', 'ativa', 'categoriaPlanta', 'acao'];
  categoriasPlanta: Tag[] = [];
  orderBy: string = 'id';

  constructor(private tagService: TagService) {} // injeção de dependência

  ngOnInit(): void {
    this.tagService.findAll().subscribe(data => {
      this.categoriasPlanta = data;
    })
  }

  updateAtiva(tag: Tag): void {
    const currentAtiva = tag.ativa;

    const dto = { ativa: !tag.ativa };
    this.tagService.updateAtiva(dto, tag.id).subscribe(data => {
      const index = this.categoriasPlanta.findIndex(c => c.id === tag.id);
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
    } else if (orderBy === 'categoriaPlanta') {
      this.orderByCategoriaPlanta();
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

  orderByCategoriaPlanta(): void {
    this.categoriasPlanta.sort((a, b) => {
      const categoriaPlantaA = a.categoriaPlanta.nome.toLowerCase();
      const categoriaPlantaB = b.categoriaPlanta.nome.toLowerCase();

      if (categoriaPlantaA < categoriaPlantaB) {
        return -1;
      }
      if (categoriaPlantaA > categoriaPlantaB) {
        return 1;
      }
      return 0;
    });

    this.categoriasPlanta = [...this.categoriasPlanta];
  }
}
