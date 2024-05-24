import { TipoAdmin } from "./TipoAdmin.model";
import { Telefone } from "./telefone.model";

export class Admin {
  idTipoPerfil!: number;
  id!: number;
  nome!: string;
  sobrenome!: string;
  email!: string;
  cpf!: string;
  dataNascimento!: string;
  telefone!: Telefone;
  tipoAdmin!: TipoAdmin;
}
