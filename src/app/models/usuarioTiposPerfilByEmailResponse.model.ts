export class UsuarioTiposPerfilByEmailResponse {
  email!: string;
  owner!: perfil;
  employee!: perfil;
  customer!: perfil;
  deliveryman!: perfil;
}

class perfil {
  id!: number;
  hasPerfil!: boolean;
}
