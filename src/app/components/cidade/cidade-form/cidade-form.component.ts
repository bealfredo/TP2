import { CommonModule, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Cidade } from '../../../models/cidade.model';
import { CidadeService } from '../../../services/cidade.service';
import { Estado } from '../../../models/estado.model';
import { EstadoService } from '../../../services/estado.service';

@Component({
  selector: 'app-cidade-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatCardModule, MatToolbarModule, RouterModule, MatSelectModule,
    MatCheckboxModule, CommonModule, MatSlideToggle],
  templateUrl: './cidade-form.component.html',
  styleUrl: './cidade-form.component.css'
})
export class CidadeFormComponent {

  formGroup: FormGroup;
  estados: Estado[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private cidadeService: CidadeService,
    private estadoService: EstadoService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.formGroup = formBuilder.group({
      id: [null],
      nome: ['', Validators.required],
      estado: [null, Validators.required],
      frete: [0, Validators.required]
    });
  }

  ngOnInit(): void {
    this.estadoService.findAll().subscribe(data => {
      this.estados = data;
      this.initializeForm();
    })
  }

  initializeForm(): void {
    const cidade : Cidade = this.activatedRoute.snapshot.data['cidade'];

    const idEstado = cidade?.estado?.id || null;

    this.formGroup = this.formBuilder.group({
      id: [(cidade && cidade.id) ? cidade.id : null],
      nome: [(cidade && cidade.nome) ? cidade.nome : '',
      Validators.compose([
        Validators.required,
      ])],
      estado: [idEstado,
      Validators.compose([
        Validators.required,
      ])],
      frete: [(cidade && cidade.frete) ? cidade.frete : 0,
      Validators.compose([
        Validators.required,
        Validators.min(0),
      ])]
    })
  }

  salvar() {
    console.log('formGroup', this.formGroup);
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) { return; }

    const cidade = this.formGroup.value;

    const operacao = (cidade.id == null)
    ? this.cidadeService.insert(cidade)
    : this.cidadeService.update(cidade);

    operacao.subscribe({
      next: () => {
        this.router.navigateByUrl('/admin/cidades');
      },
      error: (err) => {
        console.log('Erro ao salvar', err);
        this.tratarErrors(err);
      }
    })
  }

  excluir() {
      const cidade = this.formGroup.value;
      if (cidade.id != null) {
        if (!window.confirm('Confirma a exclusão da cidade?')) { // ! make better
          return;
        }
        this.cidadeService.delete(cidade).subscribe({
          next: () => {
            this.router.navigateByUrl('/admin/cidades');
          },
          error: (err) => {
            window.alert('Não foi possível excluir a cidade. Verifique se ela não está associada a outra entidade.');
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
    estado: {
      required: 'O estado deve ser informado.',
      apiError: ' ' // mensagem da api
    },
    frete: {
      required: 'O frete deve ser informado.',
      min: 'O frete deve ser maior ou igual a 0.',
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
