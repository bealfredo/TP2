import { Routes } from '@angular/router';
import { EstadoListComponent } from './components/estado/estado-list/estado-list.component';
import { EstadoFormComponent } from './components/estado/estado-form/estado-form.component';
import { TelefoneListComponent } from './components/telefone/telefone-list/telefone-list.component';
import { TelefoneFormComponent } from './components/telefone/telefone-form/telefone-form.component';
import { estadoResolver } from './components/estado/resolver/estado-resolver';
import { CidadeListComponent } from './components/cidade/cidade-list/cidade-list.component';
import { CidadeFormComponent } from './components/cidade/cidade-form/cidade-form.component';
import { cidadeResolver } from './components/cidade/resolver/cidade-resolver';
import { CategoriaPlantaListComponent } from './components/categoriaPlanta/categoriaPlanta-list/categoriaPlanta-list.component';
import { CategoriaPlantaFormComponent } from './components/categoriaPlanta/categoriaPlanta-form/categoriaPlanta-form.component';
import { categoriaPlantaResolver } from './components/categoriaPlanta/resolver/categoriaPlanta-resolver';
import { tagResolver } from './components/tag/resolver/tag-resolver';
import { TagFormComponent } from './components/tag/tag-form/tag-form.component';
import { TagListComponent } from './components/tag/tag-list/tag-list.component';
import { FornecedorListComponent } from './components/fornecedor/fornecedor-list/fornecedor-list.component';
import { FornecedorFormComponent } from './components/fornecedor/fornecedor-form/fornecedor-form.component';
import { fornecedorResolver } from './components/fornecedor/resolver/fornecedor-resolver';
import { telefoneResolver } from './components/telefone/resolver/telefone-resolver';
import { PlantaListComponent } from './components/planta/planta-list/planta-list.component';
import { PlantaFormComponent } from './components/planta/planta-form/planta-form.component';
import { plantaResolver } from './components/planta/resolver/planta-resolver';
import { PlantaRascunhoFormComponent } from './components/planta/plantaRascunho-form/plantaRascunho-form.component';
import { LoginComponent } from './components/login/login.component';
import { ClienteTemplateComponent } from './components/template/cliente-template/cliente-template.component';
import { AdminTemplateComponent } from './components/template/admin-template/admin-template.component';
import { authGuard } from './guard/auth.guard';
import { DesconectedComponent } from './components/errorPages/desconected/desconected.component';
import { UnauthorizedComponent } from './components/errorPages/unauthorized/unauthorized.component';
import { ClienteListComponent } from './components/cliente/cliente-list/cliente-list.component';
import { Cliente } from './models/cliente.model';
import { ClienteFormComponent } from './components/cliente/cliente-form/cliente-form.component';
import { clienteResolver } from './components/cliente/resolver/cliente-resolver';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, title: 'Login'},

  { path: 'desconected', component: DesconectedComponent, title: 'Desconectado'},

  { path: 'unauthorized', component: UnauthorizedComponent, title: 'Não autorizado'},


  {
    path: '',
    component: ClienteTemplateComponent,
    children: [
      {path: '', pathMatch: 'full', redirectTo: ''},
      {path: 'plantas', component: PlantaListComponent, title: 'Lista de Plantas'},
    ]
  },
  {
    path: 'admin',
    component: AdminTemplateComponent,
    children: [
      { path: 'estados', component: EstadoListComponent, title: 'Lista de Estados'},
      { path: 'estados/new', component: EstadoFormComponent, title: 'Novo Estado'},
      { path: 'estados/edit/:id', component: EstadoFormComponent, resolve:{estado: estadoResolver}, title: "Editar Estado"},

      { path: 'cidades', component: CidadeListComponent, title: 'Lista de Cidades'},
      { path: 'cidades/new', component: CidadeFormComponent, title: 'Nova Cidade'},
      { path: 'cidades/edit/:id', component: CidadeFormComponent, resolve:{cidade: cidadeResolver}, title: "Editar Cidade"},

      { path: 'categoriasplanta', component: CategoriaPlantaListComponent, title: 'Lista de Categorias de Plantas', canActivate: [authGuard]},
      { path: 'categoriasplanta/new', component: CategoriaPlantaFormComponent, title: 'Nova Categoria de Planta', canActivate: [authGuard]},
      { path: 'categoriasplanta/edit/:id', component: CategoriaPlantaFormComponent, resolve:{categoriaPlanta: categoriaPlantaResolver}, title: 'Editar Categoria de Planta'},

      { path: 'tags', component: TagListComponent, title: 'Lista de Tags'},
      { path: 'tags/new', component: TagFormComponent, title: 'Nova Tag'},
      { path: 'tags/edit/:id', component: TagFormComponent, resolve:{tag: tagResolver}, title: 'Editar Tag'},

      { path: 'fornecedores', component: FornecedorListComponent, title: 'Lista de Fornecedores'},
      { path: 'fornecedores/new', component: FornecedorFormComponent, title: 'Novo Fornecedor'},
      { path: 'fornecedores/edit/:id', component: FornecedorFormComponent, resolve:{fornecedor: fornecedorResolver}, title: 'Editar Fornecedor'},

      { path: 'telefones', component: TelefoneListComponent, title: 'Lista de Telefones'},
      { path: 'telefones/new', component: TelefoneFormComponent, title: 'Novo Telefone'},
      { path: 'telefones/edit/:id', component: TelefoneFormComponent, resolve:{telefone: telefoneResolver}, title: "Editar Telefone"},

      { path: 'plantas', component: PlantaListComponent, title: 'Lista de Plantas'},
      { path: 'plantas/new', component: PlantaRascunhoFormComponent, title: 'Nova Planta'},
      { path: 'plantas/edit/:id', component: PlantaFormComponent, resolve:{planta: plantaResolver}, title: 'Editar Planta'},

      { path: 'clientes', component: ClienteListComponent, title: 'Lista de Clientes'},
      { path: 'clientes/edit/:id', component: ClienteFormComponent, resolve:{cliente: clienteResolver}, title: 'Editar Cliente'},
    ]
  }
];
