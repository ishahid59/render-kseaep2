import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../common.service';

@Injectable({
  providedIn: 'root'
})
 
 
export class ProjectSearchService {
  // http://localhost:5000  http://localhost:5000
  constructor(private http: HttpClient, private commonService: CommonService) {
 }
 
 getCmbProPrimaryProjectType() {
   // var url = 'http://localhost:5000/api/empregistration/'
   var url = '' + this.commonService.baseUrl + '/api/procombo/cmbproprimaryprojecttype/'
   return this.http.get<any>(url)
 }
 
 // {"proprole":proprole.recordset},
 // {"empmain":empmain.recordset},
 // {"proocategory":proocategory.recordset},
 // {"commain":commain.recordset},
 // {"projecttype":projecttype.recordset},
 // {"caomain":caomain.recordset},
 // {"prostatus":prostatus.recordset},
 // {"empprojectrole":empprojectrole.recordset},   
 // {"proposalmain":proposalmain.recordset},   
 
 getCmbProPRole() {
   // var url = 'http://localhost:5000/api/empregistration/'
   var url = '' + this.commonService.baseUrl + '/api/procombo/cmbproprole/'
   return this.http.get<any>(url)
 }
 getCmbEmpMain() {
   // var url = 'http://localhost:5000/api/empregistration/'
   var url = '' + this.commonService.baseUrl + '/api/procombo/cmbempmain/'
   return this.http.get<any>(url)
 }
 getCmbProOCategory() {
   // var url = 'http://localhost:5000/api/empregistration/'
   var url = '' + this.commonService.baseUrl + '/api/procombo/cmbproocategory/'
   return this.http.get<any>(url)
 }
 getCmbComMain() {
   // var url = 'http://localhost:5000/api/empregistration/'
   var url = '' + this.commonService.baseUrl + '/api/procombo/cmbcommain/'
   return this.http.get<any>(url)
 }
 getCmbProjectType() {
   // var url = 'http://localhost:5000/api/empregistration/'
   var url = '' + this.commonService.baseUrl + '/api/procombo/cmbprojecttype/'
   return this.http.get<any>(url)
 }
 getCmbProjectTypeMulti() {
  // var url = 'http://localhost:5000/api/empregistration/'
  var url = '' + this.commonService.baseUrl + '/api/procombo/cmbprojecttypemulti/'
  return this.http.get<any>(url)
}
 getSecProjectTypeValue(projectid: any) {
   // var url = 'http://localhost:5000/api/empregistration/'
   var url = '' + this.commonService.baseUrl + '/api/procombo/secprojecttypevalue/' + projectid + ''
   return this.http.get<any>(url)
 }
 getCmbCaoMain() {
   // var url = 'http://localhost:5000/api/empregistration/'
   var url = '' + this.commonService.baseUrl + '/api/procombo/cmbcaomain/'
   return this.http.get<any>(url)
 }
 getCmbProStatus() {
   // var url = 'http://localhost:5000/api/empregistration/'
   var url = '' + this.commonService.baseUrl + '/api/procombo/cmbprostatus/'
   return this.http.get<any>(url)
 }
 getCmbEmpProjectRole() {
   // var url = 'http://localhost:5000/api/empregistration/'
   var url = '' + this.commonService.baseUrl + '/api/procombo/cmbempprojectrole/'
   return this.http.get<any>(url)
 }
 getCmbProposalMain() {
   // var url = 'http://localhost:5000/api/empregistration/'
   var url = '' + this.commonService.baseUrl + '/api/procombo/cmbproposalmain/'
   return this.http.get<any>(url)
 }
 getCmbProposalStatus() {
  // var url = 'http://localhost:5000/api/empregistration/'
  var url = '' + this.commonService.baseUrl + '/api/procombo/cmbproposalstatus/'
  return this.http.get<any>(url)
}

getCmbCmbProjectAwardStatus() {
  // var url = 'http://localhost:5000/api/empregistration/'
  var url = '' + this.commonService.baseUrl + '/api/procombo/cmbprojectawardstatus/'
  return this.http.get<any>(url)
}
 
 getCmbProDescItem() {
   // var url = 'http://localhost:5000/api/empregistration/'
   var url = '' + this.commonService.baseUrl + '/api/procombo/cmbprodesitem/'
   return this.http.get<any>(url)
 }
 getCmbProProfilecodeSF254() {
   // var url = 'http://localhost:5000/api/empregistration/'  
   var url = '' + this.commonService.baseUrl + '/api/procombo/cmbproprofilecodesf254/'
   return this.http.get<any>(url)
 }
 getCmbProProfilecodeSF330() {
   // var url = 'http://localhost:5000/api/empregistration/'  
   var url = '' + this.commonService.baseUrl + '/api/procombo/cmbproprofilecodesf330/'
   return this.http.get<any>(url)
 }

 getCmbProPhoto() {
  // var url = 'http://localhost:5000/api/empregistration/'
  var url = '' + this.commonService.baseUrl + '/api/procombo/cmbprophoto/'
  return this.http.get<any>(url)
}

 
 
 }
