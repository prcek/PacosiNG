import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {

  }
  checkLogin(url: string): boolean {
    console.log('checkLogin', url);
    if (this.authService.isAuth()) { return true; }
    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url;
    console.log('checkLogin - redirect /login');
    // Navigate to the login page with extras
    this.router.navigate(['/login']);
    return false;
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const url: string = state.url;

    return this.checkLogin(url);
  }
}
