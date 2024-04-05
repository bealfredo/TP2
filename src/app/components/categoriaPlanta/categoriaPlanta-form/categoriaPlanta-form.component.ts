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
import { CategoriaPlanta } from '../../../models/categoriaPlanta.model';
import { CategoriaPlantaService } from '../../../services/categoriaPlanta.service';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { TipoCategoria } from '../../../models/tipoCategoria.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categoriaPlanta-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatCardModule, MatToolbarModule, RouterModule, MatSelectModule,
    MatCheckboxModule, CommonModule],
  templateUrl: './categoriaPlanta-form.component.html',
  styleUrl: './categoriaPlanta-form.component.css'
})
export class CategoriaPlantaFormComponent {

  formGroup: FormGroup;
  tiposCategoria: TipoCategoria[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private categoriaplantaService: CategoriaPlantaService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.formGroup = formBuilder.group({
      id: [null],
      nome: ['', Validators.required],
      descricao: [''],
      prioridade: [0, Validators.required],
      ativa: [false, Validators.required],
      idTipoCategoria: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.categoriaplantaService.listAllTipoCategoria().subscribe(data => {
      this.tiposCategoria = data;
      this.initializeForm();
    })
  }

  initializeForm(): void {
    const categoriaPlanta : CategoriaPlanta = this.activatedRoute.snapshot.data['categoriaPlanta'];

    const idTipoCategoria = categoriaPlanta ? this.tiposCategoria.find(tipoCategoria => tipoCategoria.id === (categoriaPlanta?.tipoCategoria.id || null))?.id : null;

    this.formGroup = this.formBuilder.group({
      id: [(categoriaPlanta && categoriaPlanta.id) ? categoriaPlanta.id : null],
      nome: [(categoriaPlanta && categoriaPlanta.nome) ? categoriaPlanta.nome : '',
      Validators.compose([
        Validators.required,
        // Validators.minLength(4)
      ])],
      descricao: [(categoriaPlanta && categoriaPlanta.descricao) ? categoriaPlanta.descricao : '',
      Validators.compose([
        Validators.maxLength(400),
      ])],
      prioridade: [(categoriaPlanta && categoriaPlanta.prioridade) ? categoriaPlanta.prioridade : 0,
      Validators.compose([
        Validators.required,
      ])],
      ativa: [(categoriaPlanta && categoriaPlanta.ativa) ? categoriaPlanta.ativa : false,
      Validators.compose([
        Validators.required,
      ])],
      idTipoCategoria: [idTipoCategoria,
      Validators.compose([
        Validators.required,
      ])]
    })
  }

  getTipoCategoriaDescription(idTipoCategoria: number): string {
    return this.tiposCategoria.find(tipoCategoria => tipoCategoria.id === idTipoCategoria)?.description || '';
  }


  salvar() {
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) { return; }

    const categoriaplanta = this.formGroup.value;

    const operacao = (categoriaplanta.id == null)
    ? this.categoriaplantaService.insert(categoriaplanta)
    : this.categoriaplantaService.update(categoriaplanta);

    operacao.subscribe({
      next: () => {
        this.router.navigateByUrl('/categoriasplanta');
      },
      error: (err) => {
        console.log('Erro ao salvar', err);
        this.tratarErrors(err);
      }
    })
  }

  excluir() {
    if (this.formGroup.valid) {
      const categoriaplanta = this.formGroup.value;
      if (categoriaplanta.id != null) {
        this.categoriaplantaService.delete(categoriaplanta).subscribe({
          next: () => {
            this.router.navigateByUrl('/categoriasplanta');
          },
          error: (err) => {
            window.alert('Não foi possível excluir a categoria de planta. Verifique se ela está sendo utilizada em alguma planta ou tag.');
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
    descricao: {
      maxlength: 'A descrição deve ter no máximo 400 caracteres.',
      apiError: ' ' // mensagem da api
    },
    prioridade: {
      required: 'A prioridade deve ser informada.',
      apiError: ' ' // mensagem da api
    },
    ativa: {
      required: 'Deve ser informado se a categoria está ativa ou não.',
      apiError: ' ' // mensagem da api
    },
    idTipoCategoria: {
      required: 'O tipo de categoria deve ser informado.',
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
