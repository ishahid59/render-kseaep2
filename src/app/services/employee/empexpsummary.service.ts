import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../common.service';

@Injectable({
  providedIn: 'root'
})
export class EmpexpsummaryService {

        // http://localhost:5000  http://localhost:5000
        constructor(private http: HttpClient, private commonService: CommonService) {
        }


// Used To Goto newly added Record in Empdetail 2023  used in EmpEditmodal/addEmp()
getMaxEmpExpSummaryID() {
  // alert("from getMaxEmpID");
  // var url = 'http://localhost:5000/api/employee/all/'
  var url = '' + this.commonService.baseUrl + '/api/empexpsummary/maxempexpsummaryid/'
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
getEmpExpSummary(id: any) {
 
  // var url='http://localhost:5000/api/employee/' + item.empid + ''
  var url = '' + this.commonService.baseUrl + '/api/empexpsummary/' + id + ''

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
  getEmpExpSummaryDetail(item: any) {
    // var url='http://localhost:5000/api/employee/' + item.empid + ''
    var url = '' + this.commonService.baseUrl + '/api/empexpsummary/empexpsummarydetails/' + item+ ''

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
  
    

  updateEmpExpSummary(data: any) {
    // alert("from updateEmpDegree");
    // var url='http://localhost:5000/api/empdegree/update'
    var url = '' + this.commonService.baseUrl + '/api/empexpsummary/update'
    
    return this.http.post<any>(url, data,
      // {
      //   headers: {
      //     Authorization: "Bearer " + localStorage.getItem("token"),
      //     Accept: "application/json" //the token is a variable which holds the token
      //   }
      // },
    )
  }


  // Used To Goto newly added Record in Empdetail 2023  used in EmpEditmodal/addEmp()
  getDuplicateItemID(itemid: any, empid: any) {
    // alert("from getMaxEmpID");
    // var url = 'http://localhost:5000/api/employee/all/'
    var url = '' + this.commonService.baseUrl + '/api/empexpsummary/duplicateitemid/' + itemid + '/' + empid + '/'
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



  addEmpExpSummary(data: any) {
    // var url='http://localhost:5000/api/employee/'
    var url = '' + this.commonService.baseUrl + '/api/empexpsummary/'
    return this.http.post<any>(url, data,
      // {
      //   headers: {
      //     Authorization: "Bearer " + localStorage.getItem("token"),
      //     Accept: "application/json" //the token is a variable which holds the token
      //   }
      // },
    )
  }


  deleteEmpExpSummary(empexpsummaryid: any) {

    // var url='http://localhost:5000/api/employee/' + item.empid + ''
    var url = '' + this.commonService.baseUrl + '/api/empexpsummary/' + empexpsummaryid + ''
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
