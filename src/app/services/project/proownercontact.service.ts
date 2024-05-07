// import { Injectable } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../common.service';

@Injectable({
  providedIn: 'root'
})
export class ProownercontactService {

  constructor(private http: HttpClient, private commonService: CommonService) { 
  }

  //Get empdegree for component modal for detail
  getProOwnercontactDetail(item: any) {
    // var url='http://localhost:5000/api/employee/' + item.empid + ''
    var url = '' + this.commonService.baseUrl + '/api/proownercontact/proownercontactdetails/' + item+ ''

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
getProOwnercontact(id: any) {
 
  // var url='http://localhost:5000/api/employee/' + item.empid + ''
  var url = '' + this.commonService.baseUrl + '/api/proownercontact/' + id + ''

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
getMaxProOwnercontactID() {
  // alert("from getMaxEmpID");
  // var url = 'http://localhost:5000/api/employee/all/'
  var url = '' + this.commonService.baseUrl + '/api/proownercontact/maxproownercontactid/'
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


checkForProjectID(projectid:any) {
  // alert("from getMaxEmpID");
  // var url = 'http://localhost:5000/api/employee/all/'
  var url = '' + this.commonService.baseUrl + '/api/proownercontact/checkforprojectid/'+ projectid + ''
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
    

updateProOwnercontact(data: any) {
  // alert("from updateEmpDegree");
  // var url='http://localhost:5000/api/empdegree/update'
  var url = '' + this.commonService.baseUrl + '/api/proownercontact/update'
  
  return this.http.post<any>(url, data,
    // {
    //   headers: {
    //     Authorization: "Bearer " + localStorage.getItem("token"),
    //     Accept: "application/json" //the token is a variable which holds the token
    //   }
    // },
  )
}



addProOwnercontact(data: any) {
  // var url='http://localhost:5000/api/employee/'
  var url = '' + this.commonService.baseUrl + '/api/proownercontact/'
  return this.http.post<any>(url, data,
    // {
    //   headers: {
    //     Authorization: "Bearer " + localStorage.getItem("token"),
    //     Accept: "application/json" //the token is a variable which holds the token
    //   }
    // },
  )
}


deleteProOwnercontact(proownercontactid: any) {

  // var url='http://localhost:5000/api/employee/' + item.empid + ''
  var url = '' + this.commonService.baseUrl + '/api/proownercontact/' + proownercontactid + ''
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
