import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { TelefoneService } from '../../../services/telefone.service';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { Telefone } from '../../../models/telefone.model';
import { NgIf } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-telefone-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatCardModule, MatToolbarModule, RouterModule],
  templateUrl: './telefone-form.component.html',
  styleUrl: './telefone-form.component.css'
})
export class TelefoneFormComponent {

  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private telefoneService: TelefoneService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {

    const telefone: Telefone = activatedRoute.snapshot.data['telefone'];

    this.formGroup = formBuilder.group({
      id: [(telefone && telefone.id) ? telefone.id : null],
      ddd: [(telefone && telefone.ddd) ? telefone.ddd : '',
      Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(2),
        Validators.pattern(/^[0-9]{2}$/)
      ])],
      numero: [(telefone && telefone.numero) ? telefone.numero : '',
      Validators.compose([
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(9),
        Validators.pattern(/^[0-9]{9}$/)
      ])],
    })
  }

  salvar() {
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) { return; }

    const telefone = this.formGroup.value;

    const operacao = (telefone.id == null)
    ? this.telefoneService.insert(telefone)
    : this.telefoneService.update(telefone);

    operacao.subscribe({
      next: () => {
        this.router.navigateByUrl('/telefones');
      },
      error: (err) => {
        console.log('Erro ao salvar', err);
        this.tratarErrors(err);
      }
    })
  }

  excluir() {
    if (this.formGroup.valid) {
      const telefone = this.formGroup.value;
      if (telefone.id != null) {
        this.telefoneService.delete(telefone).subscribe({
          next: () => {
            this.router.navigateByUrl('/telefones');
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
    ddd: {
      required: 'O ddd deve ser informado.',
      minlength: 'O ddd deve ter 2 caracteres.',
      maxlength: 'O ddd deve ter 2 caracteres.',
      pattern: 'O ddd deve conter apenas numeros',
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
