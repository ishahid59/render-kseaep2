import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../common.service';


@Injectable({
  providedIn: 'root'
})
export class EmpregService {

    // http://localhost:5000  http://localhost:5000
    constructor(private http: HttpClient, private commonService: CommonService) {
    }


  // Used To Goto newly added Record in Empdetail 2023  used in EmpEditmodal/addEmp()
  getMaxEmpRegID() {
    // alert("from getMaxEmpID");
    // var url = 'http://localhost:5000/api/employee/all/'
    var url = '' + this.commonService.baseUrl + '/api/empreg/maxempregid/'
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
  getEmpReg(id: any) {
   
    // var url='http://localhost:5000/api/employee/' + item.empid + ''
    var url = '' + this.commonService.baseUrl + '/api/empreg/' + id + ''

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

  updateEmpReg(data: any) {
    // alert("from updateEmpDegree");
    // var url='http://localhost:5000/api/empdegree/update'
    var url = '' + this.commonService.baseUrl + '/api/empreg/update'
    
    return this.http.post<any>(url, data,
      // {
      //   headers: {
      //     Authorization: "Bearer " + localStorage.getItem("token"),
      //     Accept: "application/json" //the token is a variable which holds the token
      //   }
      // },
    )
  }



  addEmpReg(data: any) {
    // var url='http://localhost:5000/api/employee/'
    var url = '' + this.commonService.baseUrl + '/api/empreg/'
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
  getEmpRegDetail(item: any) {
    // var url='http://localhost:5000/api/employee/' + item.empid + ''
    var url = '' + this.commonService.baseUrl + '/api/empreg/empregdetails/' + item.ID + ''

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


  deleteEmpReg(empregid: any) {

    // var url='http://localhost:5000/api/employee/' + item.empid + ''
    var url = '' + this.commonService.baseUrl + '/api/empdegree/' + empregid + ''
    return this.http.delete<any>(url,
      // {
      //   headers: {
      //     Authorization: "Bearer " + localStorage.getItem("token"),
      //     Accept: "application/json" //the token is a variable which holds the token
      //   }
      // },
    )
  }


  // getCmbEmpDegree() {
  //   // var url='http://localhost:5000/api/empjobtitle/'
  //   var url = '' + this.commonService.baseUrl + '/api/empdegree/cmbempdegree/'
  //   return this.http.get<any>(url,
  //     {
  //       // now headers filled by auth.interceptor
  //       // headers: {
  //       //   Authorization: "Bearer " + localStorage.getItem("token"),
  //       //   Accept: "application/json" //the token is a variable which holds the token
  //       // }
  //     },
  //   )
  // }


  getCmbState() {
    // var url = 'http://localhost:5000/api/empregistration/'
    var url = '' + this.commonService.baseUrl + '/api/empdegree/cmbstate/'
    return this.http.get<any>(url)
  }

  

  getCmbCountry() {
    // var url = 'http://localhost:5000/api/empregistration/'
    var url = '' + this.commonService.baseUrl + '/api/empdegree/cmbcountry/'
    return this.http.get<any>(url)
  }

}
