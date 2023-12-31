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
        localStorage.setItem('hashedpassword', response.user.password);//2023
        localStorage.setItem('email', response.user.email);//2023
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





  // Used To Goto newly added Record in Empdetail 2023  used in EmpEditmodal/addEmp()
  getDuplicateEmployeeID(empid: any) {
    // alert("from getMaxEmpID");
    // var url = 'http://localhost:5000/api/employee/all/'
    var url = '' + this.commonService.baseUrl + '/api/users/duplicateemployeeid/' + empid + '/'
    // var url = '' + this.commonService.baseUrl + '/api/users/checkrole/' + id + '/' + modulename + '/'

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



//   // *********************************************************************************** */
//   //*TESTED IN AddUser() function*
//   // TEST promise chain https://stackoverflow.com/questions/70222227/how-do-i-return-a-promise-and-get-the-data-from-it
//   // https://stackoverflow.com/questions/31366323/chain-multiple-promises-in-angularjs
//   // Used To Goto newly added Record in Empdetail 2023  used in EmpEditmodal/addEmp()
//   async getDuplicateEmployeeIDpromise(empid: any) {
//     var url = '' + this.commonService.baseUrl + '/api/users/duplicateemployeeid/' + empid + '/'
//     const data = this.http.get<any>(url, {}).toPromise();
//     return data;
//   }

//  // TEST promise chain https://stackoverflow.com/questions/70222227/how-do-i-return-a-promise-and-get-the-data-from-it
//   getDuplicateEmailpromise(email: any) {
//     var url = '' + this.commonService.baseUrl + '/api/users/duplicateemail/' + email+ '/'
//     const data = this.http.get<any>(url, {},).toPromise();
//     return data;
//   }
//   //************************************************************************************* */


  // Used To Goto newly added Record in Empdetail 2023  used in EmpEditmodal/addEmp()
  getDuplicateEmail(email: any) {
    // alert("from getMaxEmpID");
    // var url = 'http://localhost:5000/api/employee/all/'
    var url = '' + this.commonService.baseUrl + '/api/users/duplicateemail/' + email+ '/'
    // var url = '' + this.commonService.baseUrl + '/api/users/checkrole/' + id + '/' + modulename + '/'

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

  
  // 2023 for updating password
  updateUserPassword(data: any) {
    // alert("from updateEmpDegree");
    // var url='http://localhost:5000/api/empdegree/update'
    var url = '' + this.commonService.baseUrl + '/api/users/updatepassword'
    
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

  // 2023 Check user role in th users table comparing hashed password
  // checkUserRole(password: any) {
    checkUserRole() {

      // var url='http://localhost:5000/api/employee/' + item.empid + ''
      var pass:any = localStorage.getItem('hashedpassword');
      // replace all forward slash with %2F for using in parameter
      var result= pass.replace(/\//g, "%2F");
      var url = '' + this.commonService.baseUrl + '/api/users/checkuserrole/' + result + '/'
                                                            
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


// Will be used later tested
// ***2023 get all user roles in th uaccess_control table for the userid(empid) comparing hashed password stored in local storage
// This returned array will be then stored in the common service in 'user_roles' array.
// this function getUserRoles() will run everytime with refresh from app.component. So this data s always available for checking role.
// *************************************************************************************************************
  getUserRoles(){
    // var url = '' + this.commonService.baseUrl + '/api/users/getuserroles/' + id + '/'

    var pass:any = localStorage.getItem('hashedpassword');
    // replace all forward slash with %2F for using in parameter
    var result= pass.replace(/\//g, "%2F");
    var url = '' + this.commonService.baseUrl + '/api/users/getuserroles/' + result + '/'
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









  getCmbEmp() {
    // var url = 'http://localhost:5000/api/employee/all/'
    var url = '' + this.commonService.baseUrl + '/api/empcombo/cmbemp/' ///all/
    return this.http.get<any>(url)
  }


}
