import { AsyncPipe, NgIf } from '@angular/common';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Planta } from '../../../models/planta.model';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { TipoCategoria } from '../../../models/tipoCategoria.model';
import { CommonModule } from '@angular/common';
import { CategoriaPlanta } from '../../../models/categoriaPlanta.model';
import { CategoriaPlantaService } from '../../../services/categoriaPlanta.service';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { PlantaService } from '../../../services/Planta.service';
import { StatusPlanta } from '../../../models/StatusPlanta.model';
import { NivelDificuldade } from '../../../models/NivelDificuldade.model';
import { NivelToxicidade } from '../../../models/NivelToxicidade.model';
import { PortePlanta } from '../../../models/PortePlanta.model';
import { FornecedorService } from '../../../services/fornecedor.service';
import { Fornecedor } from '../../../models/fornecedor.model';
import {MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import {MatAutocompleteSelectedEvent, MatAutocompleteModule} from '@angular/material/autocomplete';
import { Observable } from 'rxjs';




@Component({
  selector: 'app-planta-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatCardModule, MatToolbarModule, RouterModule, MatSelectModule,
    MatCheckboxModule, CommonModule, MatSlideToggle, MatChipsModule, FormsModule, MatIconModule, MatAutocompleteModule, AsyncPipe],
  templateUrl: './plantaRascunho-form.component.html',
  styleUrl: './plantaRascunho-form.component.css'
})
export class PlantaRascunhoFormComponent {

  formGroup: FormGroup;
  categoriasPlantas: CategoriaPlanta[] = [];
  fornecedores: Fornecedor[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private plantaService: PlantaService,
    private catoriaPlantaService: CategoriaPlantaService,
    private fornecedorService: FornecedorService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.formGroup = formBuilder.group({
      id: [null],
      nomeComum: ['', Validators.required],
      idFornecedor: [null],
      idCategoriaBiologica: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.catoriaPlantaService.findAll().subscribe(data => {
      this.categoriasPlantas = data;
    })
    this.fornecedorService.findAll().subscribe(data => {
      this.fornecedores = data;
    })
    this.initializeForm();
  }

  initializeForm(): void {
    const planta : Planta = this.activatedRoute.snapshot.data['planta'];

    // const idCategoriaBiologica = this.categoriasPlantas.find(categoria => categoria.id === planta.categoriaPlanta.id)?.id;
    const idCategoriaBiologica = planta && planta.categoriaPlanta ? planta.categoriaPlanta.id : null;
    const idStatusPlanta = planta && planta.statusPlanta ? planta.statusPlanta.id: null;
    const idNivelDificuldade = planta && planta.nivelDificuldade? planta.nivelDificuldade.id : null;
    const idNivelToxidade = planta && planta.nivelToxidade ? planta.nivelToxidade.id: null;
    const idPortePlanta = planta && planta.portePlanta ?  planta.portePlanta.id: null;
    const idFornecedor = planta  && planta.fornecedor ? planta.fornecedor.id: null;

    this.formGroup = this.formBuilder.group({
      id: [(planta && planta.id) ? planta.id : null],
      nomeComum: [(planta && planta.nomeComum) ? planta.nomeComum : '',
      Validators.compose([
        Validators.required,
      ])],
      idFornecedor: [idFornecedor,
        Validators.compose([
          Validators.required,
      ])],
      idCategoriaBiologica: [idCategoriaBiologica,
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

    const planta = this.formGroup.value;

    const operacao = (planta.id == null)
    ? this.plantaService.insert(planta)
    : this.plantaService.update(planta);



    operacao.subscribe({
      next: (plantaSalva: Planta) => {
        this.router.navigateByUrl(`/plantas/edit/${plantaSalva.id}`);
      },
      error: (err) => {
        console.log('Erro ao salvar', err);
        this.tratarErrors(err);
      }
    })
  }

  excluir() {
    if (this.formGroup.valid) {
      const planta = this.formGroup.value;
      if (planta.id != null) {
        this.plantaService.delete(planta).subscribe({
          next: () => {
            this.router.navigateByUrl('/plantas');
          },
          error: (err) => {
            window.alert('Não foi possível excluir a planta.');
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

    nomeComum: {
      required: 'O nome comum deve ser informado.',
      apiError: ' ' // mensagem da api
    },

    idFornecedor: {
      required: 'O fornecedor deve ser informado.',
      apiError: ' ' // mensagem da api
    },
    categoriaBiologica: {
      required: 'A categoria biológica deve ser informada.',
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


// aaaaa
