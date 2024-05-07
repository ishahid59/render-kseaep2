// import { Injectable } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../common.service';

@Injectable({
  providedIn: 'root'
})
export class ProposalService {

     // http://localhost:5000  http://localhost:5000
     constructor(private http: HttpClient, private commonService: CommonService) {
    }



  

  getCmbProposal() {
    // var url = 'http://localhost:5000/api/employee/all/'
    var url = '' + this.commonService.baseUrl + '/api/proposal/all/'
    return this.http.get<any>(url)
  }

  getProposal(proposalid: any) {
    // var url='http://localhost:5000/api/employee/empdetails/' + empid + ''
    var url = '' + this.commonService.baseUrl + '/api/proposal/' + proposalid + ''
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
  

  getProposalDetail(proposalid: any) {
    // var url='http://localhost:5000/api/employee/empdetails/' + empid + ''
    var url = '' + this.commonService.baseUrl + '/api/proposal/proposaldetails/' + proposalid + ''
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
  getCaoFromModal(caoid: any) {
    // var url='http://localhost:5000/api/employee/' + item.empid + ''
    var url = '' + this.commonService.baseUrl + '/api/cao/' + caoid + ''

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


  updateProposal(data: any) {
    // var url='http://localhost:5000/api/employee/update'
    var url = '' + this.commonService.baseUrl + '/api/proposal/update/'
    return this.http.post<any>(url, data,
      // {
      //   headers: {
      //     Authorization: "Bearer " + localStorage.getItem("token"),
      //     Accept: "application/json" //the token is a variable which holds the token
      //   }
      // },
    )
  }



  addProposal(data: any) {
    // var url='http://localhost:5000/api/employee/'
    var url = '' + this.commonService.baseUrl + '/api/proposal/'
    return this.http.post<any>(url, data,
      // {
      //   headers: {
      //     Authorization: "Bearer " + localStorage.getItem("token"),
      //     Accept: "application/json" //the token is a variable which holds the token
      //   }
      // },
    )
  }

  deleteProposal(proposalid: any) {
  
    // var url='http://localhost:5000/api/employee/' + item.empid + ''
    var url = '' + this.commonService.baseUrl + '/api/proposal/' + proposalid + ''
    return this.http.delete<any>(url,
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
  deleteCaoFromModal(caoid:any) {
    // alert("from delete" + item.empid);
    // var url='http://localhost:5000/api/employee/' + item.empid + ''
    var url = '' + this.commonService.baseUrl + '/api/cao/' + caoid + ''
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
    getMaxProposalID() {
      // alert("from getMaxEmpID");
      // var url = 'http://localhost:5000/api/employee/all/'
      var url = '' + this.commonService.baseUrl + '/api/proposal/maxproposalid/'
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
  getDuplicateProposalNo(proposalno: any) {
    // alert("from getMaxEmpID");
    // var url = 'http://localhost:5000/api/employee/all/'
    var url = '' + this.commonService.baseUrl + '/api/proposal/duplicateproposalno/' + proposalno + '/'
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
  
    // Used To Goto newly added Record in Empdetail 2023  used in EmpEditmodal/addEmp()
    getDuplicateCaoNo(caono:any) {
      // alert("from getMaxEmpID");
      // var url = 'http://localhost:5000/api/employee/all/'
      var url = '' + this.commonService.baseUrl + '/api/cao/duplicatecaono/' + caono + ''
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
