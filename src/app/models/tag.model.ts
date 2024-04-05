import { CategoriaPlanta } from "./categoriaPlanta.model";
import { TipoCategoria } from "./tipoCategoria.model";

export class Tag {
    id!: number;
    nome!: string;
    descricao!: string;
    prioridade!: number;
    ativa!: boolean;
    categoriaPlanta!: CategoriaPlanta;
}

export class TagUpdateAtiva {
  ativa!: boolean;
}

