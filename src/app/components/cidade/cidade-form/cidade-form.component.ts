import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { EstadoService } from '../../../services/estado.service';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { Estado } from '../../../models/estado.model';
import { NgIf } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CidadeService } from '../../../services/cidade.service';
import { Cidade } from '../../../models/cidade.model';
import {MatSelectModule} from '@angular/material/select';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-cidade-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatCardModule, MatToolbarModule, RouterModule, MatSelectModule],
  templateUrl: './cidade-form.component.html',
  styleUrl: './cidade-form.component.css'
})
export class CidadeFormComponent {

  formGroup: FormGroup;
  estados: Estado[] = [];
  cidades: Cidade[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private cidadeService: CidadeService,
    private estadoService: EstadoService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {

    const cidade: Cidade = activatedRoute.snapshot.data['cidade'];

    this.formGroup = formBuilder.group({
      id: [(cidade && cidade.id) ? cidade.id : null],
      nome: [(cidade && cidade.nome) ? cidade.nome : '',
      Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.pattern(/^[a-zA-Z ]$/)
      ])],
      estado: [(cidade && cidade.estado) ? cidade.estado : '',
      Validators.compose([
        Validators.required
      ])],
      frete: [(cidade && cidade.frete) ? cidade.frete : 0,
      Validators.compose([
        Validators.required,
        Validators.min(0)
      ])],
    })

    this.formGroup = formBuilder.group({
      id: [(cidade && cidade.id) ? cidade.id : null],
      nome: [(cidade && cidade.nome) ? cidade.nome : '', Validators.required],
      estado: [(cidade && cidade.estado) ? cidade.estado : '', Validators.required],
      frete: [(cidade && cidade.frete) ? cidade.frete : 0]
    })
  }

  // busca dos estados
  ngOnInit(): void {
    this.estadoService.findAll().subscribe(data => {
      this.estados = data;
      this.initializeForm();
    })
  }

  initializeForm(): void {
    const cidade : Cidade = this.activatedRoute.snapshot.data['cidade'];

    // selecionando o estado
    const estado  = cidade ? this.estados.find(estado => estado.id === (cidade?.estado.id || null))?.id : null;
    /*const idCategoriaPlanta = tag ? this.categoriasPlantas.find
    (tipoCategoria => tipoCategoria.id === (tag?.categoriaPlanta.id || null))?.id : null;*/
    this.formGroup = this.formBuilder.group({
      id: [(cidade && cidade.id) ? cidade.id : null],
      nome: [(cidade && cidade.nome) ? cidade.nome : '', Validators.required],
      estado: [estado],
      frete: [(cidade && cidade.frete) ? cidade.frete : 0]
    })
  }

  salvar() {
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) { return; }

    const cidade = this.formGroup.value;

    const operacao = (cidade.id == null)
    ? this.cidadeService.insert(cidade)
    : this.cidadeService.update(cidade);

    operacao.subscribe({
      next: () => {
        this.router.navigateByUrl('/cidades');
      },
      error: (err) => {
        console.log('Erro ao salvar', err);
        this.tratarErrors(err);
      }
    })
  }

  excluir() {
    if (this.formGroup.valid) {
      const cidade = this.formGroup.value;
      if (cidade.id != null) {
        this.cidadeService.delete(cidade).subscribe({
          next: () => {
            this.router.navigateByUrl('/cidades');
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
            console.log('formControl', formControl)
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
      minlength: 'O nome deve ter no mínimo 4 caracteres.',
      apiError: ' ' // mensagem da api
    },
    estado: {
      required: 'O estado deve ser informado.',
      apiError: ' ' // mensagem da api
    },
    frete: {
      required: 'O frete deve ser informado.',
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
