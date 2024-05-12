import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../common.service';

@Injectable({
  providedIn: 'root'
})


export class Empdisciplinesf330Service {


    // http://localhost:5000  http://localhost:5000
    constructor(private http: HttpClient, private commonService: CommonService) {
    }


 // Used To Goto newly added Record in Empdetail 2023  used in EmpEditmodal/addEmp()
 getMaxEmpDisciplineSF330ID() {
  // alert("from getMaxEmpID");
  // var url = 'http://localhost:5000/api/employee/all/'
  var url = '' + this.commonService.baseUrl + '/api/empdisciplinesf330/maxempdisciplinesf330id/'
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
  getDuplicateItemID(secondarydisciplinesf330id: any, empid: any) {
    // alert("from getMaxEmpID");
    // var url = 'http://localhost:5000/api/employee/all/'
    var url = '' + this.commonService.baseUrl + '/api/empdisciplinesf330/duplicateitemid/' + secondarydisciplinesf330id + '/' + empid + '/'
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
getEmpDisciplineSF330(id: any) {
 
  // var url='http://localhost:5000/api/employee/' + item.empid + ''
  var url = '' + this.commonService.baseUrl + '/api/empdisciplinesf330/' + id + ''

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


updateEmpDisciplineSF330(data: any) {
  // alert("from updateEmpDegree");
  // var url='http://localhost:5000/api/empdegree/update'
  var url = '' + this.commonService.baseUrl + '/api/empdisciplinesf330/update'
  
  return this.http.post<any>(url, data,
    // {
    //   headers: {
    //     Authorization: "Bearer " + localStorage.getItem("token"),
    //     Accept: "application/json" //the token is a variable which holds the token
    //   }
    // },
  )
}


addEmpDisciplineSF330(data: any) {
  // var url='http://localhost:5000/api/employee/'
  var url = '' + this.commonService.baseUrl + '/api/empdisciplinesf330/'
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
getEmpDisciplineSF330Detail(item: any) {
  // alert(item)
  // var url='http://localhost:5000/api/employee/' + item.empid + ''
  var url = '' + this.commonService.baseUrl + '/api/empdisciplinesf330/empdisciplinesf330details/' + item + ''
  
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


deleteEmpDisciplineSF330(empdisciplinesf330id: any) {

  // var url='http://localhost:5000/api/employee/' + item.empid + ''
  var url = '' + this.commonService.baseUrl + '/api/empdisciplinesf330/' + empdisciplinesf330id + ''
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
