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
import { TagService } from '../../../services/tag.service';
import { Tag } from '../../../models/tag.model';


@Component({
  selector: 'app-planta-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatCardModule, MatToolbarModule, RouterModule, MatSelectModule,
    MatCheckboxModule, CommonModule, MatSlideToggle, MatChipsModule, FormsModule, MatIconModule, MatAutocompleteModule, AsyncPipe],
  templateUrl: './planta-form.component.html',
  styleUrl: './planta-form.component.css'
})
export class PlantaFormComponent {

  formGroup: FormGroup;
  categoriasPlantas: CategoriaPlanta[] = [];
  statusPlantas: StatusPlanta[] = [];
  nivelDificuldades: NivelDificuldade[] = [];
  nivelToxicidades: NivelToxicidade[] = [];
  portePlantas: PortePlanta[] = [];
  fornecedores: Fornecedor[] = [];
  tags: Tag[] = [];

  tagsSelected: Tag[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private plantaService: PlantaService,
    private catoriaPlantaService: CategoriaPlantaService,
    private fornecedorService: FornecedorService,
    private tagsService: TagService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.formGroup = formBuilder.group({
      id: [null],
      nomeComum: ['', Validators.required],
      nomeCientifico: [''],
      descricao: [''],
      codigo: [''],
      // imagemPrincipal: [''],
      // imagens: [''],
      precoVenda: [0, Validators.required],
      precoCusto: [0, Validators.required],
      desconto: [0, Validators.required],
      quantidadeDisponivel: [0, Validators.required],
      // quantidadeVendido: [0, Validators.required],
      origem: [''],
      tempoCrescimento: [''],
      idStatusPlanta: [null, Validators.required],
      nivelDificuldade: [null, Validators.required],
      nivelToxidade: [null, Validators.required],
      portePlanta: [null, Validators.required],
      idsTags: [[]],
      idFornecedor: [null],
      idCategoriaBiologica: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.catoriaPlantaService.findAll().subscribe(data => {
      this.categoriasPlantas = data;
    })
    this.plantaService.listAllStatusPlanta().subscribe(data => {
      this.statusPlantas = data;
    })
    this.plantaService.listAllNivelDificuldade().subscribe(data => {
      this.nivelDificuldades = data;
    })
    this.plantaService.listAllNivelToxicidade().subscribe(data => {
      this.nivelToxicidades = data;
    })
    this.plantaService.listAllPortePlanta().subscribe(data => {
      this.portePlantas = data;
    })
    this.fornecedorService.findAll().subscribe(data => {
      this.fornecedores = data;
    })
    this.tagsService.findAll().subscribe(data => {
      this.tags = data;
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
      nomeCientifico: [(planta && planta.nomeCientifico) ? planta.nomeCientifico : '',
      Validators.compose([
        // Validators.required,
      ])],
      descricao: [(planta && planta.descricao) ? planta.descricao : '',
      Validators.compose([
        Validators.maxLength(400),
      ])],
      codigo: [(planta && planta.codigo) ? planta.codigo : '',
      Validators.compose([
        Validators.required,
      ])],
      precoVenda: [(planta && planta.precoVenda) ? planta.precoVenda : 0,
      Validators.compose([
        Validators.required,
        Validators.min(0),
      ])],
      precoCusto: [(planta && planta.precoCusto) ? planta.precoCusto : 0,
        Validators.compose([
          Validators.required,
          Validators.min(0),
      ])],
      desconto: [(planta && planta.desconto) ? planta.desconto : 0,
        Validators.compose([
          Validators.required,
          Validators.min(0),
      ])],
      quantidadeDisponivel: [(planta && planta.quantidadeDisponivel) ? planta.quantidadeDisponivel : 0,
        Validators.compose([
          Validators.required,
          Validators.min(0),
      ])],
      // quantidadeVendido: [(planta && planta.quantidadeVendido) ? planta.quantidadeVendido : 0,
      //   Validators.compose([
      //     Validators.required,
      //     Validators.min(0),
      // ])],
      origem: [(planta && planta.origem) ? planta.origem : '',
        Validators.compose([
          // Validators.required,
      ])],
      tempoCrescimento: [(planta && planta.tempoCrescimento) ? planta.tempoCrescimento : '',
        Validators.compose([
          // Validators.required,
      ])],
      idStatusPlanta: [idStatusPlanta,
        Validators.compose([
          Validators.required,
      ])],
      nivelDificuldade: [idNivelDificuldade,
        Validators.compose([
          Validators.required,
      ])],
      nivelToxidade: [idNivelToxidade,
        Validators.compose([
          Validators.required,
      ])],
      portePlanta: [idPortePlanta,
        Validators.compose([
          Validators.required,
      ])],
      idsTags: [(planta && planta.tags) ? planta.tags : []],
      // idFornecedor: [idFornecedor,]
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

  getStatusPlantaDescription(idStatusPlanta: number): string {
    return this.statusPlantas.find(statusPlanta => statusPlanta.id === idStatusPlanta)?.description || '';
  }

  getNivelDificuldadeDescription(idNivelDificuldade: number): string {
    return this.nivelDificuldades.find(nivelDificuldade => nivelDificuldade.id === idNivelDificuldade)?.description || '';
  }

  getNivelToxicidadeDescription(idNivelToxicidade: number): string {
    return this.nivelToxicidades.find(nivelToxicidade => nivelToxicidade.id === idNivelToxicidade)?.description || '';
  }

  getPortePlantaDescription(idPortePlanta: number): string {
    return this.portePlantas.find(portePlanta => portePlanta.id === idPortePlanta)?.description || '';
  }

  getTagDescription(idTag: number): string {
    return this.tags.find(tag => tag.id === idTag)?.descricao || '';
  }


  salvar() {
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) { return; }

    const planta = this.formGroup.value;

    const idsTags = planta.idsTags.map((tag: any) => tag.id);

    planta.idsTags = idsTags;

    const operacao = (planta.id == null)
    ? this.plantaService.insert(planta)
    : this.plantaService.update(planta);



    operacao.subscribe({
      next: () => {
        this.router.navigateByUrl('/plantas');
      },
      error: (err) => {
        console.log('Erro ao salvar', err);
        this.tratarErrors(err);
      }
    })
  }

  excluir() {
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
    nomeCientifico: {
      required: 'O nome científico deve ser informado.',
      apiError: ' ' // mensagem da api
    },
    descricao: {
      maxlength: 'A descrição deve ter no máximo 400 caracteres.',
      apiError: ' ' // mensagem da api
    },
    codigo: {
      required: 'O código deve ser informado.',
      apiError: ' ' // mensagem da api
    },
    precoVenda: {
      required: 'O preço de venda deve ser informado.',
      min: 'O preço de venda deve ser maior ou igual a zero.',
      apiError: ' ' // mensagem da api
    },
    precoCusto: {
      required: 'O preço de custo deve ser informado.',
      min: 'O preço de custo deve ser maior ou igual a zero.',
      apiError: ' ' // mensagem da api
    },
    desconto: {
      required: 'O desconto deve ser informado.',
      min: 'O desconto deve ser maior ou igual a zero.',
      apiError: ' ' // mensagem da api
    },
    quantidadeDisponivel: {
      required: 'A quantidade disponível deve ser informada.',
      min: 'A quantidade disponível deve ser maior ou igual a zero.',
      apiError: ' ' // mensagem da api
    },
    // quantidadeVendido: {
    //   required: 'A quantidade vendida deve ser informada.',
    //   apiError: ' ' // mensagem da api
    // },
    origem: {
      // required: 'A origem deve ser informada.',
      apiError: ' ' // mensagem da api
    },
    tempoCrescimento: {
      // required: 'O tempo de crescimento deve ser informado.',
      apiError: ' ' // mensagem da api
    },
    idStatusPlanta: {
      required: 'O status da planta deve ser informado.',
      apiError: ' ' // mensagem da api
    },
    nivelDificuldade: {
      required: 'O nível de dificuldade deve ser informado.',
      apiError: ' ' // mensagem da api
    },
    nivelToxidade: {
      required: 'O nível de toxicidade deve ser informado.',
      apiError: ' ' // mensagem da api
    },
    portePlanta: {
      required: 'O porte da planta deve ser informado.',
      apiError: ' ' // mensagem da api
    },
    idsTags: {
      // required: 'As tags devem ser informadas.',
      apiError: ' ' // mensagem da api
    },
    idFornecedor: {
      // required: 'O fornecedor deve ser informado.',
      apiError: ' ' // mensagem da api
    },
    idCategoriaBiologica: {
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
