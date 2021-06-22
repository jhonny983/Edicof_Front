import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { User, Role } from 'app/auth/models';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  //public
  public currentUser: Observable<User>;

  //private
  private currentUserSubject: BehaviorSubject<User>;

  /**
   *
   * @param {HttpClient} _http
   * @param {ToastrService} _toastrService
   */
  constructor(private _http: HttpClient, private _toastrService: ToastrService) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // getter: currentUserValue
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  /**
   *  Confirms if user is admin
   */
  get isAdmin() {
    return this.currentUser && this.currentUserSubject.value.role === Role.ADMINISTRADOR;
  }
  /**
   *  Confirms if user is master
   */
    get isMaster() {
      return this.currentUser && this.currentUserSubject.value.role === Role.MASTER;
    }
  /**
   *  Confirms if user is admin
   */
  get isOper() {
    return this.currentUser && this.currentUserSubject.value.role === Role.OPERADOR;
  }
   /**
   *  Confirms if user is admin
   */
    get isCont() {
      return this.currentUser && this.currentUserSubject.value.role === Role.CONTRATISTA;
    }
  /**


  /**
   * User login
   *
   * @param email
   * @param password
   * @returns user
   *///
  login(email: string, password: string) {
    return this._http
      .post<any>(`${environment.apiUrl}/users/singin`, {email, password})//${environment.apiUrl}
      .pipe(
        map(user => {
          // login successful if there's a jwt token in the response
          if (user && user.token) {
            //console.log(user)

            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));

            // Display welcome toast!
            setTimeout(() => {
              this._toastrService.success(
                'You have successfully logged in as an ' +
                  user.role +
                  ' user to Vuexy. Now you can start to explore. Enjoy! 🎉',
                '👋 Welcome, ' + user.firstName + '!',
                { positionClass: 'toast-top-left', toastClass: 'toast ngx-toastr', closeButton: true }
              );
            }, 1500);

            // notify
            this.currentUserSubject.next(user);
          }

          return user;
        })
      );
  }

  /**
   * User logout
   *
   */
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    // notify
    this.currentUserSubject.next(null);
  }

  /**
   * User singup
   * 
   * @param id_usuario
   * @param nombre_1_usuario
   * @param nombre_2_usuario
   * @param apellido_1_usuario
   * @param apellido_2_usuario
   * @param nit
   * @param email
   * @param password
   */
  signup(id_usuario: string, nombre_1_usuario: string, nombre_2_usuario:string, apellido_1_usuario:string, apellido_2_usuario:string, nit:string, email:string, password:string){
    return this._http
    .post<any>(`${environment.apiUrl}/users/singup`, {id_usuario, nombre_1_usuario, nombre_2_usuario, apellido_1_usuario, apellido_2_usuario, nit, email, password})//${environment.apiUrl}
  }

  /**
   * User Send Confirmation Mail
   * 
   * @param email
   */
  send_mail(email: string) {
    return this._http
    .post<any>(`${environment.apiUrl}/users/send`, { email })
    .pipe(
      map(data => {
        return data
      })
    );
}


}
