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
import { ClienteService } from '../../services/cliente.service';
import { CarrinhoService } from '../../services/carrinho.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule,
    RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  idTipoPerfil : number = 1;
  errorMessage : string = '';

  formGroup!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private clienteService: ClienteService,
    private router: Router,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private carrinhoService: CarrinhoService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.idTipoPerfil = +params.get('perfil')!;
    });

    this.formGroup = this.formBuilder.group({
      carrinho: [''],
      primeiroNome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(3)]],
      confirmarSenha: ['', [Validators.required, Validators.minLength(3)]],
      passwordExisting: ['', [Validators.minLength(3)]],
      login: [''],
    });

    // confirm password check
    this.formGroup.get('confirmarSenha')?.valueChanges.subscribe((value) => {
      const senha = this.formGroup.get('senha')?.value;
      if (value !== senha) {
        this.formGroup.get('confirmarSenha')?.setErrors({passwordMismatch: true});
      } else {
        const errors = this.formGroup.get('confirmarSenha')?.errors;
        if (errors) {
          delete errors['passwordMismatch'];
          if (Object.keys(errors).length === 0) {
            this.formGroup.get('confirmarSenha')?.setErrors(null);
          } else {
            this.formGroup.get('confirmarSenha')?.setErrors(errors);
          }
        }
      }
    });

    this.formGroup.get('senha')?.valueChanges.subscribe((value) => {
      const confirmarSenha = this.formGroup.get('confirmarSenha')?.value;
      if (value !== confirmarSenha) {
        this.formGroup.get('confirmarSenha')?.setErrors({passwordMismatch: true});
      } else {
        const errors = this.formGroup.get('confirmarSenha')?.errors;
        if (errors) {
          delete errors['passwordMismatch'];
          if (Object.keys(errors).length === 0) {
            this.formGroup.get('confirmarSenha')?.setErrors(null);
          } else {
            this.formGroup.get('confirmarSenha')?.setErrors(errors);
          }
        }
      }
    });

    // email availability check
    this.formGroup.get('email')?.valueChanges.subscribe((value) => {
      if (value) {
        if (this.formGroup.get('email')?.errors?.['email']) {
          return;
        }

        this.errorMessage = '';
        this.formGroup.get('passwordExisting')?.setValue('');

        this.authService.emailTakenCliente(value).subscribe({
          next: (res) => {
            if (res && res.available !== undefined) {
              if (!res.available) {
                if (res.takenByCliente) {
                  this.formGroup.get('email')?.setErrors({
                    ...this.formGroup.get('email')?.errors,
                    takenByCliente: true
                  });
                } else {
                  this.formGroup.get('email')?.setErrors({
                    ...this.formGroup.get('email')?.errors,
                    emailTaken: true
                  });
                }
              } else {
                // Remove o erro emailTaken se o email estiver disponível
                const errors = this.formGroup.get('email')?.errors;
                if (errors) {
                  delete errors['emailTaken'];
                  if (Object.keys(errors).length === 0) {
                    this.formGroup.get('email')?.setErrors(null);
                  } else {
                    this.formGroup.get('email')?.setErrors(errors);
                  }
                }
              }
              this.formGroup.updateValueAndValidity();
            }
          }
        });
      }
    });
  }

  onSubmit() {
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) { return; }


    this.clienteService.create(this.formGroup.value).subscribe({
      next: () => {
        window.alert('Cadastrado com sucesso!');// ! make it a toast
        // this.router.navigate(['/']);
        // window.location.reload();
        // this.carrinhoService.upToDate();

        // go to / reloading usando location
        window.location.href = '/';

      },
      error: (err) => {
        console.log('Erro ao se cadastrar :(', err); // ! make it a toast
        this.tratarErrors(err);
      }
    })
  }

  createExistingUser() {
    if (!this.formGroup.get('email')?.value) {
      return;
    }
    if (!this.formGroup.get('passwordExisting')?.valid || !this.formGroup.get('passwordExisting')?.value) {
      return;
    }

    const email = this.formGroup.get('email')?.value;
    const password = this.formGroup.get('passwordExisting')?.value;

    this.clienteService.insertExistingUser(email, password).subscribe({
      next: () => {
        window.alert('Perfil de cliente cadastrado com sucesso!');// ! make it a toast
        // this.router.navigate(['/']);
        window.location.href = '/';

        // this.carrinhoService.upToDate();
        // window.location.reload();
      },
      error: (err) => {
        console.log('Erro ao se cadastrar :(', err); // ! make it a toast
        this.tratarErrors(err);
      }
    })

  }

  tratarErrors(error: HttpErrorResponse) {
    if (error.status == 400) {
      if (error.error?.errors) {
        error.error.errors.forEach((validationError: any) => {
          if (validationError.fieldName === 'login') {
            this.errorMessage = validationError.message;
            //limpar formulário
            // this.formGroup.reset();
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
    carrinho: {},
    primeiroNome: {
      required: 'Nome obrigatório.',
    },
    email: {
      email: 'E-mail inválido.',
      required: 'E-mail obrigatório.',
      emailTaken: 'E-mail já cadastrado.',
      takenByCliente: 'E-mail já cadastrado por um cliente.',
    },
    senha: {
      required: 'Senha obrigatória.',
      minlength: 'Senha deve ter no mínimo 3 caracteres.',
    },
    confirmarSenha: {
      required: 'Confirmação de senha obrigatória.',
      minlength: 'Confirmação de senha deve ter no mínimo 3 caracteres.',
      passwordMismatch: 'As senhas não coincidem.',
    },
    passwordExisting: {
      minlength: 'Senha deve ter no mínimo 3 caracteres.',
    },
    login: {
      apiError: '',
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
        return 'Proprietário';
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
}
