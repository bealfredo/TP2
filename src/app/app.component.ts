import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService, UsuarioLogado } from './services/auth.service';
import { CarrinhoService } from './services/carrinho.service';
import { LocalStorageService } from './services/local-storage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'angular-psicologia';

  constructor(
    private authService: AuthService,
    private carrinhoService: CarrinhoService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.authService.initUsuarioLogado();

    if (this.localStorageService.getItem('jwt_token')) {
      const usuario : UsuarioLogado = this.localStorageService.getItem('usuario_logado');
      if (usuario && usuario.idTipoPerfil == 3) {
        this.carrinhoService.onInit();
      }
      // this.carrinhoService.upToDate();
    }
  }

}
