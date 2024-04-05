import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { CategoriaPlanta } from "../../../models/categoriaPlanta.model";
import { CategoriaPlantaService } from "../../../services/categoriaPlanta.service";

export const categoriaPlantaResolver: ResolveFn<CategoriaPlanta> =
  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return inject(CategoriaPlantaService).findById(route.paramMap.get('id')!);
  }
