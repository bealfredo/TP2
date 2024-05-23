import { Component, OnInit } from '@angular/core';
 import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule,
    RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  idTipoPerfil : number = 1;
  errorMessage : string = '';

  formGroup!: FormGroup;

  constructor(
     private formBuilder: FormBuilder,
     private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.idTipoPerfil = +params.get('perfil')!;
    });

    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  onSubmit() {
    if (this.formGroup.valid) {
      const email = this.formGroup.get('email')!.value;
      const password = this.formGroup.get('password')!.value;
      this.authService.login(email, password, this.idTipoPerfil).subscribe({
        next: (resp) => {
          this.router.navigateByUrl('/');
        },
        error: (err) => {
          this.tratarErrors(err);
        }
      });
    } else {
      // this.showSnackbarTopPosition("Dados inválidos", 'Fechar', 2000);
    }
  }

  tratarErrors(error: HttpErrorResponse) {
    if (error.status == 400) {
      if (error.error?.errors) {
        error.error.errors.forEach((validationError: any) => {
          if (validationError.fieldName === 'idTipoPerfil' || validationError.fieldName === 'auth') {
            this.errorMessage = validationError.message;
            //limpar formulário
            this.formGroup.reset();
            return;
          }

          const formControl = this.formGroup.get(validationError.fieldName);
          if (formControl) {
              formControl.setErrors({apiError: validationError.message});
          }
        });
      }
    } else if (error.status < 500) {
      alert(error.error?.message || 'Erro genérico de envio do formulário.');
    } else if (error.status >= 500) {
      alert('Erro interno do servidor. Tente novamente mais tarde.');
    }
  }

  errorMessages : {[controlName: string] : {[errorName: string]: string}} = {
    email: {
      email: 'E-mail inválido.',
      required: 'E-mail obrigatório.',
      apiError: ' ' // mensagem da api
    },
    password: {
      required: 'Senha obrigatória.',
      minlength: 'Senha deve ter no mínimo 3 caracteres.',
      apiError: ' ' // mensagem da api
    }
  }

  getErrorMessages(controlName: string, errors: ValidationErrors | null | undefined): string {
    if (!errors) { return ''; }

    for (const errorName in errors) {
      if (errors.hasOwnProperty(errorName) && this.errorMessages[controlName][errorName]) {
        return this.errorMessages[controlName][errorName];
      }
    }

    // não deve ir para o cliente
    return 'Erro não mapeado. Verifique o console ou entre em contato com o desenvolvedor.';
  }

  onRegister() {
    // criar usuário
  }

  getPerfilName() {
    switch (this.idTipoPerfil) {
      case 1:
      case 2:
        return 'Administrador';
      case 3:
        return 'Cliente';
      case 4:
        return 'Entregador';
      default:
        return null;
    }
  }

  goToPerfil(idTipoPerfil: number) {
    this.router.navigate(['/login'], { queryParams: { perfil: idTipoPerfil } });
  }

  showSnackbarTopPosition(content: any, action: any, duration: any) {
    this.snackBar.open(content, action, {
      duration: 2000,
      verticalPosition: "top", // Allowed values are  'top' | 'bottom'
      horizontalPosition: "center" // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
    });
  }
}
