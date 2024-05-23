import { Telefone } from "./telefone.model";

export class Entregador {
  id!: number;
  nome!: string;
  sobrenome!: string;
  email!: string;
  cpf!: string;
  dataNascimento!: string;
  telefone!: Telefone;
  cnh!: string;
  cnpj!: string;
}
