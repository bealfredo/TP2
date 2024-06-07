import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { Planta } from '../../../models/planta.model';
import { PlantaService } from '../../../services/Planta.service';
import { CarrinhoService } from '../../../services/carrinho.service';

@Component({
  selector: 'app-home-cliente',
  standalone: true,
  imports: [NgFor, MatTableModule, MatToolbarModule, MatIconModule,
    MatButtonModule, RouterModule, CommonModule, MatTooltipModule,
    MatSlideToggleModule, MatExpansionModule, MatTooltipModule],
  templateUrl: './home-cliente.component.html',
  styleUrl: './home-cliente.component.css'
})
export class HomeClienteComponent implements OnInit {

  noImageUrl = './../../../../assets/images/plantanoimage.png'
  plantas: Planta[] = [];

  constructor(
    private plantaService: PlantaService,
    private carrinhoService: CarrinhoService
  ) {} // injeção de dependência

  ngOnInit(): void {

    this.plantaService.getAtivo().subscribe(data => {
      this.plantas = data;
    });
  }

  getUrlImagem(planta: Planta, imagem : string): string {
    return this.plantaService.getUrlImagem(planta, imagem);
  }

  getValorComDesconto(planta: Planta): number {
    return planta.precoVenda - (planta.precoVenda * planta.desconto);
  }

  adicionarAoCarrinho(planta: Planta): void {
    this.carrinhoService.adicionar({ planta: planta.id, quantidade: 1 });
  }

}
