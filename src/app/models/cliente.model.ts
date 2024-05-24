import { Endereco } from "./endereco.model";
import { Telefone } from "./telefone.model";

export class Cliente {
  idTipoPerfil!: number;
  id!: number;
  nome!: string;
  sobrenome!: string;
  email!: string;
  cpf!: string;
  dataNascimento!: string;
  carrinho!: string;
  telefone!: Telefone;
  listaEndereco!: Endereco[];
}
