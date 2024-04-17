import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../common.service';


@Injectable({
  providedIn: 'root'
})
export class ProteamService {

      // http://localhost:5000  http://localhost:5000
      constructor(private http: HttpClient, private commonService: CommonService) {
      }


      
  // Used To Goto newly added Record in Empdetail 2023  used in EmpEditmodal/addEmp()
  getMaxProTeamID() {
    // alert("from getMaxEmpID");
    // var url = 'http://localhost:5000/api/employee/all/'
    var url = '' + this.commonService.baseUrl + '/api/proteam/maxproteamid/'
  
  
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
  getDuplicateEmployeeID(empid: any, projectid: any) {
    // alert("from getMaxEmpID");
    // var url = 'http://localhost:5000/api/employee/all/'
    var url = '' + this.commonService.baseUrl + '/api/proteam/duplicateemployeeid/' + empid + '/' + projectid + '/'
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
  getProTeam(id: any) {
   
    // var url='http://localhost:5000/api/employee/' + item.empid + ''
    var url = '' + this.commonService.baseUrl + '/api/proteam/' + id + ''

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
    getProTeamDetail(item: any) {
      // var url='http://localhost:5000/api/employee/' + item.empid + ''
      var url = '' + this.commonService.baseUrl + '/api/proteam/proteamdetails/' + item+ ''
  
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
    
      
  
    updateProTeam(data: any) {
      // alert("from updateEmpDegree");
      // var url='http://localhost:5000/api/empdegree/update'
      var url = '' + this.commonService.baseUrl + '/api/proteam/update'
      
      return this.http.post<any>(url, data,
        // {
        //   headers: {
        //     Authorization: "Bearer " + localStorage.getItem("token"),
        //     Accept: "application/json" //the token is a variable which holds the token
        //   }
        // },
      )
    }
  
  
  
    addProTeam(data: any) {
      // var url='http://localhost:5000/api/employee/'
      var url = '' + this.commonService.baseUrl + '/api/proteam/'
      return this.http.post<any>(url, data,
        // {
        //   headers: {
        //     Authorization: "Bearer " + localStorage.getItem("token"),
        //     Accept: "application/json" //the token is a variable which holds the token
        //   }
        // },
      )
    }
  
  
    deleteProTeam(proteamid: any) {
  
      // var url='http://localhost:5000/api/employee/' + item.empid + ''
      var url = '' + this.commonService.baseUrl + '/api/proteam/' + proteamid + ''
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
