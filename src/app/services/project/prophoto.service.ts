import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../common.service';

@Injectable({
  providedIn: 'root'
})
export class ProphotoService {

  constructor(private http: HttpClient, private commonService: CommonService) {

  }




  // Used To Goto newly added Record in Empdetail 2023  used in EmpEditmodal/addEmp()
  getMaxProPhotoID() {
    // alert("from getMaxEmpID");
    // var url = 'http://localhost:5000/api/employee/all/'
    var url = '' + this.commonService.baseUrl + '/api/prophoto/maxprophotoid/'
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
  getProPhoto(id: any) {

    // var url='http://localhost:5000/api/employee/' + item.empid + ''
    var url = '' + this.commonService.baseUrl + '/api/prophoto/' + id + ''

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
  getProPhotoDetail(item: any) {
    // var url='http://localhost:5000/api/employee/' + item.empid + ''
    var url = '' + this.commonService.baseUrl + '/api/prophoto/prophotodetails/' + item + ''

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



  updateProPhoto(data: any) {
    // alert(data);
    // return;
    // alert("from updateEmpDegree");
    // var url='http://localhost:5000/api/empdegree/update'
    var url = '' + this.commonService.baseUrl + '/api/prophoto/update'

    return this.http.post<any>(url, data,
      // {
      //   headers: {
      //     Authorization: "Bearer " + localStorage.getItem("token"),
      //     Accept: "application/json" //the token is a variable which holds the token
      //   }
      // },
    )
  }


  addProPhoto(data: any) {
    // var url='http://localhost:5000/api/employee/'
    var url = '' + this.commonService.baseUrl + '/api/prophoto/'
    return this.http.post<any>(url, data,
      // {
      //   headers: {
      //     Authorization: "Bearer " + localStorage.getItem("token"),
      //     Accept: "application/json" //the token is a variable which holds the token
      //   }
      // },
    )
  }



   deleteProPhoto(prophotoid: any) {

    // var url='http://localhost:5000/api/employee/' + item.empid + ''
     var url = '' + this.commonService.baseUrl + '/api/prophoto/' + prophotoid + ''
    return this.http.delete<any>(url,
      // {
      //   headers: {
      //     Authorization: "Bearer " + localStorage.getItem("token"),
      //     Accept: "application/json" //the token is a variable which holds the token
      //   }
      // },
    )
  }



    // // deleteProPhoto(prophotoid: any) {
    //   // deleteProPhoto(prophotoid: any,imagedata: any) {
    //     deleteProPhoto(x: any) {


    //     // var url='http://localhost:5000/api/employee/' + item.empid + ''
    //     var url = '' + this.commonService.baseUrl + '/api/prophoto/delete'
    //     return this.http.post<any>(url, x,          // {
    //       //   headers: {
    //       //     Authorization: "Bearer " + localStorage.getItem("token"),
    //       //     Accept: "application/json" //the token is a variable which holds the token
    //       //   }
    //       // },
    //     )
    //   }


}
