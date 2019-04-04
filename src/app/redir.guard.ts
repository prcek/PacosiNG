import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class RedirGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // console.log('REDIRECT GUARD');
    if (!this.authService.isAuth()) {
      console.log('REDIRECT GUARD - NO AUTH!');
      this.router.navigate(['/login']);
      return false;
    }
    // const url: string = state.
    if (next.routeConfig.path === 'main') {
      if (next.paramMap.has('cals')) {
        return true;
      } else {
        const pref_loc_id = this.authService.getUserData('pref_loc_id', null);
        if (pref_loc_id) {
          this.router.navigate(['/main', {cals: this.authService.userInfo.calendar_ids, pref_loc_id}]);
        } else {
          this.router.navigate(['/main', {cals: this.authService.userInfo.calendar_ids}]);
        }
        return false;
      }
    }

    if (next.routeConfig.path === 'plan') {
      if (next.paramMap.has('cals')) {
        return true;
      } else {
        const pref_loc_id = this.authService.getUserData('pref_loc_id', null);
        if (pref_loc_id) {
          this.router.navigate(['/plan', {cals: this.authService.userInfo.calendar_ids, pref_loc_id}]);
        } else {
          this.router.navigate(['/plan', {cals: this.authService.userInfo.calendar_ids}]);
        }
        return false;
      }
    }

    return true;
  }
}
