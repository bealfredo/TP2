import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatBadge } from '@angular/material/badge';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
// import { Usuario } from '../../../models/usuario.model';
import { AuthService, UsuarioLogado } from '../../../services/auth.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { SidebarService } from '../../../services/sidebar.service';
// import { CarrinhoService } from '../../../services/carrinho.service';
import { MatButton, MatButtonModule, MatIconButton } from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CarrinhoService } from '../../../services/carrinho.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbar, MatIcon, MatBadge, MatButton, MatIconButton, RouterModule, MatButtonModule, MatMenuModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {

  usuarioLogado: UsuarioLogado | null = null;
  private subscription = new Subscription();

  qtdItensCarrinho: number = 0;

  constructor(private sidebarService: SidebarService,
    private carrinhoService: CarrinhoService,
    private authService: AuthService,
    private localStorageService: LocalStorageService) {

  }

  ngOnInit(): void {
    // this.carrinhoService.upToDate();
    this.obterQtdItensCarrinho();
    this.obterUsuarioLogado();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  clickMenu() {
    this.sidebarService.toggle();
  }

  obterQtdItensCarrinho() {
    this.carrinhoService.carrinho$.subscribe(itens => {
      this.qtdItensCarrinho = itens.length
    });
  }

  obterUsuarioLogado() {
    this.subscription.add(this.authService.getUsuarioLogado().subscribe(
      usuario => this.usuarioLogado = usuario
    ));
  }

  deslogar() {
    this.authService.removeToken()
    this.authService.removeUsuarioLogado();
    window.location.href = '/login?perfil=3';
  }
}
