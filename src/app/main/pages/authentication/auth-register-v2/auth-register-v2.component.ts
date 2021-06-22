import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { CoreConfigService } from '@core/services/config.service';
import { first } from 'rxjs/operators'
import { AuthenticationService } from 'app/auth/service';

@Component({
  selector: 'app-auth-register-v2',
  templateUrl: './auth-register-v2.component.html',
  styleUrls: ['./auth-register-v2.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AuthRegisterV2Component implements OnInit {
  // Public
  public coreConfig: any;
  public passwordTextType: boolean;
  public registerForm: FormGroup;
  public submitted = false;
  public error = '';
  public returnUrl: string;
  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {FormBuilder} _formBuilder
   */
  constructor(private _coreConfigService: CoreConfigService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _authenticationService: AuthenticationService) {
    this._unsubscribeAll = new Subject();

    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        menu: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        customizer: false,
        enableLocalStorage: false
      }
    };
    


  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  /**
   * Toggle password
   */
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  /**
   * On Submit
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    // Signup
    this._authenticationService
      .signup(this.f.id.value, this.f.username1.value, this.f.username2.value, this.f.userlastname1.value, this.f.userlastname2.value, this.f.nit.value, this.f.email.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this._router.navigate([this.returnUrl])
        },
        error => {
          this.error = error
          
        }
      )

    // redirect to home page
    setTimeout(() => {
      this._router.navigate(['/']);
    }, 100);

  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.registerForm = this._formBuilder.group({
      id: ['',[Validators.pattern('^[0-9]+$'),Validators.required, Validators.minLength(7)]],
      username1: ['', [Validators.pattern('^[A-Za-z]+$'), Validators.required, Validators.minLength(3)]],
      username2: ['', [Validators.pattern('^[A-Za-z]+$'), Validators.minLength(3)]],
      userlastname1: ['', [Validators.pattern('^[A-Za-z]+$'), Validators.required, Validators.minLength(3)]],
      userlastname2: ['', [Validators.pattern('^[A-Za-z]+$'), Validators.minLength(3)]],
      nit: ['',[Validators.pattern('^[0-9]+$'),Validators.required, Validators.minLength(7)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.pattern('^[A-Za-z0-9]+$'),Validators.required,Validators.minLength(6)]],
      politica: [false, [Validators.requiredTrue]]
    });

    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });

    this.registerForm.controls['id'].setValue("123456789");
    this.registerForm.controls['username1'].setValue("Johnnatan");
    this.registerForm.controls['username2'].setValue("");
    this.registerForm.controls['userlastname1'].setValue("Mera");
    this.registerForm.controls['userlastname2'].setValue("Morales");
    this.registerForm.controls['nit'].setValue("900750998");
    this.registerForm.controls['email'].setValue("jhonny983@gmail.com");
    this.registerForm.controls['password'].setValue("123456");
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
