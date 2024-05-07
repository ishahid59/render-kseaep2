import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../common.service';

@Injectable({
  providedIn: 'root'
})
export class EmpprevemploymentService {
  
    // http://localhost:5000  http://localhost:5000
    constructor(private http: HttpClient, private commonService: CommonService) {
    }


         // Used To Goto newly added Record in Empdetail 2023  used in EmpEditmodal/addEmp()
 getMaxEmpPrevEmploymentID() {
  // alert("from getMaxEmpID");
  // var url = 'http://localhost:5000/api/employee/all/'
  var url = '' + this.commonService.baseUrl + '/api/empprevemployment/maxempprevemploymentid/'
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
getEmpPrevEmployment(id: any) {
 
  // var url='http://localhost:5000/api/employee/' + item.empid + ''
  var url = '' + this.commonService.baseUrl + '/api/empprevemployment/' + id + ''

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


updateEmpPrevEmployment(data: any) {
  // alert("from updateEmpDegree");
  // var url='http://localhost:5000/api/empdegree/update'
  var url = '' + this.commonService.baseUrl + '/api/empprevemployment/update'
  
  return this.http.post<any>(url, data,
    // {
    //   headers: {
    //     Authorization: "Bearer " + localStorage.getItem("token"),
    //     Accept: "application/json" //the token is a variable which holds the token
    //   }
    // },
  )
}


addEmpPrevEmployment(data: any) {
  // var url='http://localhost:5000/api/employee/'
  var url = '' + this.commonService.baseUrl + '/api/empprevemployment/'
  return this.http.post<any>(url, data,
    // {
    //   headers: {
    //     Authorization: "Bearer " + localStorage.getItem("token"),
    //     Accept: "application/json" //the token is a variable which holds the token
    //   }
    // },
  )
}


//Get empdegree for component modal for detail
getEmpPrevEmploymentDetail(item: any) {
  // alert(item)
  // var url='http://localhost:5000/api/employee/' + item.empid + ''
  var url = '' + this.commonService.baseUrl + '/api/empprevemployment/empprevemploymentdetails/' + item + ''
  
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


deleteEmpPrevEmployment(empprevemploymentid: any) {

  // var url='http://localhost:5000/api/employee/' + item.empid + ''
  var url = '' + this.commonService.baseUrl + '/api/empprevemployment/' + empprevemploymentid + ''
  return this.http.delete<any>(url,
    // {
    //   headers: {
    //     Authorization: "Bearer " + localStorage.getItem("token"),
    //     Accept: "application/json" //the token is a variable which holds the token
    //   }
    // },
  )
}



}
