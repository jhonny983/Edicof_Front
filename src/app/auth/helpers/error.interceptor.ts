import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthenticationService } from 'app/auth/service';
import { first } from 'rxjs/operators'

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  /**
   * @param {Router} _router
   * @param {AuthenticationService} _authenticationService
   */
  constructor(private _router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(err => {
        /* ERRORS AUTHENCICATION SINGUP
        */
        /*if ([460, 461, 462, 463, 464].indexOf(err.status) !== -1) {
          Swal.fire({
            icon: 'error',
            title: 'Error de Registro!!',
            text: err.error.message,
            customClass: {
              confirmButton: 'btn btn-success'
            }
          });
        }*/
        /* ERRORS AUTHENCICATION SINGIN
        */
        if ([465].indexOf(err.status) !== -1) {
          this._router.navigate(['/pages/authentication/sendmail']);
          Swal.fire({
            icon: 'error',
            title: err.error.tittle,
            text: err.error.message,
            customClass: {
              confirmButton: 'btn btn-success',
            }
          });
        }else{
          Swal.fire({
            icon: 'error',
            title: err.error.tittle,
            text: err.error.message,
            customClass: {
              confirmButton: 'btn btn-success',
            }
          });
        }




        if ([401, 403].indexOf(err.status) !== -1) {
          // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
          this._router.navigate(['/pages/miscellaneous/not-authorized']);

          // ? Can also logout and reload if needed
          // this._authenticationService.logout();
          // location.reload(true);
        }
        // throwError
        const error = err.error.message || err.statusText;
        return throwError(error);
      })
    );
  }
  
}
