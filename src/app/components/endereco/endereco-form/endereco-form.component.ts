import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { EnderecoService } from '../../../services/endereco.service';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { Endereco } from '../../../models/endereco.model';
import { NgIf } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HttpErrorResponse } from '@angular/common/http';
import { Cidade } from '../../../models/cidade.model';
import { CidadeService } from '../../../services/cidade.service';
import { Estado } from '../../../models/estado.model';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-endereco-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatCardModule, MatToolbarModule, RouterModule, MatSelectModule],
  templateUrl: './endereco-form.component.html',
  styleUrl: './endereco-form.component.css'
})
export class EnderecoFormComponent {

  formGroup: FormGroup;
  enderecos: Endereco[] = [];
  cidades: Cidade[] = [];
  estados: Estado[] = [];
  

  constructor(
    private formBuilder: FormBuilder,
    private enderecoService: EnderecoService,
    private cidadeService: CidadeService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {

    const endereco: Endereco = activatedRoute.snapshot.data['endereco'];

    this.formGroup = formBuilder.group({
      id: [(endereco && endereco.id) ? endereco.id : null],
      nome: [(endereco && endereco.nome) ? endereco.nome : '',
      Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-Z ]$/)
      ])],
      cep: [(endereco && endereco.cep) ? endereco.cep : '',
      Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(8),
        Validators.pattern(/^[0-9]{9}$/)
      ])],
      codigo: [(endereco && endereco.codigo) ? endereco.codigo : '',
      Validators.compose([
        Validators.required,
        Validators.pattern(/^[0-9]$/)
      ])],
      rua: [(endereco && endereco.rua) ? endereco.rua : '',
      Validators.compose([
        Validators.required,
        Validators.minLength(2)
      ])],
      bairro: [(endereco && endereco.bairro) ? endereco.bairro : '',
      Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-Z ]{2}$/)
      ])],
      numeroLote: [(endereco && endereco.numeroLote) ? endereco.numeroLote : '',
      Validators.compose([
        Validators.required,
        Validators.maxLength(5),
        Validators.pattern(/^[0-9]$/)
      ])],
      cidade: [(endereco && endereco.cidade) ? endereco.cidade : '',
      Validators.compose([
        Validators.required,
      ])],
      estado: [(endereco && endereco.cidade.estado) ? endereco.cidade.estado : '',
      Validators.compose([
        Validators.required,
      ])],
    })
  }

  ngOnInit(): void {
    this.cidadeService.findAll().subscribe(data => {
      this.cidades = data;
      this.initializeForm();
    })
  }

  initializeForm(): void {
    const endereco : Endereco = this.activatedRoute.snapshot.data['endereco'];

    // selecionando o cidade
    const cidade = endereco ? this.cidades.find(cidade => cidade.id === (endereco?.cidade.id || null))?.id : null;
    const estado  = endereco.cidade ? this.estados.find(estado => estado.id === (endereco?.cidade.estado.id || null))?.id : null;
    /*const idCategoriaPlanta = tag ? this.categoriasPlantas.find
    (tipoCategoria => tipoCategoria.id === (tag?.categoriaPlanta.id || null))?.id : null;*/
    this.formGroup = this.formBuilder.group({
      id: [(endereco && endereco.id) ? endereco.id : null],
      nome: [(endereco && endereco.nome) ? endereco.nome : '', Validators.required],
      cep: [(endereco && endereco.cep) ? endereco.cep : '', Validators.required],
      codigo: [(endereco && endereco.codigo) ? endereco.codigo : '', Validators.required],
      rua: [(endereco && endereco.rua) ? endereco.rua : '', Validators.required],
      bairro: [(endereco && endereco.bairro) ? endereco.bairro : '', Validators.required],
      numeroLote: [(endereco && endereco.numeroLote) ? endereco.numeroLote : '', Validators.required],
      cidade: [cidade],
      estado: [estado]
      
    })
  }
  
  salvar() {
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) { return; }

    const endereco = this.formGroup.value;

    const operacao = (endereco.id == null)
    ? this.enderecoService.insert(endereco)
    : this.enderecoService.update(endereco);

    operacao.subscribe({
      next: () => {
        this.router.navigateByUrl('/enderecos');
      },
      error: (err) => {
        console.log('Erro ao salvar', err);
        this.tratarErrors(err);
      }
    })
  }

  excluir() {
    if (this.formGroup.valid) {
      const endereco = this.formGroup.value;
      if (endereco.id != null) {
        this.enderecoService.delete(endereco).subscribe({
          next: () => {
            this.router.navigateByUrl('/enderecos');
          },
          error: (err) => {
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
    ddad: {
      required: 'O ddad deve ser informado.',
      pattern: 'O ddad deve conter apenas numeros',
      apiError: ' ' // mensagem da api
    },
    numero: {
      required: 'A numero deve ser informado.',
      minlength: 'O numero deve ter 9 caracteres.',
      maxlength: 'O numero deve ter 9 caracteres.',
      pattern: 'O numero deve conter apenas numeros',
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
