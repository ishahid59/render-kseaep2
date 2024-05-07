// import { Injectable } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../common.service';

@Injectable({
  providedIn: 'root'
})
export class EmpmembershipService {

  constructor(private http: HttpClient, private commonService: CommonService) { 
  }


 // Used To Goto newly added Record in Empdetail 2023  used in EmpEditmodal/addEmp()
 getMaxEmpMembershipID() {
  // alert("from getMaxEmpID");
  // var url = 'http://localhost:5000/api/employee/all/'
  var url = '' + this.commonService.baseUrl + '/api/empmembership/maxempmembershipid/'
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
getEmpMembership(id: any) {
 
  // var url='http://localhost:5000/api/employee/' + item.empid + ''
  var url = '' + this.commonService.baseUrl + '/api/empmembership/' + id + ''

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


updateEmpMembership(data: any) {
  // alert("from updateEmpDegree");
  // var url='http://localhost:5000/api/empdegree/update'
  var url = '' + this.commonService.baseUrl + '/api/empmembership/update'
  
  return this.http.post<any>(url, data,
    // {
    //   headers: {
    //     Authorization: "Bearer " + localStorage.getItem("token"),
    //     Accept: "application/json" //the token is a variable which holds the token
    //   }
    // },
  )
}


addEmpMembership(data: any) {
  // var url='http://localhost:5000/api/employee/'
  var url = '' + this.commonService.baseUrl + '/api/empmembership/'
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
getEmpMembershipDetail(item: any) {
  // alert(item)
  // var url='http://localhost:5000/api/employee/' + item.empid + ''
  var url = '' + this.commonService.baseUrl + '/api/empmembership/empmembershipdetails/' + item + ''
  
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


deleteEmpMembership(empmembershipid: any) {

  // var url='http://localhost:5000/api/employee/' + item.empid + ''
  var url = '' + this.commonService.baseUrl + '/api/empmembership/' + empmembershipid + ''
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
