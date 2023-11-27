import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../common.service';
 

@Injectable({
  providedIn: 'root'
})


export class EmployeeService {
  // http://localhost:5000  http://localhost:5000
  constructor(private http: HttpClient, private commonService: CommonService) {
  }


  //Get employee for Employee component modal for edit
  getEmployee(item: any) {
    // var url='http://localhost:5000/api/employee/' + item.empid + ''
    var url = '' + this.commonService.baseUrl + '/api/employee/' + item.EmpID + ''

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
  getEmployeeFromModal(empid: any) {
    // var url='http://localhost:5000/api/employee/' + item.empid + ''
    var url = '' + this.commonService.baseUrl + '/api/employee/' + empid + ''

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

  getEmpdetail(empid: any) {
    // var url='http://localhost:5000/api/employee/empdetails/' + empid + ''
    var url = '' + this.commonService.baseUrl + '/api/employee/empdetails/' + empid + ''
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

  updateEmployee(data: any) {
    // var url='http://localhost:5000/api/employee/update'
    var url = '' + this.commonService.baseUrl + '/api/employee/update'
    return this.http.post<any>(url, data,
      // {
      //   headers: {
      //     Authorization: "Bearer " + localStorage.getItem("token"),
      //     Accept: "application/json" //the token is a variable which holds the token
      //   }
      // },
    )
  }



  addEmployee(data: any) {
    // var url='http://localhost:5000/api/employee/'
    var url = '' + this.commonService.baseUrl + '/api/employee/'
    return this.http.post<any>(url, data,
      // {
      //   headers: {
      //     Authorization: "Bearer " + localStorage.getItem("token"),
      //     Accept: "application/json" //the token is a variable which holds the token
      //   }
      // },
    )
  }



  deleteEmployee(item: any) {
    alert("from delete" + item.empid);
    // var url='http://localhost:5000/api/employee/' + item.empid + ''
    var url = '' + this.commonService.baseUrl + '/api/employee/' + item.empid + ''
    return this.http.delete<any>(url,
      // {
      //   headers: {
      //     Authorization: "Bearer " + localStorage.getItem("token"),
      //     Accept: "application/json" //the token is a variable which holds the token
      //   }
      // },
    )
  }



  //Delete employee for Employee Modal component  for edit 
  //Seperated from previous deleteEmployee to avoid problem of data passing 
  //but same api '/api/employee/' is used for both methods
  deleteEmployeeFromModal(empid:any) {
    // alert("from delete" + item.empid);
    // var url='http://localhost:5000/api/employee/' + item.empid + ''
    var url = '' + this.commonService.baseUrl + '/api/employee/' + empid + ''
    return this.http.delete<any>(url,
      // {
      //   headers: {
      //     Authorization: "Bearer " + localStorage.getItem("token"),
      //     Accept: "application/json" //the token is a variable which holds the token
      //   }
      // },
    )
  }


  
  // getCmbEmpJobtitle() {
  //   // var url='http://localhost:5000/api/empjobtitle/'
  //   var url = '' + this.commonService.baseUrl + '/api/empjobtitle/'
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


  // getCmbEmpRegistration() {
  //   // var url = 'http://localhost:5000/api/empregistration/'
  //   var url = '' + this.commonService.baseUrl + '/api/empreg/'
  //   return this.http.get<any>(url)
  // }

  // getCmbEmp() {
  //   // var url = 'http://localhost:5000/api/employee/all/'
  //   var url = '' + this.commonService.baseUrl + '/api/employee/all/'
  //   return this.http.get<any>(url)
  // }



  // Used To Goto newly added Record in Empdetail 2023  used in EmpEditmodal/addEmp()
  getMaxEmpID() {
    // alert("from getMaxEmpID");
    // var url = 'http://localhost:5000/api/employee/all/'
    var url = '' + this.commonService.baseUrl + '/api/employee/maxempid/'
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
  getDuplicateEmployeeID(employeeid:any) {
    // alert("from getMaxEmpID");
    // var url = 'http://localhost:5000/api/employee/all/'
    var url = '' + this.commonService.baseUrl + '/api/employee/duplicateemployeeid/' + employeeid + ''
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




// //****************************************************************************************************** */
// //EMP-DEGREE SERVICES
// //****************************************************************************************************** */


//   //Get empdegree for component modal for edit
//   getEmpDegree(id: any) {
   
//     // var url='http://localhost:5000/api/employee/' + item.empid + ''
//     var url = '' + this.commonService.baseUrl + '/api/empdegree/' + id + ''

//     return this.http.get<any>(url,
//       {
//         // now headers filled by auth.interceptor
//         // headers: {
//         //   Authorization: "Bearer " + localStorage.getItem("token"),
//         //   Accept: "application/json" //the token is a variable which holds the token
//         // }
//       },
//     )
//   }

//   //Get empdegree for component modal for detail
//   getEmpDegreeDetail(item: any) {
//     // var url='http://localhost:5000/api/employee/' + item.empid + ''
//     var url = '' + this.commonService.baseUrl + '/api/empdegree/empdegreedetails/' + item.ID + ''

//     return this.http.get<any>(url,
//       {
//         // now headers filled by auth.interceptor
//         // headers: {
//         //   Authorization: "Bearer " + localStorage.getItem("token"),
//         //   Accept: "application/json" //the token is a variable which holds the token
//         // }
//       },
//     )
//   }



}
