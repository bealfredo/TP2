import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Planta } from '../../models/planta.model';
import { PlantaService } from '../../services/Planta.service';

@Component({
  selector: 'app-minhas-compras',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatCardModule, MatToolbarModule, RouterModule, MatSelectModule,
    MatCheckboxModule, CommonModule, MatSlideToggle, MatDatepickerModule, MatExpansionModule],
  templateUrl: './minhas-compras.component.html',
  styleUrl: './minhas-compras.component.css'
})
export class MinhasComprasComponent {

  // listaEndereco2 : Endereco[] = []
  // cidades : Cidade[] = [];
  noImageUrl = './../../../../assets/images/plantanoimage.png'
  minhasCompras: any;

  constructor(
    // private formBuilder: FormBuilder,
    // private clienteService: ClienteService,
    // private cidadeService: CidadeService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private plantaService: PlantaService
  ) {
  }

  ngOnInit(): void {
    // this.initializeForm();
    // this.cidadeService.findAll().subscribe(data => {
    //   this.cidades = data;
    // })
    this.minhasCompras = this.activatedRoute.snapshot.data['minhascompras'];
    console.log(this.minhasCompras);

  }

  getUrlImagem(planta: Planta, imagem : string): string {
    return this.plantaService.getUrlImagem(planta, imagem);
  }

  formatedDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }

  formatarCep(cep: string): string {
    return cep.replace(/^(\d{5})(\d{3})/, '$1-$2');
  }

}
