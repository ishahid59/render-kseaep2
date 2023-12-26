import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class ListItemsService {

    // http://localhost:5000  http://localhost:5000
    constructor(private http: HttpClient, private commonService: CommonService) {
    }




  // Used To Goto newly added Record in Empdetail 2023  used in EmpEditmodal/addEmp()
  getMaxListItemsID(listtablename:any) {
    // alert("from getMaxEmpID");
    // var url = 'http://localhost:5000/api/employee/all/'
    var url = '' + this.commonService.baseUrl + '/api/empcombo/maxlistitemsid/' + listtablename + '/'
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
  getListItems(listtablename:any,id: any) {
   
    // var url='http://localhost:5000/api/employee/' + item.empid + ''
    var url = '' + this.commonService.baseUrl + '/api/empcombo/' + listtablename + '/' + id + ''

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










  updateListItems(data: any,listtablename:any) {
    // alert("from updateEmpDegree");
    // var url='http://localhost:5000/api/empdegree/update'
    var url = '' + this.commonService.baseUrl + '/api/empcombo/update/' + listtablename + '/'
    
    return this.http.post<any>(url, data,
      // {
      //   headers: {
      //     Authorization: "Bearer " + localStorage.getItem("token"),
      //     Accept: "application/json" //the token is a variable which holds the token
      //   }
      // },
    )
  }



  addListItems(data: any,listtablename:any) {
    // var url='http://localhost:5000/api/employee/'
    var url = '' + this.commonService.baseUrl + '/api/empcombo/' + listtablename + '/'
    return this.http.post<any>(url, data,
      // {
      //   headers: {
      //     Authorization: "Bearer " + localStorage.getItem("token"),
      //     Accept: "application/json" //the token is a variable which holds the token
      //   }
      // },
    )
  }



  deleteListItems(listid: any,listtablename:any) {

    // var url='http://localhost:5000/api/employee/' + item.empid + ''
    var url = '' + this.commonService.baseUrl + '/api/empcombo/' + listtablename + '/' + listid + ''
    return this.http.delete<any>(url,
      // {
      //   headers: {
      //     Authorization: "Bearer " + localStorage.getItem("token"),
      //     Accept: "application/json" //the token is a variable which holds the token
      //   }
      // },
    )
  }



  // //Get empdegree for component modal for detail
  // getEmpRegDetail(item: any) {
  //   // alert(item)
  //   // var url='http://localhost:5000/api/employee/' + item.empid + ''
  //   var url = '' + this.commonService.baseUrl + '/api/empreg/empregdetails/' + item + ''
    
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













}
