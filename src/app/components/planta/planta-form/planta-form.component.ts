import { AsyncPipe, NgIf } from '@angular/common';

import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NivelDificuldade } from '../../../models/NivelDificuldade.model';
import { NivelToxicidade } from '../../../models/NivelToxicidade.model';
import { PortePlanta } from '../../../models/PortePlanta.model';
import { StatusPlanta } from '../../../models/StatusPlanta.model';
import { CategoriaPlanta } from '../../../models/categoriaPlanta.model';
import { Fornecedor } from '../../../models/fornecedor.model';
import { Planta } from '../../../models/planta.model';
import { Tag } from '../../../models/tag.model';
import { PlantaService } from '../../../services/Planta.service';
import { CategoriaPlantaService } from '../../../services/categoriaPlanta.service';
import { FornecedorService } from '../../../services/fornecedor.service';
import { TagService } from '../../../services/tag.service';


@Component({
  selector: 'app-planta-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatCardModule, MatToolbarModule, RouterModule, MatSelectModule,
    MatCheckboxModule, CommonModule, MatSlideToggle, MatChipsModule, FormsModule, MatIconModule, MatAutocompleteModule, AsyncPipe,
    MatExpansionModule],
  templateUrl: './planta-form.component.html',
  styleUrl: './planta-form.component.css'
})
export class PlantaFormComponent {

  planta: Planta | null = null;

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

    // abrir em dados da planta se tiver configurado a planta pela primeira vez
    this.step = this.planta?.codigo ? 0 : 2;

    // fast changes
    this.selectedStatusPlanta = this.planta?.statusPlanta.id || 0;
  }

  initializeForm(): void {
    this.planta = this.activatedRoute.snapshot.data['planta'];

    // const idCategoriaBiologica = this.categoriasPlantas.find(categoria => categoria.id === planta.categoriaPlanta.id)?.id;
    const idCategoriaBiologica = this.planta && this.planta.categoriaPlanta ? this.planta.categoriaPlanta.id : null;
    const idStatusPlanta = this.planta && this.planta.statusPlanta ? this.planta.statusPlanta.id: null;
    const idNivelDificuldade = this.planta && this.planta.nivelDificuldade? this.planta.nivelDificuldade.id : null;
    const idNivelToxidade = this.planta && this.planta.nivelToxidade ? this.planta.nivelToxidade.id: null;
    const idPortePlanta = this.planta && this.planta.portePlanta ?  this.planta.portePlanta.id: null;
    const idFornecedor = this.planta  && this.planta.fornecedor ? this.planta.fornecedor.id: null;

    this.formGroup = this.formBuilder.group({
      id: [(this.planta && this.planta.id) ? this.planta.id : null],
      nomeComum: [(this.planta && this.planta.nomeComum) ? this.planta.nomeComum : '',
      Validators.compose([
        Validators.required,
      ])],
      nomeCientifico: [(this.planta && this.planta.nomeCientifico) ? this.planta.nomeCientifico : '',
      Validators.compose([
        // Validators.required,
      ])],
      descricao: [(this.planta && this.planta.descricao) ? this.planta.descricao : '',
      Validators.compose([
        Validators.maxLength(400),
      ])],
      codigo: [(this.planta && this.planta.codigo) ? this.planta.codigo : '',
      Validators.compose([
        Validators.required,
      ])],
      precoVenda: [(this.planta && this.planta.precoVenda) ? this.planta.precoVenda : 0,
      Validators.compose([
        Validators.required,
        Validators.min(0),
      ])],
      precoCusto: [(this.planta && this.planta.precoCusto) ? this.planta.precoCusto : 0,
        Validators.compose([
          Validators.required,
          Validators.min(0),
      ])],
      desconto: [(this.planta && this.planta.desconto) ? (this.planta.desconto * 100) : 0,
        Validators.compose([
          Validators.required,
          Validators.min(0),
          Validators.max(100),
      ])],
      quantidadeDisponivel: [(this.planta && this.planta.quantidadeDisponivel) ? this.planta.quantidadeDisponivel : 0,
        Validators.compose([
          Validators.required,
          Validators.min(0),
      ])],
      // quantidadeVendido: [(planta && planta.quantidadeVendido) ? planta.quantidadeVendido : 0,
      //   Validators.compose([
      //     Validators.required,
      //     Validators.min(0),
      // ])],
      origem: [(this.planta && this.planta.origem) ? this.planta.origem : '',
        Validators.compose([
          // Validators.required,
      ])],
      tempoCrescimento: [(this.planta && this.planta.tempoCrescimento) ? this.planta.tempoCrescimento : '',
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
      idsTags: [(this.planta && this.planta.tags) ? this.planta.tags : []],
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

    planta.desconto = planta.desconto / 100;

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

  // imagens

  getUrlImagem(imagem: string): string {
    if (!this.planta) { return ''; }

    return this.plantaService.getUrlImagem(this.planta, imagem);
  }

  trackByImagens(index: number, image: any): any {
    console.log(this.planta)
    return image ? image.id : undefined;
  }

  private reloadPlanta(): void {
    if (this.planta) {
      this.plantaService.findById(this.planta.id.toString())
        .subscribe({
          next: (planta) => {
            this.planta = planta;
          },
          error: (err) => {
            console.log('Erro ao recarregar a planta', err);
          }
        });
    }
  }

  uploadImagem(event: any) {
    const file2upload = event.target.files[0];

    if (file2upload) {
      this.plantaService.uploadImagem(this.planta?.id as number, file2upload)
      .subscribe({
        next: () => {
          // ! make a toast and send loading
          window.alert('Imagem enviada com sucesso');
          this.reloadPlanta();
        },
        error: err => {
          // ! make a toast
          console.log('Erro ao fazer o upload da imagem', err);
          window.alert('Erro ao fazer o upload da imagem: ' + err.error.errors[0].message);
          // tratar o erro
        }
      })
    }
  }

  deleteImagem(nomeImagem: string) {
    if (!this.planta) { return; }

    this.plantaService.deleteImagem(this.planta.id, nomeImagem)
    .subscribe({
      next: () => {
        // ! make a toast and send loading
        window.alert('Imagem excluída com sucesso');
        this.reloadPlanta();
      },
      error: err => {
        // ! make a toast
        console.log('Erro ao excluir a imagem', err);
        window.alert('Erro ao excluir a imagem' );
        // tratar o erro
      }
    })
  }

  setImagemPrincipal(nomeImagem: string) {
    if (!this.planta) { return; }

    this.plantaService.setImagemPrincipal(this.planta.id, nomeImagem)
    .subscribe({
      next: () => {
        // ! make a toast and send loading
        window.alert('Imagem principal alterada com sucesso');
        this.reloadPlanta();
      },
      error: err => {
        // ! make a toast
        console.log('Erro ao alterar a imagem principal', err);
        window.alert('Erro ao alterar a imagem principal' );
        // tratar o erro
      }
    })
  }

  // expanded
  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  // fast changes

  selectedStatusPlanta = 0;

  trackById(index: number, item: any): number {
    return item.id;
  }

  updateStatusPlanta(event: any) {
    if (!this.planta) { return; }

    const dto = { idStatus: event.value};

    this.plantaService.updateStatusplanta(dto, this.planta.id)
    .subscribe({
      next: () => {
        // ! make a toast and send loading
        window.alert('Status da planta alterado com sucesso');
        this.reloadPlanta();
      },
      error: err => {
        // ! make a toast
        console.log('Erro ao alterar o status da planta', err);
        window.alert('Erro ao alterar o status da planta' );
        this.selectedStatusPlanta = this.planta?.statusPlanta.id || 0;
        // tratar o erro
      }
    })
  }

  @ViewChild('addRemoveQuantidadeInput') addRemoveQuantidadeInput!: ElementRef;

  updateQuantidade(type: 'add' | 'remove') {
    if (!this.planta) { return; }

    const value = this.addRemoveQuantidadeInput.nativeElement.value;

    if (!value) { return; }

    const quantidade = parseInt(type === 'add' ? value : '-' + value);
    const dto = { quantidade };

    this.plantaService.updateQuantidade(dto, this.planta.id)
    .subscribe({
      next: () => {
        // ! make a toast and send loading
        window.alert('Quantidade da planta alterada com sucesso');
        this.reloadPlanta();
        // clear input
        this.addRemoveQuantidadeInput.nativeElement.value = '';
      },
      error: err => {
        // ! make a toast
        console.log('Erro ao alterar a quantidade da planta', err);
        window.alert('Erro ao alterar a quantidade da planta' );
        // tratar o erro
      }
    })
  }

  quantidadeToRemoveIsOk() {
    if (!this.planta) { return false; }
    if (!this.addRemoveQuantidadeInput) { return false; }

    const value = this.addRemoveQuantidadeInput.nativeElement.value;

    return value > 0 && value <= this.planta.quantidadeDisponivel;
  }

  quantidadeToAddIsOk() {
    if (!this.planta) { return false; }
    if (!this.addRemoveQuantidadeInput) { return false; }

    const value = this.addRemoveQuantidadeInput.nativeElement.value;

    return value > 0;
  }


}
