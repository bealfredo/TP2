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
import { Planta } from '../../models/planta.model';
import { PlantaService } from '../../services/Planta.service';
import { CarrinhoService } from '../../services/carrinho.service';
import { ClienteService } from '../../services/cliente.service';
import { ItemCarrinho } from '../../models/itemcarrinho.model';
import { LocalStorageService } from '../../services/local-storage.service';
import { UsuarioLogado } from '../../services/auth.service';
import { Cliente } from '../../models/cliente.model';
import { VendaService } from '../../services/venda.service';


@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [NgFor, MatTableModule, MatToolbarModule, MatIconModule,
    MatButtonModule, RouterModule, CommonModule, MatTooltipModule,
    MatSlideToggleModule, MatExpansionModule, MatTooltipModule],
  templateUrl: './carrinho.component.html',
  styleUrl: './carrinho.component.css'
})
export class CarrinhoComponent implements OnInit {

  noImageUrl = './../../../../assets/images/plantanoimage.png'
  plantas: Planta[] = [];
  itensCarrinho: ItemCarrinho[] = [];
  usuarioLogado: Cliente | null = null;
  selectedEnderecoId: number | null= null;

  constructor(
    private plantaService: PlantaService,
    private carrinhoService: CarrinhoService,
    private clienteService: ClienteService,
    private locaStorageService: LocalStorageService,
    private vendaService: VendaService
  ) {} // injeção de dependência

  ngOnInit(): void {
    this.usuarioLogado = this.locaStorageService.getItem('usuario_logado');
    console.log('Usuario logado', this.usuarioLogado)

    this.clienteService.getCarrinho().subscribe(data => {
      this.itensCarrinho = data;

      this.plantaService.getPlantasDoCarrinho(this.itensCarrinho).subscribe(data => {
        this.plantas = data;
      });
    });


    // this.plantaService.getAtivo().subscribe(data => {
    //   this.plantas = data;
    // });
  }

  getUrlImagem(planta: Planta, imagem : string): string {
    return this.plantaService.getUrlImagem(planta, imagem);
  }

  getValorComDesconto(planta: Planta): number {
    return planta.precoVenda - (planta.precoVenda * planta.desconto);
  }

  adicionarAoCarrinho(planta: Planta): void {
    this.carrinhoService.adicionar({ planta: planta.id, quantidade: 1 });
    this.uptoDate();
  }

  removerDoCarrinho(planta: Planta): void {
    this.carrinhoService.remover({ planta: planta.id, quantidade: 1});
    this.uptoDate();
  }

  limparCarrinho(): void {
    this.carrinhoService.removerTudo();
    this.uptoDate();
  }

  getQuantidade(planta: Planta): number {
    const item = this.itensCarrinho.find(item => item.planta === planta.id);
    return item ? item.quantidade : 0;
  }

  uptoDate(): void {
    setTimeout(() => {
      this.ngOnInit();
    }, 1000);

  }

  selecionarEndereco(id: number): void {
    this.selectedEnderecoId = id;
  }

  isSelectedEndereco(id: number): boolean {
    return this.selectedEnderecoId === id;
  }

  getValorTotal(): number {
    return this.itensCarrinho.reduce((acc, item) => {
      if (!this.usuarioLogado) {
        return 0;
      }

      const valorFrete = this.usuarioLogado.listaEndereco.find(endereco => endereco.id === this.selectedEnderecoId)?.cidade.frete || 0;

      const planta = this.plantas.find(planta => planta.id === item.planta);
      const comDesconto = acc + (planta ? (planta.precoVenda - planta.precoVenda * planta.desconto) * item.quantidade : 0);
      return comDesconto + valorFrete;
    }, 0);
  }

  finalizarCompra(): void {
    if (!this.usuarioLogado) {
      return;
    }

    const idEnderecoEntrega = this.usuarioLogado.listaEndereco.find(endereco => endereco.id === this.selectedEnderecoId)?.id || 0;
    const itensVenda = this.itensCarrinho.map(item => ({ planta: item.planta, quantidade: item.quantidade }));

    this.vendaService.finalizarCompra(idEnderecoEntrega, itensVenda).subscribe(data => {
      window.alert('Compra finalizada com sucesso');
      this.limparCarrinho();
    });
  }

}
