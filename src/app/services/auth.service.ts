import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
// import { ApiService } from './api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../services/common.service';

@Injectable({
  providedIn: 'root',
})



export class AuthService {

  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn$.asObservable();
  private readonly TOKEN_NAME = 'token';

  // logedOut:boolean=true; //added later to hide login form when looged in

  get token(): any {
    return localStorage.getItem(this.TOKEN_NAME);
  }



  // constructor(private apiService: ApiService) {
  constructor(private http: HttpClient,private commonService: CommonService) {
    const token = localStorage.getItem('token');
    this._isLoggedIn$.next(!!token);
  }



  login(data: any) {
    // return this.http.post<any>(username, password).pipe(
    //   tap((response: any) => {
    //     this._isLoggedIn$.next(true);
    //     localStorage.setItem('profanis_auth', response.token);
    //   })
    // );

    // var url='http://localhost:5000/api/users/login'
    var url = '' + this.commonService.baseUrl + '/api/users/login'
    return this.http.post<any>(url, data).pipe(
      tap((response: any) => {
        this._isLoggedIn$.next(true);

        localStorage.setItem(this.TOKEN_NAME, response.access_token);
        // this.$axios.defaults.headers.common["Authorization"] ="Bearer" + localStorage.getItem("token");
        // this.$axios.defaults.headers.common["Accept"] = "application/json";
      })

    )
  }





// *********************************************************************************
// START USER METHODS 
// *********************************************************************************



  getMaxUserID(){
    // alert("from getMaxEmpID");
    // var url = 'http://localhost:5000/api/employee/all/'
    var url = '' + this.commonService.baseUrl + '/api/users/maxuserid/'
    return this.http.get<any>(url,
      {
        // now headers filled by auth.interceptor
        // headers: {
        //   Authorization: "Bearer " + localStorage.getItem("token"),
        //   Accept: "application/json" //the token is a variable which holds the token
        // }
      },
    )
  }



  //Get empdegree for component modal for edit
  getUser(id: any) {
   
    // var url='http://localhost:5000/api/employee/' + item.empid + ''
    var url = '' + this.commonService.baseUrl + '/api/users/' + id + '/'

    return this.http.get<any>(url,
      {
        // now headers filled by auth.interceptor
        // headers: {
        //   Authorization: "Bearer " + localStorage.getItem("token"),
        //   Accept: "application/json" //the token is a variable which holds the token
        // }
      },
    )
  }



  updateUser(data: any) {
    // alert("from updateEmpDegree");
    // var url='http://localhost:5000/api/empdegree/update'
    var url = '' + this.commonService.baseUrl + '/api/users/update'
    
    // return this.http.put<any>(url, data, // can also use "put" instead of "post". Backend has to same
    return this.http.post<any>(url, data,
      // {
      //   headers: {
      //     Authorization: "Bearer " + localStorage.getItem("token"),
      //     Accept: "application/json" //the token is a variable which holds the token
      //   }
      // },
    )
  }



  addUser(data: any) {
    // var url='http://localhost:5000/api/employee/'
    var url = '' + this.commonService.baseUrl + '/api/users/'
    return this.http.post<any>(url, data,
      // {
      //   headers: {
      //     Authorization: "Bearer " + localStorage.getItem("token"),
      //     Accept: "application/json" //the token is a variable which holds the token
      //   }
      // },
    )
  }


  deleteUser(userid: any) {

    // var url='http://localhost:5000/api/employee/' + item.empid + ''
    var url = '' + this.commonService.baseUrl + '/api/users/' + userid + ''
    return this.http.delete<any>(url,
      // {
      //   headers: {
      //     Authorization: "Bearer " + localStorage.getItem("token"),
      //     Accept: "application/json" //the token is a variable which holds the token
      //   }
      // },
    )
  }


  

  //Get user role for a specific module
  checkRole(id: any,modulename:any) {
   
    // var url='http://localhost:5000/api/employee/' + item.empid + ''
    var url = '' + this.commonService.baseUrl + '/api/users/checkrole/' + id + '/' + modulename + '/'

    return this.http.get<any>(url,
      {
        // now headers filled by auth.interceptor
        // headers: {
        //   Authorization: "Bearer " + localStorage.getItem("token"),
        //   Accept: "application/json" //the token is a variable which holds the token
        // }
      },
    )
  }




}
