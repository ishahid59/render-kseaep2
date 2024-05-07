// import { Injectable } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../common.service';

@Injectable({
  providedIn: 'root'
})
export class ProaddressService {

  constructor(private http: HttpClient, private commonService: CommonService) { 
  }


    //Get empdegree for component modal for detail
    getProAddressDetail(item: any) {
      // var url='http://localhost:5000/api/employee/' + item.empid + ''
      var url = '' + this.commonService.baseUrl + '/api/proaddress/proaddressdetails/' + item+ ''
  
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
  getProAddress(id: any) {
   
    // var url='http://localhost:5000/api/employee/' + item.empid + ''
    var url = '' + this.commonService.baseUrl + '/api/proaddress/' + id + ''

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
  getMaxProAddressID() {
    // alert("from getMaxEmpID");
    // var url = 'http://localhost:5000/api/employee/all/'
    var url = '' + this.commonService.baseUrl + '/api/proaddress/maxproaddressid/'
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
    var url = '' + this.commonService.baseUrl + '/api/proaddress/checkforprojectid/'+ projectid + ''
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
      
  
  updateProAddress(data: any) {
    // alert("from updateEmpDegree");
    // var url='http://localhost:5000/api/empdegree/update'
    var url = '' + this.commonService.baseUrl + '/api/proaddress/update'
    
    return this.http.post<any>(url, data,
      // {
      //   headers: {
      //     Authorization: "Bearer " + localStorage.getItem("token"),
      //     Accept: "application/json" //the token is a variable which holds the token
      //   }
      // },
    )
  }



  addProAddress(data: any) {
    // var url='http://localhost:5000/api/employee/'
    var url = '' + this.commonService.baseUrl + '/api/proaddress/'
    return this.http.post<any>(url, data,
      // {
      //   headers: {
      //     Authorization: "Bearer " + localStorage.getItem("token"),
      //     Accept: "application/json" //the token is a variable which holds the token
      //   }
      // },
    )
  }


  deleteProAddress(proaddressid: any) {

    // var url='http://localhost:5000/api/employee/' + item.empid + ''
    var url = '' + this.commonService.baseUrl + '/api/proaddress/' + proaddressid + ''
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
