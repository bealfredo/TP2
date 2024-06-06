import { CommonModule, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Admin } from '../../../models/admin.model';
import { AdminService } from '../../../services/admin.service';
import {provideNativeDateAdapter} from '@angular/material/core';
import { Endereco } from '../../../models/endereco.model';
import { Cidade } from '../../../models/cidade.model';
import { CidadeService } from '../../../services/cidade.service';
import { TipoAdmin } from '../../../models/tipoAdmin.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-form',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatCardModule, MatToolbarModule, RouterModule, MatSelectModule,
    MatCheckboxModule, CommonModule, MatSlideToggle, MatDatepickerModule],
  templateUrl: './admin-form.component.html',
  styleUrl: './admin-form.component.css'
})
export class AdminFormComponent {

  admin: Admin | null = null;
  tiposAdmin: TipoAdmin[] = [];

  formGroup: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.formGroup = this.formBuilder.group({
      id: [null],
      nome: ['', Validators.required],
      sobrenome: ['', Validators.required],
      telefone: this.formBuilder.group({
        ddd: ['', [, Validators.pattern('^[0-9]{2}$')]],
        numero: ['', [, Validators.pattern('^[0-9]{9}$')]]
      }),
      cpf: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      hasTelefone: [false],
      idTipoAdmin: [null, Validators.required],
      email : ['', Validators.required],
      senha : ['', Validators.required],
      confirmarSenha : ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.initializeForm();
    this.adminService.tipoAdmin().subscribe(data => {
      this.tiposAdmin = data;
    })
  }

  initializeForm(): void {
    const admin : Admin = this.activatedRoute.snapshot.data['admin'];
    this.admin = admin;

    this.formGroup = this.formBuilder.group({
      id: [(admin && admin.id) ? admin.id : null],
      nome: [(admin && admin.nome) ? admin.nome : '',
      Validators.compose([
        Validators.required,
      ])],
      sobrenome: [(admin && admin.sobrenome) ? admin.sobrenome : '',
      Validators.compose([
        Validators.required,
      ])],
      telefone: this.formBuilder.group({
        ddd: [(admin && admin.telefone) ? admin.telefone.ddd : '',
        Validators.compose([
          // Validators.pattern('^[0-9]{2}$'),
        ])],
        numero: [(admin && admin.telefone) ? admin.telefone.numero : '',
        Validators.compose([
          // Validators.pattern('^[0-9]{9}$'),
        ])]
      }),
      cpf: [(admin && admin.cpf) ? admin.cpf : '',
      Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]{11}$'),
      ])],
      dataNascimento: [(admin && admin.dataNascimento) ? admin.dataNascimento : '',
      Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]{4}-[0-9]{2}-[0-9]{2}$'),
      ])],
      idTipoAdmin: [(admin && admin.tipoAdmin) ? admin.tipoAdmin.id : null,
      Validators.compose([
        Validators.required,
      ])],
      hasTelefone: [(admin && admin.telefone != null) ? true : false],
      email : [(admin && admin.email) ? admin.email : '',
        admin == null &&
        Validators.compose([
          Validators.required,
          Validators.email
        ])],
      senha : [(admin && admin.senha) ? admin.senha : '',
        admin == null &&
        Validators.compose([
          Validators.required,
          Validators.minLength(3)
        ])],
      confirmarSenha : [(admin && admin.senha) ? admin.senha : '',
        admin == null &&
        Validators.compose([
          Validators.required,
          Validators.minLength(3)
        ])]
    })


    this.formGroup.get('hasTelefone')?.valueChanges.subscribe((value) => {
      this.updateHasTelefone(value);
    });
    if (this.formGroup.get('hasTelefone')?.value) {
      this.updateHasTelefone(true);
    } else {
      this.updateHasTelefone(false);
    }

    // email
    if (this.admin) {
      this.formGroup.get('email')?.disable();
    }

    // change to format YYYY-MM-DD
    this.formGroup.get('dataNascimento')?.valueChanges.subscribe((value) => {
      const formatedValue = new Date(value).toISOString().substring(0, 10);
      this.formGroup.get('dataNascimento')?.setValue(formatedValue, {emitEvent: false});
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
        if (value === this.admin?.email) {
          return;
        }

        this.authService.emailavailable(value).subscribe({
          next: (res) => {
            if (res && res.available !== undefined) {
              if (!res.available) {
                this.authService.usuarioTiposPerfilByEmail(value).subscribe({
                  next: (res) => {
                    if (res) {
                      if (res.owner.hasPerfil || res.employee.hasPerfil) {
                        this.formGroup.get('email')?.setErrors({
                          ...this.formGroup.get('email')?.errors,
                          hasTipoPerfil: true,
                          idPerfil: res.owner.hasPerfil ? res.owner.id : res.employee.id
                        })
                      } else if (res.customer.hasPerfil || res.deliveryman.hasPerfil) {
                        this.formGroup.get('email')?.setErrors({
                          ...this.formGroup.get('email')?.errors,
                          emailTaken: true
                        })
                      } else {
                        const errors = this.formGroup.get('email')?.errors;
                        if (errors) {
                          delete errors['hasTipoPerfil'];
                          if (Object.keys(errors).length === 0) {
                            this.formGroup.get('email')?.setErrors(null);
                          } else {
                            this.formGroup.get('email')?.setErrors(errors);
                          }
                        }
                      }
                    }
                  }
                });
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

  getHasTelefone = () => this.formGroup.get('hasTelefone')?.value;

  updateHasTelefone = (value: boolean) => {
    const hasTelefone = value;
    if (hasTelefone) {
      // enable
      this.formGroup.get('telefone')?.get('ddd')?.enable();
      this.formGroup.get('telefone')?.get('numero')?.enable();
      this.formGroup.get('telefone')?.get('ddd')?.setValidators([Validators.required, Validators.pattern('^[0-9]{2}$')]);
      this.formGroup.get('telefone')?.get('numero')?.setValidators([Validators.required, Validators.pattern('^[0-9]{9}$')]);
    } else {
      // disable
      this.formGroup.get('telefone')?.get('ddd')?.disable();
      this.formGroup.get('telefone')?.get('numero')?.disable();
      this.formGroup.get('telefone')?.get('ddd')?.clearValidators();
      this.formGroup.get('telefone')?.get('numero')?.clearValidators();
    }
    this.formGroup.get('telefone')?.get('ddd')?.updateValueAndValidity();
    this.formGroup.get('telefone')?.get('numero')?.updateValueAndValidity();
  }

  formatarCpf(cpf: string): string {
    if (cpf && cpf.length === 11) {
      return `${cpf.substring(0, 3)}.${cpf.substring(3, 6)}.${cpf.substring(6, 9)}-${cpf.substring(9, 11)}`;
    }
    return cpf;
  }

  formatarTelefone(telefone: string): string {
    if (telefone && telefone.length === 11) {
      return `(${telefone.substring(0, 2)}) ${telefone.substring(2, 7)}-${telefone.substring(7, 11)}`;
    }
    return telefone;
  }

  formatarDataNascimento(dataNascimento: string): string {
    if (dataNascimento && dataNascimento.length === 10) {
      return `${dataNascimento.substring(8, 10)}/${dataNascimento.substring(5, 7)}/${dataNascimento.substring(0, 4)}`;
    }
    return dataNascimento;
  }

  getTipoAdminDiscription(idTipoAdmin: number): string {
    const tipoAdmin = this.tiposAdmin.find(tipoAdmin => tipoAdmin.id === idTipoAdmin);
    return tipoAdmin ? tipoAdmin.description : '';
  }

  salvar() {
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) { return; }

    console.log('formGroup', this.formGroup.value);

    const telefone = this.formGroup.value.hasTelefone ? this.formGroup?.get('telefone')?.value : null;

    // const admin = this.formGroup.value;
    const admin = {
      ...this.formGroup.value,
      telefone: telefone
    }

    const operacao = (admin.id == null)
    ? this.adminService.insert(admin)
    : this.adminService.update(admin);

    // const operacao = this.adminService.update(admin);

    operacao.subscribe({
      next: () => {
        this.router.navigateByUrl('/admin/admins');
      },
      error: (err) => {
        console.log('Erro ao salvar', err);
        this.tratarErrors(err);
      }
    })
  }

  excluir() {
    const admin = this.formGroup.value;
    if (admin.id != null) {
      if (!window.confirm('Deseja realmente excluir o admin?')) {
        return;
      }
      this.adminService.delete(admin).subscribe({
        next: () => {
          this.router.navigateByUrl('admin/admins');
        },
        error: (err) => {
          window.alert('Não foi possível excluir o admin. Verifique se o mesmo não está associado a outra entidade.');
          console.log('Erro ao excluir' + JSON.stringify(err));
        }
      })
    }
  }

  criarPerfilAdmin() {
    const email = this.formGroup.get('email')?.value;
    if (email) {
      this.adminService.insertExistingUser(email).subscribe({
        next: (res) => {
          if (res) {
            window.alert('Perfil de administrador criado com sucesso.'); // ! make it a toast
            this.router.navigateByUrl('/admin/admins/edit/' + res.id);
          }
        },
        error: (err) => {
          window.alert('Erro ao criar perfil de administrador.'); // ! make it a toast
          // this.tratarErrors(err);
        }
      });
    }
  }

  tratarErrors(error: HttpErrorResponse) {
    if (error.status == 400) {
      if (error.error?.errors) {
        error.error.errors.forEach((validationError: any) => {
          const formControl = this.formGroup.get(validationError.fieldName);
          if (formControl) {
            // console.log('formControl', formControl)
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
    nome: {
      required: 'O nome deve ser informado.',
      apiError: ' ' // mensagem da api
    },
    sobrenome: {
      required: 'O sobrenome deve ser informado.',
      apiError: ' ' // mensagem da api
    },
    'telefone.ddd': {
      required: 'O DDD deve ser informado.',
      pattern: 'O DDD deve ter 2 números.',
      apiError: ' ' // mensagem da api
    },
    'telefone.numero': {
      required: 'O número deve ser informado.',
      pattern: 'O número deve ter 9 números.',
      apiError: ' ' // mensagem da api
    },
    cpf: {
      required: 'O CPF deve ser informado.',
      pattern: 'O CPF deve ter 11 números.',
      apiError: ' ' // mensagem da api
    },
    dataNascimento: {
      required: 'A data de nascimento deve ser informada.',
      pattern: 'A data de nascimento deve ter o formato MM/DD/AAAA.',
      apiError: ' ' // mensagem da api
    },
    idTipoAdmin: {
      required: 'O tipo de admin deve ser informado.',
      apiError: ' ' // mensagem da api
    },
    email: {
      required: 'O email deve ser informado.',
      email: 'O email deve ser válido.',
      emailTaken: 'O email já está sendo utilizado.',
      hasTipoPerfil: 'O email já possui cadastro como administrador.',
      apiError: ' ' // mensagem da api
    },
    senha: {
      required: 'A senha deve ser informada.',
      minLength: 'A senha deve ter no mínimo 3 caracteres.',
      minlength: 'A senha deve ter no mínimo 3 caracteres.',
      apiError: ' ' // mensagem da api
    },
    confirmarSenha: {
      required: 'A confirmação da senha deve ser informada.',
      minLength: 'A confirmação da senha deve ter no mínimo 3 caracteres.',
      minlength: 'A confirmação da senha deve ter no mínimo 3 caracteres.',
      passwordMismatch: 'As senhas não conferem.',
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

    // não deve ir para o admin
    return 'Erro não mapeado. Verifique o console ou entre em contato com o desenvolvedor.';
  }

}
