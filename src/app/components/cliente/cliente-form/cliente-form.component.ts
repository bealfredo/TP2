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
import { Cliente } from '../../../models/cliente.model';
import { ClienteService } from '../../../services/cliente.service';
import {provideNativeDateAdapter} from '@angular/material/core';
import { Endereco } from '../../../models/endereco.model';
import { Cidade } from '../../../models/cidade.model';
import { CidadeService } from '../../../services/cidade.service';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatCardModule, MatToolbarModule, RouterModule, MatSelectModule,
    MatCheckboxModule, CommonModule, MatSlideToggle, MatDatepickerModule],
  templateUrl: './cliente-form.component.html',
  styleUrl: './cliente-form.component.css'
})
export class ClienteFormComponent {

  listaEndereco2 : Endereco[] = []
  cidades : Cidade[] = [];

  formGroup: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private clienteService: ClienteService,
    private cidadeService: CidadeService,
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
      listaEndereco: this.formBuilder.array<FormGroup>([])
    });
  }

  ngOnInit(): void {
    this.initializeForm();
    this.cidadeService.findAll().subscribe(data => {
      this.cidades = data;
    })
  }

  initializeForm(): void {
    const cliente : Cliente = this.activatedRoute.snapshot.data['cliente'];

    const listaEndereco = this.formBuilder.array<FormGroup>([]);
    if (cliente && cliente.listaEndereco) {
      cliente.listaEndereco.forEach(endereco => {
        const novoEndereco = this.formBuilder.group({
          id: [endereco.id],
          nome: [endereco.nome, Validators.required],
          cep: [endereco.cep, Validators.compose([Validators.required, Validators.pattern('^[0-9]{8}$')])],
          rua: [endereco.rua, Validators.required],
          bairro: [endereco.bairro, Validators.required],
          numeroLote: [endereco.numeroLote, Validators.required],
          complemento: [endereco.complemento],
          cidade: [endereco.cidade.id, Validators.required]
        } );

        listaEndereco.push(novoEndereco);
      });
    }

    this.formGroup = this.formBuilder.group({
      id: [(cliente && cliente.id) ? cliente.id : null],
      nome: [(cliente && cliente.nome) ? cliente.nome : '',
      Validators.compose([
        Validators.required,
      ])],
      sobrenome: [(cliente && cliente.sobrenome) ? cliente.sobrenome : '',
      Validators.compose([
        Validators.required,
      ])],
      telefone: this.formBuilder.group({
        ddd: [(cliente && cliente.telefone) ? cliente.telefone.ddd : '',
        Validators.compose([
          // Validators.pattern('^[0-9]{2}$'),
        ])],
        numero: [(cliente && cliente.telefone) ? cliente.telefone.numero : '',
        Validators.compose([
          // Validators.pattern('^[0-9]{9}$'),
        ])]
      }),
      cpf: [(cliente && cliente.cpf) ? cliente.cpf : '',
      Validators.compose([
        Validators.pattern('^[0-9]{11}$'),
      ])],
      dataNascimento: [(cliente && cliente.dataNascimento) ? cliente.dataNascimento : '',
      Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]{4}-[0-9]{2}-[0-9]{2}$'),
      ])],

      listaEndereco: listaEndereco,

      hasTelefone: [(cliente && cliente.telefone != null) ? true : false]
    })


    this.formGroup.get('hasTelefone')?.valueChanges.subscribe((value) => {
      this.updateHasTelefone(value);
    });
    if (this.formGroup.get('hasTelefone')?.value) {
      this.updateHasTelefone(true);
    } else {
      this.updateHasTelefone(false);
    }

    // change to format YYYY-MM-DD
    this.formGroup.get('dataNascimento')?.valueChanges.subscribe((value) => {
      const formatedValue = new Date(value).toISOString().substring(0, 10);
      this.formGroup.get('dataNascimento')?.setValue(formatedValue, {emitEvent: false});
    });
  }

  get listaEnderecos(): FormArray {
    return this.formGroup.get('listaEndereco') as FormArray;
  }

  adicionarEndereco() {
    const novoEndereco = this.formBuilder.group({
      id: [0],
      nome: ['', Validators.required],
      cep: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]{8}$')])],
      rua: ['', Validators.required],
      bairro: ['', Validators.required],
      numeroLote: ['', Validators.required],
      complemento: [''],
      cidade: [null, Validators.required]
    });

    this.listaEnderecos.push(novoEndereco);
  }

  removerEndereco(index: number) {
    this.listaEnderecos.removeAt(index);
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

  salvar() {
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) { return; }

    console.log('formGroup', this.formGroup.value);

    const telefone = this.formGroup.value.hasTelefone ? this.formGroup?.get('telefone')?.value : null;

    // const cliente = this.formGroup.value;
    const cliente = {
      ...this.formGroup.value,
      telefone: telefone
    }

    // const operacao = (cliente.id == null)
    // ? this.clienteService.insert(cliente)
    // : this.clienteService.update(cliente);

    const operacao = this.clienteService.update(cliente);

    operacao.subscribe({
      next: () => {
        this.router.navigateByUrl('/admin/clientes');
      },
      error: (err) => {
        console.log('Erro ao salvar', err);
        this.tratarErrors(err);
      }
    })
  }

  excluir() {
    const cliente = this.formGroup.value;
    if (cliente.id != null) {
      if (!window.confirm('Deseja realmente excluir o cliente?')) {
        return;
      }
      this.clienteService.delete(cliente).subscribe({
        next: () => {
          this.router.navigateByUrl('admin/clientes');
        },
        error: (err) => {
          window.alert('Não foi possível excluir o cliente. Verifique se o mesmo não está associado a uma planta.');
          console.log('Erro ao excluir' + JSON.stringify(err));
        }
      })
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
    'listaEndereco.nome': {
      required: 'O nome do endereço deve ser informado.',
      apiError: ' ' // mensagem da api
    },
    'listaEndereco.cep': {
      required: 'O CEP do endereço deve ser informado.',
      pattern: 'O CEP deve ter 8 números.',
      apiError: ' ' // mensagem da api
    },
    'listaEndereco.rua': {
      required: 'A rua do endereço deve ser informada.',
      apiError: ' ' // mensagem da api
    },
    'listaEndereco.bairro': {
      required: 'O bairro do endereço deve ser informado.',
      apiError: ' ' // mensagem da api
    },
    'listaEndereco.numeroLote': {
      required: 'O número do lote do endereço deve ser informado.',
      apiError: ' ' // mensagem da api
    },
    'listaEndereco.cidade': {
      required: 'A cidade do endereço deve ser informada.',
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

}
