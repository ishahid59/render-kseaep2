import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../common.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  // http://localhost:5000  http://localhost:5000
  constructor(private http: HttpClient, private commonService: CommonService) {
  }


  


  // Used To Goto newly added Record in Empdetail 2023  used in EmpEditmodal/addEmp()
  getLastProjectNo() {
    // alert("from getMaxEmpID");
    // var url = 'http://localhost:5000/api/employee/all/'
    var url = '' + this.commonService.baseUrl + '/api/project/lastprojectno/'
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



  getCmbProject() {
    // var url = 'http://localhost:5000/api/employee/all/'
    var url = '' + this.commonService.baseUrl + '/api/project/all/'
    return this.http.get<any>(url)
  }

 

  getProjectdetail(projectid: any) {
    // var url='http://localhost:5000/api/employee/empdetails/' + empid + ''
    var url = '' + this.commonService.baseUrl + '/api/project/projectdetails/' + projectid + ''
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


  //Get employee for Employee Modal component  for edit 
  //Seperated from previous getEmployee to avoid problem of data passing 
  //but same api '/api/employee/' is used for both methods
  getProjectFromModal(projectid: any) {
    // var url='http://localhost:5000/api/employee/' + item.empid + ''
    var url = '' + this.commonService.baseUrl + '/api/project/' + projectid + ''

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


  updateProject(data: any) {
    // var url='http://localhost:5000/api/employee/update'
    var url = '' + this.commonService.baseUrl + '/api/project/update'
    return this.http.post<any>(url, data,
      // {
      //   headers: {
      //     Authorization: "Bearer " + localStorage.getItem("token"),
      //     Accept: "application/json" //the token is a variable which holds the token
      //   }
      // },
    )
  }



  addProject(data: any) {
    // var url='http://localhost:5000/api/employee/'
    var url = '' + this.commonService.baseUrl + '/api/project/'
    return this.http.post<any>(url, data,
      // {
      //   headers: {
      //     Authorization: "Bearer " + localStorage.getItem("token"),
      //     Accept: "application/json" //the token is a variable which holds the token
      //   }
      // },
    )
  }



  // deleteEmployee(item: any) {
  //   alert("from delete" + item.empid);
  //   // var url='http://localhost:5000/api/employee/' + item.empid + ''
  //   var url = '' + this.commonService.baseUrl + '/api/employee/' + item.empid + ''
  //   return this.http.delete<any>(url,
  //     // {
  //     //   headers: {
  //     //     Authorization: "Bearer " + localStorage.getItem("token"),
  //     //     Accept: "application/json" //the token is a variable which holds the token
  //     //   }
  //     // },
  //   )
  // }



  //Delete employee for Employee Modal component  for edit 
  //Seperated from previous deleteEmployee to avoid problem of data passing 
  //but same api '/api/employee/' is used for both methods
  deleteProjectFromModal(projectid:any) {
    // alert("from delete" + item.empid);
    // var url='http://localhost:5000/api/employee/' + item.empid + ''
    var url = '' + this.commonService.baseUrl + '/api/project/' + projectid + ''
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
    getMaxProjectID() {
      // alert("from getMaxEmpID");
      // var url = 'http://localhost:5000/api/employee/all/'
      var url = '' + this.commonService.baseUrl + '/api/project/maxprojectid/'
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
    getDuplicateProjectNo(projectno:any) {

      // var url = 'http://localhost:5000/api/employee/all/'
      var url = '' + this.commonService.baseUrl + '/api/project/duplicateprojectno/' + projectno + ''
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
