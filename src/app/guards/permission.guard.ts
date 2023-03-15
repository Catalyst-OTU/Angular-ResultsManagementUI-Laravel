import { Inject, Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { IAuthService } from '../interfaces/auth-service';
import { IRoutePermission } from '../interfaces/route-permission';
import { LOGIN_SERVICE, ROUTE_PERMISSION } from '../utils/injectables';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {

  constructor(
    @Inject(ROUTE_PERMISSION)private routesConfig: IRoutePermission,
    @Inject(LOGIN_SERVICE) private auth: IAuthService){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

       return true; //TODO: remove this from permission guard
      let route = state.url.split('/').pop();
      const allowed = this.routesConfig.getPermissionsForRoute(route);
      return this.auth.loggedInUser.permission.some(p => allowed.includes(p));
  }

}
