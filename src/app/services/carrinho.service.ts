import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
// import { ItemCarrinho } from '../models/itemcarrinho.model';
import { LocalStorageService } from './local-storage.service';
import { ItemCarrinho } from '../models/itemcarrinho.model';
import { AuthService } from './auth.service';
import { ClienteService } from './cliente.service';

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {

  private carrinhoSubject = new BehaviorSubject<ItemCarrinho[]>([]);
  carrinho$ = this.carrinhoSubject.asObservable();

  constructor(
    private localStorageService: LocalStorageService,
    // private authService: AuthService,
    private clienteService: ClienteService
  ) {
    // const carrinhoArmazenado = localStorageService.getItem('carrinho') || [];
    // this.carrinhoSubject.next(carrinhoArmazenado);
  }

  onInit(): void {
    // const carrinhoArmazenado = this.localStorageService.getItem('carrinho') || [];
    this.upToDate();
    // this.carrinhoSubject.next(carrinhoArmazenado);
  }

  upToDate(): void {
    this.clienteService.getCarrinho().subscribe(data => {
      this.carrinhoSubject.next(data);
      console.log('Carrinho atualizado', data);
    });
  }


  adicionar(planta: ItemCarrinho): void {
    if (this.localStorageService.getItem('jwt_token') === null) {
      alert('Você precisa estar logado para adicionar produtos ao carrinho!');
      return;
    }

    const carrinhoAtual = this.carrinhoSubject.value;
    const itemExistente = carrinhoAtual.find(item => item.planta === planta.planta);

    if (itemExistente) {
      itemExistente.quantidade += planta.quantidade || 1;
    } else {
      carrinhoAtual.push({ ...planta });
    }

    console.log('carrinhoAtual', carrinhoAtual)

    this.carrinhoSubject.next(carrinhoAtual);
    this.sincronizar();
  }

  removerTudo(): void {
    // this.localStorageService.removeItem('carrinho');
    this.carrinhoSubject.next([]);
    this.sincronizar();
    window.location.reload(); // reload na página
  }

  remover(planta: ItemCarrinho): void {
    const carrinhoAtual = this.carrinhoSubject.value;
    // const carrinhoAtualizado = carrinhoAtual.filter(itemCarrinho => itemCarrinho.planta != item.planta);
    const itemExistente = carrinhoAtual.find(itemCarrinho => itemCarrinho.planta === planta.planta);

    if (!itemExistente) {
      return;
    }

    itemExistente.quantidade -= planta.quantidade || 1;

    if (itemExistente.quantidade <= 0) {
      const carrinhoAtualizado = carrinhoAtual.filter(itemCarrinho => itemCarrinho.planta !== planta.planta);
      this.carrinhoSubject.next(carrinhoAtualizado);
    } else {
      const carrinhoAtualizado = carrinhoAtual.map(itemCarrinho => itemCarrinho.planta === planta.planta ? itemExistente : itemCarrinho);
      this.carrinhoSubject.next(carrinhoAtualizado);
    }

    // this.carrinhoSubject.next(carrinhoAtualizado);
    this.sincronizar();
  }

  obter(): ItemCarrinho[] {
    return this.carrinhoSubject.value;
  }

  private sincronizar(): void {
    this.clienteService.updateCarrinho(JSON.stringify(this.carrinhoSubject.value)).subscribe(data => {
      console.log('Carrinho sincronizado', data);
    });
    // localStorage.setItem('carrinho', JSON.stringify(this.carrinhoSubject.value));
  }
}
