import { TipoCategoria } from "./tipoCategoria.model";

export class CategoriaPlanta {
    id!: number;
    nome!: string;
    descricao!: string;
    prioridade!: number;
    ativa!: boolean;
    tipoCategoria!: TipoCategoria;
}

export class CategoriaPlantaUpdateAtiva {
  ativa!: boolean;
}

