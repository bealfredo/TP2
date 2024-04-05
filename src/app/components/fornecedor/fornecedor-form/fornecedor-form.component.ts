import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Fornecedor } from '../../../models/fornecedor.model';
import { FornecedorService } from '../../../services/fornecedor.service';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { TipoCategoria } from '../../../models/tipoCategoria.model';
import { CommonModule } from '@angular/common';
import { CategoriaPlanta } from '../../../models/categoriaPlanta.model';
import { CategoriaPlantaService } from '../../../services/categoriaPlanta.service';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-fornecedor-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatCardModule, MatToolbarModule, RouterModule, MatSelectModule,
    MatCheckboxModule, CommonModule, MatSlideToggle],
  templateUrl: './fornecedor-form.component.html',
  styleUrl: './fornecedor-form.component.css'
})
export class FornecedorFormComponent {

  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private fornecedorService: FornecedorService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.formGroup = formBuilder.group({
      id: [null],
      nome: ['', Validators.required],
      email: [''],
      telefone: ['2'],
      cnpj: ['']
    });
  }

  ngOnInit(): void {
    this.fornecedorService.findAll().subscribe(data => {
      this.initializeForm();
    })
  }

  initializeForm(): void {
    const fornecedor : Fornecedor = this.activatedRoute.snapshot.data['fornecedor'];

    this.formGroup = this.formBuilder.group({
      id: [(fornecedor && fornecedor.id) ? fornecedor.id : null],
      nome: [(fornecedor && fornecedor.nome) ? fornecedor.nome : '',
      Validators.compose([
        Validators.required,
      ])],
      email: [(fornecedor && fornecedor.email) ? fornecedor.email : '',
      Validators.compose([
        Validators.email,
      ])],
      telefone: [(fornecedor && fornecedor.telefone) ? fornecedor.telefone : '',
      Validators.compose([
        Validators.pattern('^[0-9]{11}$'),
      ])],
      cnpj: [(fornecedor && fornecedor.cnpj) ? fornecedor.cnpj : '',
      Validators.compose([
        Validators.pattern('^[0-9]{14}$'),
      ])]
    })
  }

  formatarCnpj(cnpj: string): string {
    if (cnpj && cnpj.length === 14) {
      return `${cnpj.substring(0, 2)}.${cnpj.substring(2, 5)}.${cnpj.substring(5, 8)}/${cnpj.substring(8, 12)}-${cnpj.substring(12, 14)}`;
    }
    return cnpj;
  }

  formatarTelefone(telefone: string): string {
    if (telefone && telefone.length === 11) {
      return `(${telefone.substring(0, 2)}) ${telefone.substring(2, 7)}-${telefone.substring(7, 11)}`;
    }
    return telefone;
  }

  salvar() {
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) { return; }

    const fornecedor = this.formGroup.value;

    const operacao = (fornecedor.id == null)
    ? this.fornecedorService.insert(fornecedor)
    : this.fornecedorService.update(fornecedor);

    operacao.subscribe({
      next: () => {
        this.router.navigateByUrl('/fornecedores');
      },
      error: (err) => {
        console.log('Erro ao salvar', err);
        this.tratarErrors(err);
      }
    })
  }

  excluir() {
    if (this.formGroup.valid) {
      const fornecedor = this.formGroup.value;
      if (fornecedor.id != null) {
        this.fornecedorService.delete(fornecedor).subscribe({
          next: () => {
            this.router.navigateByUrl('/fornecedores');
          },
          error: (err) => {
            window.alert('Não foi possível excluir o fornecedor. Verifique se o mesmo não está associado a uma planta.');
            console.log('Erro ao excluir' + JSON.stringify(err));
          }
        })
      }
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
    email: {
      email: 'E-mail inválido.',
      apiError: ' ' // mensagem da api
    },
    telefone: {
      pattern: 'Telefone inválido. Deve ter 11 dígitos. (Apenas números.)',
      apiError: ' ' // mensagem da api
    },
    cnpj: {
      pattern: 'CNPJ inválido. Deve ter 14 dígitos. (Apenas números.)',
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
