import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../common.service';

@Injectable({
  providedIn: 'root'
})
export class EmpdegreeService {

    // http://localhost:5000  http://localhost:5000
    constructor(private http: HttpClient, private commonService: CommonService) {
}



//****************************************************************************************************** */
//EMP-DEGREE SERVICES
//****************************************************************************************************** */


  //Get empdegree for component modal for edit
  getEmpDegree(id: any) {
   
    // var url='http://localhost:5000/api/employee/' + item.empid + ''
    var url = '' + this.commonService.baseUrl + '/api/empdegree/' + id + ''

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

  //Get empdegree for component modal for detail
  getEmpDegreeDetail(item: any) {
    // var url='http://localhost:5000/api/employee/' + item.empid + ''
    var url = '' + this.commonService.baseUrl + '/api/empdegree/empdegreedetails/' + item.ID + ''

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
  
   

  updateEmpDegree(data: any) {
    // alert("from updateEmpDegree");
    // var url='http://localhost:5000/api/empdegree/update'
    var url = '' + this.commonService.baseUrl + '/api/empdegree/update'
    
    return this.http.post<any>(url, data,
      // {
      //   headers: {
      //     Authorization: "Bearer " + localStorage.getItem("token"),
      //     Accept: "application/json" //the token is a variable which holds the token
      //   }
      // },
    )
  }



  addEmpDegree(data: any) {
    // var url='http://localhost:5000/api/employee/'
    var url = '' + this.commonService.baseUrl + '/api/empdegree/'
    return this.http.post<any>(url, data,
      // {
      //   headers: {
      //     Authorization: "Bearer " + localStorage.getItem("token"),
      //     Accept: "application/json" //the token is a variable which holds the token
      //   }
      // },
    )
  }


  deleteEmpDegree(empdegreeid: any) {

    // var url='http://localhost:5000/api/employee/' + item.empid + ''
    var url = '' + this.commonService.baseUrl + '/api/empdegree/' + empdegreeid + ''
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


  // getCmbState() {
  //   // var url = 'http://localhost:5000/api/empregistration/'
  //   var url = '' + this.commonService.baseUrl + '/api/empdegree/cmbstate/'
  //   return this.http.get<any>(url)
  // }

  

  // getCmbCountry() {
  //   // var url = 'http://localhost:5000/api/empregistration/'
  //   var url = '' + this.commonService.baseUrl + '/api/empdegree/cmbcountry/'
  //   return this.http.get<any>(url)
  // }



  
  // Used To Goto newly added Record in Empdetail 2023  used in EmpEditmodal/addEmp()
  getMaxEmpDegreeID() {
    // alert("from getMaxEmpID");
    // var url = 'http://localhost:5000/api/employee/all/'
    var url = '' + this.commonService.baseUrl + '/api/empdegree/maxempdegreeid/'
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
