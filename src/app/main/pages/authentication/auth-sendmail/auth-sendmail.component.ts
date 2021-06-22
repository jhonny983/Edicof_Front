import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators'
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthenticationService } from 'app/auth/service';
import { CoreConfigService } from '@core/services/config.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'auth-sendmail',
  templateUrl: './auth-sendmail.component.html',
  styleUrls: ['./auth-sendmail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AuthSendMailComponent implements OnInit {
  // Public
  public emailVar;
  public coreConfig: any;
  public forgotPasswordForm: FormGroup;
  public submitted = false;
  public loading = false;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {FormBuilder} _formBuilder
   *
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
    return this.forgotPasswordForm.controls;
  }

  /**
   * On Submit
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    //Send mail
    this.loading = true;
    this._authenticationService
      .send_mail(this.f.email.value)
      .pipe(first())
      .subscribe((data) => {
        console.log(data)
        Swal.fire({
          icon: 'success',
          title: 'Correo de verificación enviado!',
          text: data.user.NOMBRE_USUARIO+' '+data.user.APELLIDO_USUARIO +' a tu cuenta de correo hemos enviado un mensaje de confirmacion de identidad, revisalo y continua la verificacion para disfrutar de nuestro portal',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        });
        this._router.navigate(['/']);
      },(error) => {
        this.loading = false
      })
      


  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.forgotPasswordForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });

    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });
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
