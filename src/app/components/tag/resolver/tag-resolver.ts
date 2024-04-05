import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Tag } from "../../../models/tag.model";
import { TagService } from "../../../services/tag.service";

export const tagResolver: ResolveFn<Tag> =
  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return inject(TagService).findById(route.paramMap.get('id')!);
  }
