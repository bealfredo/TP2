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
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-estado-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatCardModule, MatToolbarModule, RouterModule],
  templateUrl: './estado-form.component.html',
  styleUrl: './estado-form.component.css'
})
export class EstadoFormComponent {

  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private estadoService: EstadoService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {

    const estado: Estado = activatedRoute.snapshot.data['estado'];

    this.formGroup = formBuilder.group({
      id: [(estado && estado.id) ? estado.id : null],
      nome: [(estado && estado.nome) ? estado.nome : '',
      Validators.compose([
        Validators.required,
        Validators.minLength(4)
      ])],
      sigla: [(estado && estado.sigla) ? estado.sigla : '',
      Validators.compose([
        Validators.required,
        Validators.pattern(/^[a-zA-Z]{2}$/)
      ])],
    })
  }

  salvar() {
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) { return; }

    const estado = this.formGroup.value;

    const operacao = (estado.id == null)
    ? this.estadoService.insert(estado)
    : this.estadoService.update(estado);

    operacao.subscribe({
      next: () => {
        this.router.navigateByUrl('/estados');
      },
      error: (err) => {
        console.log('Erro ao salvar', err);
        this.tratarErrors(err);
      }
    })
  }

  excluir() {
    if (this.formGroup.valid) {
      const estado = this.formGroup.value;
      if (estado.id != null) {
        this.estadoService.delete(estado).subscribe({
          next: () => {
            this.router.navigateByUrl('/estados');
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
    nome: {
      required: 'O nome deve ser informado.',
      minlength: 'O nome deve ter no mínimo 4 caracteres.',
      apiError: ' ' // mensagem da api
    },
    sigla: {
      required: 'A sigla deve ser informado.',
      pattern: 'A sigla deve possuir exatamente 2 letras.',
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
