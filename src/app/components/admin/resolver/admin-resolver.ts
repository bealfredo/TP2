import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Admin } from "../../../models/admin.model";
import { AdminService } from "../../../services/admin.service";

export const adminResolver: ResolveFn<Admin> =
  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return inject(AdminService).findById(route.paramMap.get('id')!);
  }
