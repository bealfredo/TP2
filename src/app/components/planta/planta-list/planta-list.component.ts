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
import { PlantaService } from '../../../services/Planta.service';
import { Planta } from '../../../models/planta.model';

// export class Planta {
//   id!: number;
//   nomeComum!: string;
//   nomeCientifico!: string;
//   descricao!: string;
//   codigo!: string;
//   imagemPrincipal!: string;
//   imagens!: string[];
//   precoVenda!: number;
//   precoCusto!: number;
//   desconto!: number;
//   quantidadeDisponivel!: number;
//   quantidadeVendido!: number;
//   origem!: string;
//   tempoCrescimento!: string;
//   statusPlanta!: StatusPlanta;
//   nivelDificuldade!: NivelDificuldade;
//   nivelToxidade!: NivelToxicidade;
//   portePlanta!: PortePlanta;
//   tags!: Tag[];
//   fornecedor!: Fornecedor;
//   categoriaPlanta!: CategoriaPlanta;
// }

@Component({
  selector: 'app-planta-list',
  standalone: true,
  imports: [NgFor, MatTableModule, MatToolbarModule, MatIconModule, MatButtonModule, RouterModule, CommonModule, MatTooltipModule, MatSlideToggleModule],
  templateUrl: './planta-list.component.html',
  styleUrl: './planta-list.component.css'
})
export class PlantaListComponent implements OnInit {

  displayedColumns: string[] = [
    'codigo',
    'nomeComum',
    'nomeCientifico',
    // 'tags',
    'valor',
    'categoriaPlanta',
    'quantidadeDisponivel',
    'quantidadeVendido',
    'statusPlanta',
    'acao'
  ];

  plantas: Planta[] = [];
  orderBy: string = 'codigo';

  constructor(private plantaService: PlantaService) {} // injeção de dependência

  ngOnInit(): void {
    this.plantaService.findAll().subscribe(data => {
      this.plantas = data;
      this.oderBy(this.orderBy);
    })
  }

  // updateAtiva(tag: Tag): void {
  //   const currentAtiva = tag.ativa;

  //   const dto = { ativa: !tag.ativa };
  //   this.tagService.updateAtiva(dto, tag.id).subscribe(data => {
  //     const index = this.tags.findIndex(c => c.id === tag.id);
  //     this.tags[index].ativa = !currentAtiva;
  //     this.tags = [...this.tags];
  //   });
  // }

  getValorComDesconto(planta: Planta): number {
    return planta.precoVenda - (planta.precoVenda * (planta.desconto / 100));
  }

  setOrderBy(column: string): void {
    this.orderBy = column;
    this.oderBy(column);
  }

  oderBy(orderBy: string): void {
    this.orderBy = orderBy;

    // if (orderBy === 'id') {
    //   this.orderByID();
    // } else if (orderBy === 'nome') {
    //   this.orderByNome();
    // } else if (orderBy === 'prioridade') {
    //   this.orderByPrioridade();
    // } else if (orderBy === 'ativa') {
    //   this.orderByAtiva();
    // } else if (orderBy === 'categoriaPlanta') {
    //   this.orderByCategoriaPlanta();
    // }


    if (orderBy === 'codigo') {
      this.orderByCodigo();
    } else if (orderBy === 'nomeComum') {
      this.orderByNomeComum();
    } else if (orderBy === 'nomeCientifico') {
      this.orderByNomeCientifico();
    } else if (orderBy === 'valor') {
      this.orderByValor();
    } else if (orderBy === 'categoria') {
      this.orderByCategoria();
    } else if (orderBy === 'quantidadeDisponivel') {
      this.orderByQuantidadeDisponivel();
    } else if (orderBy === 'quantidadeVendido') {
      this.orderByQuantidadeVendido();
    } else if (orderBy === 'statusPlanta') {
      this.orderByStatusPlanta();
    }
  }

  orderByID(): void {
    this.plantas.sort((a, b) => a.id - b.id);
    this.plantas = [...this.plantas];
  }

  orderByNomeComum(): void {
    this.plantas.sort((a, b) => {
      const nomeA = a.nomeComum.toLowerCase();
      const nomeB = b.nomeComum.toLowerCase();

      if (nomeA < nomeB) {
        return -1;
      }
      if (nomeA > nomeB) {
        return 1;
      }
      return 0;
    });

    this.plantas = [...this.plantas];
  }

  orderByNomeCientifico(): void {
    this.plantas.sort((a, b) => {
      const nomeA = a.nomeCientifico.toLowerCase();
      const nomeB = b.nomeCientifico.toLowerCase();

      if (nomeA < nomeB) {
        return -1;
      }
      if (nomeA > nomeB) {
        return 1;
      }
      return 0;
    });

    this.plantas = [...this.plantas];
  }

  orderByValor(): void {
    this.plantas.sort((a, b) => {
      const valorA = this.getValorComDesconto(a);
      const valorB = this.getValorComDesconto(b);
      return valorA - valorB;
    });
    this.plantas = [...this.plantas];
  }

  orderByCategoria(): void {
    this.plantas.sort((a, b) => {
      const categoriaA = a.categoriaPlanta.nome.toLowerCase();
      const categoriaB = b.categoriaPlanta.nome.toLowerCase();

      if (categoriaA < categoriaB) {
        return -1;
      }
      if (categoriaA > categoriaB) {
        return 1;
      }
      return 0;
    });

    this.plantas = [...this.plantas];
  }

  orderByCodigo(): void {
    this.plantas.sort((a, b) => {
      const codigoA = a.codigo.toLowerCase();
      const codigoB = b.codigo.toLowerCase();

      if (codigoA < codigoB) {
        return -1;
      }
      if (codigoA > codigoB) {
        return 1;
      }
      return 0;
    });

    this.plantas = [...this.plantas];
  }

  orderByQuantidadeDisponivel(): void {
    this.plantas.sort((a, b) => a.quantidadeDisponivel - b.quantidadeDisponivel);
    this.plantas = [...this.plantas];
  }

  orderByQuantidadeVendido(): void {
    this.plantas.sort((a, b) => a.quantidadeVendido - b.quantidadeVendido);
    this.plantas = [...this.plantas];
  }

  orderByStatusPlanta(): void {
    this.plantas.sort((a, b) => {
      const statusPlantaA = a.statusPlanta.label.toLowerCase();
      const statusPlantaB = b.statusPlanta.label.toLowerCase();

      if (statusPlantaA < statusPlantaB) {
        return -1;
      }
      if (statusPlantaA > statusPlantaB) {
        return 1;
      }
      return 0;
    });

    this.plantas = [...this.plantas];
  }








  // orderByAtiva(): void {
  //   this.tags.sort((a, b) => {
  //     if (a.ativa && !b.ativa) {
  //       return -1;
  //     }
  //     if (!a.ativa && b.ativa) {
  //       return 1;
  //     }
  //     return 0;
  //   });

  //   this.tags = [...this.tags];
  // }

  // orderByCategoriaPlanta(): void {
  //   this.tags.sort((a, b) => {
  //     const categoriaPlantaA = a.categoriaPlanta.nome.toLowerCase();
  //     const categoriaPlantaB = b.categoriaPlanta.nome.toLowerCase();

  //     if (categoriaPlantaA < categoriaPlantaB) {
  //       return -1;
  //     }
  //     if (categoriaPlantaA > categoriaPlantaB) {
  //       return 1;
  //     }
  //     return 0;
  //   });

  //   this.tags = [...this.tags];
  // }
}
