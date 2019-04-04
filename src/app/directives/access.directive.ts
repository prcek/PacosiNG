import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { AuthService, IUserInfo } from '../auth.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appAccess]'
})
export class AccessDirective implements OnInit, OnDestroy {
  private hasView = false;
  private role: string;
  private user: IUserInfo;
  private userSubs: Subscription;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private auth: AuthService) { }

  ngOnInit(): void {
    this.user = this.auth.userInfo;
    this.userSubs = this.auth.userInfo$.subscribe({
      next: (v) => { this.user = v; /*console.log('AccessDirective new user', v);*/ this._update(); }
    });
    this._update();
  }
  ngOnDestroy(): void {
    this.userSubs.unsubscribe();
  }

  _update() {
    const condition = !!(this.user) && this.user.roles.includes(this.role);
    // console.log('AccessDirective._update', condition, this.user, this.role);
    if (condition && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!condition && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }

  @Input() set appAccess(role: string) {
      // console.log('AccessDirective:', role);
      this.role = role;
      this._update();
  }
}
