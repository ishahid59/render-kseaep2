import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../common.service';

@Injectable({
  providedIn: 'root'
})
export class EmpresumetextService {

  constructor(private http: HttpClient, private commonService: CommonService) { 
  }

   //Get empdegree for component modal for detail
   getEmpResumeTextDetail(item: any) {
   
    // var url='http://localhost:5000/api/employee/' + item.empid + ''
    var url = '' + this.commonService.baseUrl + '/api/empresumetext/empresumetextdetails/' + item+ ''

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
    getEmpResumeText(id: any) {
 
      // var url='http://localhost:5000/api/employee/' + item.empid + ''
      var url = '' + this.commonService.baseUrl + '/api/empresumetext/' + id + ''
     
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
  addEmpResumeText(data: any) {
  // var url='http://localhost:5000/api/employee/'
  var url = '' + this.commonService.baseUrl + '/api/empresumetext/'
  return this.http.post<any>(url, data,
    // {
    //   headers: {
    //     Authorization: "Bearer " + localStorage.getItem("token"),
    //     Accept: "application/json" //the token is a variable which holds the token
    //   }
    // },
  )
      }
      
  updateEmpResumeText(data: any) {
    // alert("from updateEmpDegree");
    // var url='http://localhost:5000/api/empdegree/update'
    var url = '' + this.commonService.baseUrl + '/api/empresumetext/update'

    return this.http.post<any>(url, data,
      // {
      //   headers: {
      //     Authorization: "Bearer " + localStorage.getItem("token"),
      //     Accept: "application/json" //the token is a variable which holds the token
      //   }
      // },
    )
  }

    deleteEmpResumeText(empresumetextid: any) {
      // var url='http://localhost:5000/api/employee/' + item.empid + ''
      var url = '' + this.commonService.baseUrl + '/api/empresumetext/' + empresumetextid + ''
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
    getMaxEmpResumeTextID() {
      // alert("from getMaxEmpID");
      // var url = 'http://localhost:5000/api/employee/all/'
      var url = '' + this.commonService.baseUrl + '/api/empresumetext/maxempresumetextid/'
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
  
  
    checkForEmpID(empid:any) {
      // alert("from getMaxEmpID");
      // var url = 'http://localhost:5000/api/employee/all/'
      var url = '' + this.commonService.baseUrl + '/api/empresumetext/checkforempid/'+ empid + ''
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
