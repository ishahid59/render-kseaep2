// import { Injectable } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../common.service';

@Injectable({
  providedIn: 'root'
})
 
export class CaoService {

   // http://localhost:5000  http://localhost:5000
   constructor(private http: HttpClient, private commonService: CommonService) {
  }

 
  

  getCmbCao() {
    // var url = 'http://localhost:5000/api/employee/all/'
    var url = '' + this.commonService.baseUrl + '/api/cao/all/'
    return this.http.get<any>(url)
  }

  getCao(caoid: any) {
    // var url='http://localhost:5000/api/employee/empdetails/' + empid + ''
    var url = '' + this.commonService.baseUrl + '/api/cao/' + caoid + ''
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
  

  getCaoDetail(caoid: any) {
    // var url='http://localhost:5000/api/employee/empdetails/' + empid + ''
    var url = '' + this.commonService.baseUrl + '/api/cao/caodetails/' + caoid + ''
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


  //Get employee for Employee Modal component  for edit 
  //Seperated from previous getEmployee to avoid problem of data passing 
  //but same api '/api/employee/' is used for both methods
  getCaoFromModal(caoid: any) {
    // var url='http://localhost:5000/api/employee/' + item.empid + ''
    var url = '' + this.commonService.baseUrl + '/api/cao/' + caoid + ''

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


  updateCao(data: any) {
    // var url='http://localhost:5000/api/employee/update'
    var url = '' + this.commonService.baseUrl + '/api/cao/update/'
    return this.http.post<any>(url, data,
      // {
      //   headers: {
      //     Authorization: "Bearer " + localStorage.getItem("token"),
      //     Accept: "application/json" //the token is a variable which holds the token
      //   }
      // },
    )
  }



  addCao(data: any) {
    // var url='http://localhost:5000/api/employee/'
    var url = '' + this.commonService.baseUrl + '/api/cao/'
    return this.http.post<any>(url, data,
      // {
      //   headers: {
      //     Authorization: "Bearer " + localStorage.getItem("token"),
      //     Accept: "application/json" //the token is a variable which holds the token
      //   }
      // },
    )
  }

  deleteCao(caoid: any) {
  
    // var url='http://localhost:5000/api/employee/' + item.empid + ''
    var url = '' + this.commonService.baseUrl + '/api/cao/' + caoid + ''
    return this.http.delete<any>(url,
      // {
      //   headers: {
      //     Authorization: "Bearer " + localStorage.getItem("token"),
      //     Accept: "application/json" //the token is a variable which holds the token
      //   }
      // },
    )
  }

  // deleteEmployee(item: any) {
  //   alert("from delete" + item.empid);
  //   // var url='http://localhost:5000/api/employee/' + item.empid + ''
  //   var url = '' + this.commonService.baseUrl + '/api/employee/' + item.empid + ''
  //   return this.http.delete<any>(url,
  //     // {
  //     //   headers: {
  //     //     Authorization: "Bearer " + localStorage.getItem("token"),
  //     //     Accept: "application/json" //the token is a variable which holds the token
  //     //   }
  //     // },
  //   )
  // }



  //Delete employee for Employee Modal component  for edit 
  //Seperated from previous deleteEmployee to avoid problem of data passing 
  //but same api '/api/employee/' is used for both methods
  deleteCaoFromModal(caoid:any) {
    // alert("from delete" + item.empid);
    // var url='http://localhost:5000/api/employee/' + item.empid + ''
    var url = '' + this.commonService.baseUrl + '/api/cao/' + caoid + ''
    return this.http.delete<any>(url,
      // {
      //   headers: {
      //     Authorization: "Bearer " + localStorage.getItem("token"),
      //     Accept: "application/json" //the token is a variable which holds the token
      //   }
      // },
    )
  }


    // Used To Goto newly added Record in Empdetail 2023  used in EmpEditmodal/addEmp()
    getMaxCaoID() {
      // alert("from getMaxEmpID");
      // var url = 'http://localhost:5000/api/employee/all/'
      var url = '' + this.commonService.baseUrl + '/api/cao/maxcaoid/'
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
    getDuplicateCaoNo(caono:any) {
      // alert("from getMaxEmpID");
      // var url = 'http://localhost:5000/api/employee/all/'
      var url = '' + this.commonService.baseUrl + '/api/cao/duplicatecaono/' + caono + ''
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
