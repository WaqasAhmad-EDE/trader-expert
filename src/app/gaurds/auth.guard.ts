import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private router: Router
  ) {
  }
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree | any> {


    const res = await this.userService.getUser()
    if (res?.id) {
      if (!res?.isAdmin) {
        return true
      }
    }
    this.router.navigateByUrl('/');
    return false

  }
}
