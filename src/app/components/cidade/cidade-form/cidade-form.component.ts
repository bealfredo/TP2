import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
      estado: [null]
    });



    // const cidade: Cidade = activatedRoute.snapshot.data['cidade'];

    // this.formGroup = formBuilder.group({
    //   id: [(cidade && cidade.id) ? cidade.id : null],
    //   nome: [(cidade && cidade.nome) ? cidade.nome : '', Validators.required],
    //   estado: [(cidade && cidade.estado) ? cidade.estado : '', Validators.required]
    // })
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
    const estado = this.estados.find(estado => estado.id === (cidade?.estado.id || null))

    this.formGroup = this.formBuilder.group({
      id: [(cidade && cidade.id) ? cidade.id : null],
      nome: [(cidade && cidade.nome) ? cidade.nome : '', Validators.required],
      estado: [estado]
    })
  }

  salvar() {
    console.log('o que vai salvar? princesa?',this.formGroup.value)
    if (this.formGroup.valid) {
      const cidade = this.formGroup.value;
      if (cidade.id == null) {
        this.cidadeService.insert(cidade).subscribe({
          next: (cidadeCadastrada) => {
            this.router.navigateByUrl('/cidades');
          },
          error: (err) => {
            console.log('Erro ao incluir' + JSON.stringify(err));
          }
        })
      } else {
        this.cidadeService.update(cidade).subscribe({
          next: (cidadeAlterada) => {
            this.router.navigateByUrl('/cidades');
          },
          error: (err) => {
            console.log('Erro ao editar' + JSON.stringify(err));
          }
        })
      }
    } else {
      console.log("Estado errado essa cidadezinhazinha", this.formGroup.value)
    }
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

}
