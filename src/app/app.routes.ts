import { Routes } from '@angular/router';
import { EstadoListComponent } from './components/estado/estado-list/estado-list.component';
import { EstadoFormComponent } from './components/estado/estado-form/estado-form.component';
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

export const routes: Routes = [
    { path: 'estados', component: EstadoListComponent, title: 'Lista de Estados'},
    { path: 'estados/new', component: EstadoFormComponent, title: 'Novo Estado'},
    { path: 'estados/edit/:id', component: EstadoFormComponent, resolve:{estado: estadoResolver}, title: "Editar Estado"},

    { path: 'cidades', component: CidadeListComponent, title: 'Lista de Cidades'},
    { path: 'cidades/new', component: CidadeFormComponent, title: 'Nova Cidade'},
    { path: 'cidades/edit/:id', component: CidadeFormComponent, resolve:{cidade: cidadeResolver}, title: "Editar Cidade"},

    { path: 'categoriasplanta', component: CategoriaPlantaListComponent, title: 'Lista de Categorias de Plantas'},
    { path: 'categoriasplanta/new', component: CategoriaPlantaFormComponent, title: 'Nova Categoria de Planta'},
    { path: 'categoriasplanta/edit/:id', component: CategoriaPlantaFormComponent, resolve:{categoriaPlanta: categoriaPlantaResolver}, title: 'Editar Categoria de Planta'},

    { path: 'tags', component: TagListComponent, title: 'Lista de Tags'},
    { path: 'tags/new', component: TagFormComponent, title: 'Nova Tag'},
    { path: 'tags/edit/:id', component: TagFormComponent, resolve:{tag: tagResolver}, title: 'Editar Tag'},

];
