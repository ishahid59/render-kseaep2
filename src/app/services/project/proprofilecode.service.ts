import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../common.service';

@Injectable({
  providedIn: 'root'
})
export class ProprofilecodeService {

      // http://localhost:5000  http://localhost:5000
      constructor(private http: HttpClient, private commonService: CommonService) {
      }

 
      
  // Used To Goto newly added Record in Empdetail 2023  used in EmpEditmodal/addEmp()
  getMaxProProfilecodeSF330ID() {
    // alert("from getMaxEmpID");
    // var url = 'http://localhost:5000/api/employee/all/'
    var url = '' + this.commonService.baseUrl + '/api/proprofilecode/maxproprofilecodesf330id/'
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
  getDuplicateItemID(profilecodesf330id: any, projectid: any) {
    // alert("from getMaxEmpID");
    // var url = 'http://localhost:5000/api/employee/all/'
    var url = '' + this.commonService.baseUrl + '/api/proprofilecode/duplicateitemid/' + profilecodesf330id + '/' + projectid + '/'
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
  getProProfilecodeSF330(id: any) {
   
    // var url='http://localhost:5000/api/employee/' + item.empid + ''
    var url = '' + this.commonService.baseUrl + '/api/proprofilecode/' + id + ''

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
    getProProfilecodeSF330Detail(item: any) {
      // var url='http://localhost:5000/api/employee/' + item.empid + ''
      var url = '' + this.commonService.baseUrl + '/api/proprofilecode/proprofilecodesf330details/' + item+ ''
  
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
    
      
  
    updateProfilecodeSF330(data: any) {
      // alert("from updateEmpDegree");
      // var url='http://localhost:5000/api/empdegree/update'
      var url = '' + this.commonService.baseUrl + '/api/proprofilecode/update'
      
      return this.http.post<any>(url, data,
        // {
        //   headers: {
        //     Authorization: "Bearer " + localStorage.getItem("token"),
        //     Accept: "application/json" //the token is a variable which holds the token
        //   }
        // },
      )
    }
  
  
  
    addProProfilecodeSF330(data: any) {
      // var url='http://localhost:5000/api/employee/'
      var url = '' + this.commonService.baseUrl + '/api/proprofilecode/'
      return this.http.post<any>(url, data,
        // {
        //   headers: {
        //     Authorization: "Bearer " + localStorage.getItem("token"),
        //     Accept: "application/json" //the token is a variable which holds the token
        //   }
        // },
      )
    }
  
  
    deleteProProfilecodeSF330(proprofilecodesf330id: any) {
  
      // var url='http://localhost:5000/api/employee/' + item.empid + ''
      var url = '' + this.commonService.baseUrl + '/api/proprofilecode/' + proprofilecodesf330id + ''
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
 