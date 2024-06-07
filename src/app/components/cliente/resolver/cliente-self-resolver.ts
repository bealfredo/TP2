import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Cliente } from "../../../models/cliente.model";
import { ClienteService } from "../../../services/cliente.service";

export const clienteSelfResolver: ResolveFn<Cliente> =
  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return inject(ClienteService).findByToken();
  }
