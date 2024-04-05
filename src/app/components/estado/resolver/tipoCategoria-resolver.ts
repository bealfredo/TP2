import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { CategoriaPlanta } from "../../../models/categoriaPlanta.model";
import { CategoriaPlantaService } from "../../../services/categoriaPlanta.service";
import { TipoCategoria } from "../../../models/tipoCategoria.model";

export const tipoCategoriaResolver: ResolveFn<TipoCategoria[]> =
  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return inject(CategoriaPlantaService).listAllTipoCategoria();
  }
