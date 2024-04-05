import { NivelDificuldade } from "./NivelDificuldade.model";
import { NivelToxicidade } from "./NivelToxicidade.model";
import { PortePlanta } from "./PortePlanta.model";
import { StatusPlanta } from "./StatusPlanta.model";
import { CategoriaPlanta } from "./categoriaPlanta.model";
import { Fornecedor } from "./fornecedor.model";
import { Tag } from "./tag.model";
import { TipoCategoria } from "./tipoCategoria.model";

export class Planta {
    id!: number;
    nomeComum!: string;
    nomeCientifico!: string;
    descricao!: string;
    codigo!: string;
    imagemPrincipal!: string;
    imagens!: string[];
    precoVenda!: number;
    precoCusto!: number;
    desconto!: number;
    quantidadeDisponivel!: number;
    quantidadeVendido!: number;
    origem!: string;
    tempoCrescimento!: string;
    statusPlanta!: StatusPlanta;
    nivelDificuldade!: NivelDificuldade;
    nivelToxidade!: NivelToxicidade;
    portePlanta!: PortePlanta;
    tags!: Tag[];
    fornecedor!: Fornecedor;
    categoriaPlanta!: CategoriaPlanta;
}

export class PlantaUpdateQuantidade {
  quantidade!: number;
}

export class PlantaUpdateStatusPlanta {
  idStatus!: number;
}


// public record PlantaResponseDTO(

//   Long id,
//   String nomeComum,
//   String nomeCientifico,
//   String descricao,
//   String codigo,
//   String imagemPrincipal,
//   String[] imagens,
//   Double precoVenda,
//   Double precoCusto,
//   Double desconto,
//   Integer quantidadeDisponivel,
//   Integer quantidadeVendido,
//   String origem,
//   String tempoCrescimento,
//   StatusPlanta statusPlanta,
//   NivelDificuldade nivelDificuldade,
//   NivelToxidade nivelToxidade,
//   PortePlanta portePlanta,
//   List<TagResponseDTO> tags,
//   FornecedorResponseDTO fornecedor,
//   CategoriaPlantaResponseDTO categoriaPlanta
