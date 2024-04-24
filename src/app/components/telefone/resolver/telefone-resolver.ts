import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Telefone } from "../../../models/telefone.model";
import { inject } from "@angular/core";
import { TelefoneService } from "../../../services/telefone.service";

export const telefoneResolver: ResolveFn<Telefone> =
  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return inject(TelefoneService).findById(route.paramMap.get('id')!);
  }
