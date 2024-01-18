import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../common.service';

@Injectable({
  providedIn: 'root'
})
export class ProdescriptionService {

  constructor(private http: HttpClient, private commonService: CommonService) {
 
   }


  // Used To Goto newly added Record in Empdetail 2023  used in EmpEditmodal/addEmp()
  getMaxProDescriptionID() {
    // alert("from getMaxEmpID");
    // var url = 'http://localhost:5000/api/employee/all/'
    var url = '' + this.commonService.baseUrl + '/api/prodescription/maxprodescriptionid/'
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
  getProDescription(id: any) {
   
    // var url='http://localhost:5000/api/employee/' + item.empid + ''
    var url = '' + this.commonService.baseUrl + '/api/prodescription/' + id + ''

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
    getProDescriptionDetail(item: any) {
      // var url='http://localhost:5000/api/employee/' + item.empid + ''
      var url = '' + this.commonService.baseUrl + '/api/prodescription/prodescriptiondetails/' + item+ ''
  
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
    
      
  
    updateDescription(data: any) {
      // alert("from updateEmpDegree");
      // var url='http://localhost:5000/api/empdegree/update'
      var url = '' + this.commonService.baseUrl + '/api/prodescription/update'
      
      return this.http.post<any>(url, data,
        // {
        //   headers: {
        //     Authorization: "Bearer " + localStorage.getItem("token"),
        //     Accept: "application/json" //the token is a variable which holds the token
        //   }
        // },
      )
    }
  
  
  
    addProDescription(data: any) {
      // var url='http://localhost:5000/api/employee/'
      var url = '' + this.commonService.baseUrl + '/api/prodescription/'
      return this.http.post<any>(url, data,
        // {
        //   headers: {
        //     Authorization: "Bearer " + localStorage.getItem("token"),
        //     Accept: "application/json" //the token is a variable which holds the token
        //   }
        // },
      )
    }
  
  
    deleteProDescription(prodescriptionid: any) {
  
      // var url='http://localhost:5000/api/employee/' + item.empid + ''
      var url = '' + this.commonService.baseUrl + '/api/prodescription/' + prodescriptionid + ''
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
 