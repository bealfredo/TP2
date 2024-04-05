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
import { Tag } from '../../../models/tag.model';
import { TagService } from '../../../services/tag.service';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { TipoCategoria } from '../../../models/tipoCategoria.model';
import { CommonModule } from '@angular/common';
import { CategoriaPlanta } from '../../../models/categoriaPlanta.model';
import { CategoriaPlantaService } from '../../../services/categoriaPlanta.service';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-tag-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatCardModule, MatToolbarModule, RouterModule, MatSelectModule,
    MatCheckboxModule, CommonModule, MatSlideToggle],
  templateUrl: './tag-form.component.html',
  styleUrl: './tag-form.component.css'
})
export class TagFormComponent {

  formGroup: FormGroup;
  categoriasPlantas: CategoriaPlanta[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private tagService: TagService,
    private catoriaPlantaService: CategoriaPlantaService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.formGroup = formBuilder.group({
      id: [null],
      nome: ['', Validators.required],
      descricao: [''],
      prioridade: [0, Validators.required],
      ativa: [false, Validators.required],
      idCategoriaPlanta: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.catoriaPlantaService.findAll().subscribe(data => {
      this.categoriasPlantas = data;
      this.initializeForm();
    })
  }

  initializeForm(): void {
    const tag : Tag = this.activatedRoute.snapshot.data['tag'];

    const idCategoriaPlanta = tag ? this.categoriasPlantas.find(tipoCategoria => tipoCategoria.id === (tag?.categoriaPlanta.id || null))?.id : null;

    this.formGroup = this.formBuilder.group({
      id: [(tag && tag.id) ? tag.id : null],
      nome: [(tag && tag.nome) ? tag.nome : '',
      Validators.compose([
        Validators.required,
      ])],
      descricao: [(tag && tag.descricao) ? tag.descricao : '',
      Validators.compose([
        Validators.maxLength(400),
      ])],
      prioridade: [(tag && tag.prioridade) ? tag.prioridade : 0,
      Validators.compose([
        Validators.required,
      ])],
      ativa: [(tag && tag.ativa) ? tag.ativa : false,
      Validators.compose([
        Validators.required,
      ])],
      idCategoriaPlanta: [idCategoriaPlanta,
      Validators.compose([
        Validators.required,
      ])]
    })
  }

  getCategoriaPlantaDescription(idTipoCategoria: number): string {
    return this.categoriasPlantas.find(tipoCategoria => tipoCategoria.id === idTipoCategoria)?.descricao || '';
  }


  salvar() {
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) { return; }

    const tag = this.formGroup.value;

    const operacao = (tag.id == null)
    ? this.tagService.insert(tag)
    : this.tagService.update(tag);

    operacao.subscribe({
      next: () => {
        this.router.navigateByUrl('/tags');
      },
      error: (err) => {
        console.log('Erro ao salvar', err);
        this.tratarErrors(err);
      }
    })
  }

  excluir() {
    if (this.formGroup.valid) {
      const tag = this.formGroup.value;
      if (tag.id != null) {
        this.tagService.delete(tag).subscribe({
          next: () => {
            this.router.navigateByUrl('/categoriasplanta');
          },
          error: (err) => {
            window.alert('Não foi possível excluir a categoria de planta. Verifique se ela está sendo utilizada em algum produto.');
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
    idCategoriaPlanta: {
      required: 'A categoria de planta deve ser informada.',
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
