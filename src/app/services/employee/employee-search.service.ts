import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../common.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeSearchService {

  constructor(private http: HttpClient, private commonService: CommonService) {
   }



  getCmbEmpJobtitle() {
    // var url='http://localhost:5000/api/empjobtitle/'
    var url = '' + this.commonService.baseUrl + '/api/empcombo/cmbempjobtitle/'
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

  getCmbEmpRegistration() {
    // var url = 'http://localhost:5000/api/empregistration/'
    var url = '' + this.commonService.baseUrl + '/api/empcombo/cmbempreg/'
    return this.http.get<any>(url)
  }

  getCmbEmp() {
    // var url = 'http://localhost:5000/api/employee/all/'
    var url = '' + this.commonService.baseUrl + '/api/empcombo/cmbemp/' ///all/
    return this.http.get<any>(url)
  }
  // cmbemp_resumeproject_search
  // getCmbEmp() {
  //   // var url = 'http://localhost:5000/api/employee/all/'
  //   var url = '' + this.commonService.baseUrl + '/api/empcombo/cmbemp/' ///all/
  //   return this.http.get<any>(url)
  // }
  getCmbEmpDegree() {
    // var url='http://localhost:5000/api/empjobtitle/'
    var url = '' + this.commonService.baseUrl + '/api/empcombo/cmbempdegree/'
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


  getCmbEmpDepartment(){
    var url = '' + this.commonService.baseUrl + '/api/empcombo/cmbempdepartment/'
    return this.http.get<any>(url,
      {
        // now headers filled by auth.interceptor
      },
    )
  }
  

  getCmbEmpStatus(){
    var url = '' + this.commonService.baseUrl + '/api/empcombo/cmbempstatus/'
    return this.http.get<any>(url,
      {
       // now headers filled by auth.interceptor
      },
    )
  }

  getCmbEmpSuffix(){
    var url = '' + this.commonService.baseUrl + '/api/empcombo/cmbempsuffix/'
    return this.http.get<any>(url,
      {
       // now headers filled by auth.interceptor
      },
    )
  }

  getCmbEmpPrefix(){
    var url = '' + this.commonService.baseUrl + '/api/empcombo/cmbemprefix/'
    return this.http.get<any>(url,
      {
       // now headers filled by auth.interceptor
      },
    )
  }

  getCmbEmpTraining(){
    var url = '' + this.commonService.baseUrl + '/api/empcombo/cmbemptraining/'
    return this.http.get<any>(url,
      {
        // now headers filled by auth.interceptor
      },
    )
  }


  getCmbState() {
    // var url = 'http://localhost:5000/api/empregistration/'
    var url = '' + this.commonService.baseUrl + '/api/empcombo/cmbstate/'
    return this.http.get<any>(url)
  }

  

  getCmbCountry() {
    // var url = 'http://localhost:5000/api/empregistration/'
    var url = '' + this.commonService.baseUrl + '/api/empcombo/cmbcountry/'
    return this.http.get<any>(url)
  }

  getCmbEmpDisciplineSF330() {
    // var url = 'http://localhost:5000/api/empregistration/'
    var url = '' + this.commonService.baseUrl + '/api/empcombo/cmbempdisciplinesf330/'
    return this.http.get<any>(url)
  }

  getCmbEmpExpItem() {
    // var url = 'http://localhost:5000/api/empregistration/'
    var url = '' + this.commonService.baseUrl + '/api/empcombo/cmbempexpitem/'
    return this.http.get<any>(url)
  }

  getCommonListItems() {
    // var url='http://localhost:5000/api/empjobtitle/'
    var url = '' + this.commonService.baseUrl + '/api/empcombo/getCommonListItems/'
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
