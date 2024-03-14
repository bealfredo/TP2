import { Routes } from '@angular/router';
import { EstadoListComponent } from './components/estado/estado-list/estado-list.component';
import { EstadoFormComponent } from './components/estado/estado-form/estado-form.component';
import { estadoResolver } from './components/estado/resolver/estado-resolver';
import { CidadeListComponent } from './components/cidade/cidade-list/cidade-list.component';
import { CidadeFormComponent } from './components/cidade/cidade-form/cidade-form.component';
import { cidadeResolver } from './components/cidade/resolver/cidade-resolver';

export const routes: Routes = [
    { path: 'estados', component: EstadoListComponent, title: 'Lista de Estados'},
    { path: 'estados/new', component: EstadoFormComponent, title: 'Novo Estado'},
    { path: 'estados/edit/:id', component: EstadoFormComponent, resolve:{estado: estadoResolver}, title: "Editar Estado"},

    { path: 'cidades', component: CidadeListComponent, title: 'Lista de Cidades'},
    { path: 'cidades/new', component: CidadeFormComponent, title: 'Nova Cidade'},
    { path: 'cidades/edit/:id', component: CidadeFormComponent, resolve:{cidade: cidadeResolver}, title: "Editar Cidade"},

];
