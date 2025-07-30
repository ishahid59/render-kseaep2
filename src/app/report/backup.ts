// import { Component, Input, ViewChild} from '@angular/core';
// import { CommonService } from '../services/common.service';
// import { Router } from '@angular/router';
// import { ProphotoService } from '../services/project/prophoto.service';

// import { EmployeeSearchService } from '../services/employee/employee-search.service';

// import { NgSelectComponent } from '@ng-select/ng-select';

// import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // test for power bi rpt param
// // import { ProjectSearchService } from '../services/project/project-search.service';
// import { ProjectService } from '../services/project/project.service';


// @Component({
//   selector: 'app-report',
//   templateUrl: './report.component.html',
//   styleUrls: ['./report.component.css']
// })
// export class ReportComponent {



//   // @Input() childempid:any;
//   @Input() childprojectid: any;





//   title = 'reportviewerapp';
//   public reportServiceUrl: any;
//   public reportServerUrl: any;
//   public reportPath: any;
//   public serverServiceAuthorizationToken: any;
//   public reportParameters: any;

//   reportname: any = this.commonService.reportname
//   reportheader: any = this.commonService.reportheader

//   // powerbirpt: any =''; //NOT REQUIRED USING PROPERTY "reportname" this is required for condition in html ngselect
//   // 2025 created for Power bi parameter
//     parameter1:any=''; // test param
//     paramprojectid: any = this.commonService.reportparamprojectid; // for pds report parameter projectid
//     paramempid: any = this.commonService.reportparamempid; // for pds report parameter projectid

//     selectedItem: any = null; // used for restoring the cmb value after coming from prosearch form


//   rawUrl = '';
//   safeUrl: SafeResourceUrl = '';

//   iframevisible: boolean = false;

//   // @ViewChild(NgSelectComponent) mySelect!: NgSelectComponent;//used for ngselect dropdown to close on that second click. chatgpt
//   // @ViewChild(NgSelectComponent) ngSelectComponent!: NgSelectComponent;

//   // chatgpt to use handleClearClick(); to clear all NgSelectComponent use the following way 
//   // also to use multiple ngselect in one for this style will avoid any conflict between controls
//   @ViewChild('empidSelect') empidSelect!: NgSelectComponent;
//   @ViewChild('projectidSelect') projectidSelect!: NgSelectComponent;

//   //used for ngselect dropdown to close on that second click. chatgpt
//   isDropdownOpen = false;
//   dropdownOpen = false; // 2nd option
//   isFocused = false; // to solve abruptly closing after loosing focus
//   findid: any = '';
//   cmbEmp: any = [{}];
//   cmbProject: any = [{}];


//   //https://www.youtube.com/watch?v=Ln6rrudjAnU&t=6s
//   // https://help.boldreports.com/embedded-reporting/angular-reporting/report-viewer/reportserver-report/
//   // https://www.youtube.com/watch?v=MZOw6HkpMi4
//   //https://www.youtube.com/watch?v=Ln6rrudjAnU
//   //https://help.boldreports.com/embedded-reporting/angular-reporting/report-viewer/reportserver-report/
//   //Dynamic parameters fron application at runtime - https://help.boldreports.com/report-viewer-sdk/javascript-reporting/report-viewer/report-parameters/
//   constructor(private sanitizer: DomSanitizer,private projectService: ProjectService, private commonService: CommonService, private router: Router, private proPhotoService: ProphotoService, private empSearchService: EmployeeSearchService) {
    
//     // // on-premise-demo SERVER
//     // //*************************************************************** */
//     // // Initialize the Report Viewer properties here.
//     // this.reportServiceUrl = 'https://on-premise-demo.boldreports.com/reporting/reportservice/api/viewer';
//     // this.reportServerUrl = 'https://on-premise-demo.boldreports.com/reporting/api/site/site1';
//     // // this.reportPath= '/Tutorial Sample/TestReport(PDS)';
//     // this.reportPath = '/Tutorial Sample/' + this.commonService.reportname;
//     // // this.reportPath = '/Tutorial Sample/' + 'TestReport(PDS)';

//     // // this.serverServiceAuthorizationToken = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imd1ZXN0QGJvbGRyZXBvcnRzLmNvbSIsIm5hbWVpZCI6IjIiLCJ1bmlxdWVfbmFtZSI6IjNmNWJlNDdkLTA3ZjctNDU2MS04OTYzLWUzYjFlMzRlOTIwOSIsIklQIjoiMTM5LjU5LjU2LjkiLCJpc3N1ZWRfZGF0ZSI6IjE3MDQ0NDQwNjIiLCJuYmYiOjE3MDQ0NDQwNjIsImV4cCI6MTcwNTA0ODg2MiwiaWF0IjoxNzA0NDQ0MDYyLCJpc3MiOiJodHRwczovL29uLXByZW1pc2UtZGVtby5ib2xkcmVwb3J0cy5jb20vcmVwb3J0aW5nL3NpdGUvc2l0ZTEiLCJhdWQiOiJodHRwczovL29uLXByZW1pc2UtZGVtby5ib2xkcmVwb3J0cy5jb20vcmVwb3J0aW5nL3NpdGUvc2l0ZTEifQ.sjdOL6MNFIyyF7ggoOFm47oFt4dCcBAfCSSTWoRUKcQ';
//     // this.serverServiceAuthorizationToken = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imd1ZXN0QGJvbGRyZXBvcnRzLmNvbSIsIm5hbWVpZCI6IjIiLCJ1bmlxdWVfbmFtZSI6IjNmNWJlNDdkLTA3ZjctNDU2MS04OTYzLWUzYjFlMzRlOTIwOSIsIklQIjoiMTM5LjU5LjU2LjkiLCJpc3N1ZWRfZGF0ZSI6IjE3MDgyNDczMzIiLCJuYmYiOjE3MDgyNDczMzIsImV4cCI6MTcwODg1MjEzMiwiaWF0IjoxNzA4MjQ3MzMyLCJpc3MiOiJodHRwczovL29uLXByZW1pc2UtZGVtby5ib2xkcmVwb3J0cy5jb20vcmVwb3J0aW5nL3NpdGUvc2l0ZTEiLCJhdWQiOiJodHRwczovL29uLXByZW1pc2UtZGVtby5ib2xkcmVwb3J0cy5jb20vcmVwb3J0aW5nL3NpdGUvc2l0ZTEifQ.Up3yhGfwUZNqf45S8-ZZN_8Md6zjtoWYRpKqj5wmVTw'




//    // TRIAL Cloud SERVER(compulink-reports)
//    // *************************************************************** */
//    // Initialize the Report Viewer properties here.
//    this.reportServiceUrl = 'https://service.boldreports.com/api/Viewer';
//    this.reportServerUrl = 'https://compulink-reports.boldreports.com/reporting/api';
//    // this.reportPath= '/Tutorial Sample/TestReport(PDS)';
//    this.reportPath = '/Project/' + this.commonService.reportname;
//   //  this.serverServiceAuthorizationToken = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImlzaGFoaWQud2VibWFpbEBnbWFpbC5jb20iLCJuYW1laWQiOiIxIiwidW5pcXVlX25hbWUiOiI5ZTZkYThkMy04ODZiLTRiNzUtYmQxYi00NzdmOGQ0ZmEzMWIiLCJJUCI6IjEwLjIzNi4yLjEyNCIsImlzc3VlZF9kYXRlIjoiMTcwODI3MTAzNiIsIm5iZiI6MTcwODI3MTAzNiwiZXhwIjoxNzA4ODc1ODM2LCJpYXQiOjE3MDgyNzEwMzYsImlzcyI6Imh0dHBzOi8vY29tcHVsaW5rLXJlcG9ydHMuYm9sZHJlcG9ydHMuY29tL3JlcG9ydGluZy8iLCJhdWQiOiJodHRwczovL2NvbXB1bGluay1yZXBvcnRzLmJvbGRyZXBvcnRzLmNvbS9yZXBvcnRpbmcvIn0.QEe3GPX91GfB0vAf6571ycD6xbJ6Dm4gfh06DH26D8w'
//   // this.serverServiceAuthorizationToken = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImlzaGFoaWQud2VibWFpbEBnbWFpbC5jb20iLCJuYW1laWQiOiIxIiwidW5pcXVlX25hbWUiOiI5ZTZkYThkMy04ODZiLTRiNzUtYmQxYi00NzdmOGQ0ZmEzMWIiLCJJUCI6IjEwLjIzNi4xLjIzIiwiaXNzdWVkX2RhdGUiOiIxNzA4OTQwOTIwIiwibmJmIjoxNzA4OTQwOTIwLCJleHAiOjE3MDk1NDU3MjAsImlhdCI6MTcwODk0MDkyMCwiaXNzIjoiaHR0cHM6Ly9jb21wdWxpbmstcmVwb3J0cy5ib2xkcmVwb3J0cy5jb20vcmVwb3J0aW5nLyIsImF1ZCI6Imh0dHBzOi8vY29tcHVsaW5rLXJlcG9ydHMuYm9sZHJlcG9ydHMuY29tL3JlcG9ydGluZy8ifQ.FkivjAcNHVFxBsk5cx_gkwhhmSmm_l6naKK_ZSAaAXo'
//   // this.serverServiceAuthorizationToken = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImlzaGFoaWQud2VibWFpbEBnbWFpbC5jb20iLCJuYW1laWQiOiIxIiwidW5pcXVlX25hbWUiOiI5ZTZkYThkMy04ODZiLTRiNzUtYmQxYi00NzdmOGQ0ZmEzMWIiLCJJUCI6IjEwLjIzNi4zLjIyIiwiaXNzdWVkX2RhdGUiOiIxNzExNzg5NzQ0IiwibmJmIjoxNzExNzg5NzQ0LCJleHAiOjE3MTIzOTQ1NDQsImlhdCI6MTcxMTc4OTc0NCwiaXNzIjoiaHR0cHM6Ly9jb21wdWxpbmstcmVwb3J0cy5ib2xkcmVwb3J0cy5jb20vcmVwb3J0aW5nLyIsImF1ZCI6Imh0dHBzOi8vY29tcHVsaW5rLXJlcG9ydHMuYm9sZHJlcG9ydHMuY29tL3JlcG9ydGluZy8ifQ.ZHhDMmMeT8Cb9cW3NG0o07X3qgpOJ45uqvloASVr2cU'
//   // this.serverServiceAuthorizationToken = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImlzaGFoaWQud2VibWFpbEBnbWFpbC5jb20iLCJuYW1laWQiOiIxIiwidW5pcXVlX25hbWUiOiI5ZTZkYThkMy04ODZiLTRiNzUtYmQxYi00NzdmOGQ0ZmEzMWIiLCJJUCI6IjEwLjIzNi4yLjIyOSIsImlzc3VlZF9kYXRlIjoiMTcwOTcyMDg3MSIsIm5iZiI6MTcwOTcyMDg3MSwiZXhwIjoxNzEwMzI1NjcxLCJpYXQiOjE3MDk3MjA4NzEsImlzcyI6Imh0dHBzOi8vY29tcHVsaW5rLXJlcG9ydHMuYm9sZHJlcG9ydHMuY29tL3JlcG9ydGluZy8iLCJhdWQiOiJodHRwczovL2NvbXB1bGluay1yZXBvcnRzLmJvbGRyZXBvcnRzLmNvbS9yZXBvcnRpbmcvIn0.9yAvj9gk2jIgxla1N09db_juijOe-E-OKb15gc2_2gw'
//   // this.serverServiceAuthorizationToken ="bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImlzaGFoaWQud2VibWFpbEBnbWFpbC5jb20iLCJuYW1laWQiOiIxIiwidW5pcXVlX25hbWUiOiI5ZTZkYThkMy04ODZiLTRiNzUtYmQxYi00NzdmOGQ0ZmEzMWIiLCJJUCI6IjEwLjIzNi4wLjEyNiIsImlzc3VlZF9kYXRlIjoiMTcxMzEwMTA3OSIsIm5iZiI6MTcxMzEwMTA3OSwiZXhwIjoxNzEzNzA1ODc5LCJpYXQiOjE3MTMxMDEwNzksImlzcyI6Imh0dHBzOi8vY29tcHVsaW5rLXJlcG9ydHMuYm9sZHJlcG9ydHMuY29tL3JlcG9ydGluZy8iLCJhdWQiOiJodHRwczovL2NvbXB1bGluay1yZXBvcnRzLmJvbGRyZXBvcnRzLmNvbS9yZXBvcnRpbmcvIn0.vfbyB_2FoNlK_6D8gATu78hJ4JpZRY-8UrUuELyklLU"
//   this.serverServiceAuthorizationToken ="bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImlzaGFoaWQud2VibWFpbEBnbWFpbC5jb20iLCJuYW1laWQiOiIxIiwidW5pcXVlX25hbWUiOiI5ZTZkYThkMy04ODZiLTRiNzUtYmQxYi00NzdmOGQ0ZmEzMWIiLCJJUCI6IjEwLjIzNi4wLjcwIiwiaXNzdWVkX2RhdGUiOiIxNzE1ODM2NTE1IiwibmJmIjoxNzE1ODM2NTE1LCJleHAiOjE3MTY0NDEzMTUsImlhdCI6MTcxNTgzNjUxNSwiaXNzIjoiaHR0cHM6Ly9jb21wdWxpbmstcmVwb3J0cy5ib2xkcmVwb3J0cy5jb20vcmVwb3J0aW5nLyIsImF1ZCI6Imh0dHBzOi8vY29tcHVsaW5rLXJlcG9ydHMuYm9sZHJlcG9ydHMuY29tL3JlcG9ydGluZy8ifQ.lB1u1Rl2c7hTQ-SsK2jsPZJmcqG1G3HD8qLD-Rk1dhM"
   







//     // for Dynamic parameters from application at runtime
//     // **************************************************************************************************
//     // this.reportPath= '/Tutorial Sample/TestReport(PDS)';
//     // this.reportParameters= [{ name: 'MultipleImages', labels: ['1990-0238'], values: ['1990-0238'] }]
//     // this.reportParameters= [{ name: 'MultipleImages', labels: ['1994-0001'], values: ['1994-0001'] }]
//     // this.reportParameters= [{ name: 'pds1ImgParameter', labels: ['Photo6.jpg'], values: ['Photo6.jpg'] }]
//     // this.reportPath= '/Tutorial Sample/TestReport(resume)';
//     // this.reportParameters= [{ name: 'empid', labels: ['Abu-SittehKM'], values: ['1'] },
//     //                         // { name: 'projectid', labels: ['1990-0238','1995-0003','1995-0002'], values: ['242','117','215'] }] // For IN clause in mysql
//     //                         { name: 'projectid', labels: ['1990-0238','1995-0003','1995-0002'], values: ['242','117','215'] }] // For IN clause in mysql


//     // var projectno:any=$("#reportViewer_Control_Param_101_hidden").val();
//     //  alert(this.commonService.reportProjectNo);









//     // for Dynamic parameters from application at runtime
//     // **************************************************************************************************
//     // let projectno: any = this.commonService.reportProjectNo
//     // this.proPhotoService.getImageData(this.commonService.reportProjectID).subscribe(resp => {

//     //   let pds1ImgParameter:any='';
//     //   let pds2ImgParameter:any='';
//     //   let pds3ImgParameter:any='';
//     //   let pds4ImgParameter:any='';

//     //   if (resp.length > 0) {
//     //     if (typeof resp[0] !== 'undefined') {pds1ImgParameter = resp[0].ImageData;}
//     //     if (typeof resp[1] !== 'undefined') {pds2ImgParameter = resp[1].ImageData;}
//     //     if (typeof resp[2] !== 'undefined') {pds3ImgParameter = resp[2].ImageData;}  
//     //     if (typeof resp[3] !== 'undefined') {pds4ImgParameter = resp[3].ImageData;}
//     //   }

//     //   if (resp.length > 0) {
//     //     this.reportParameters = [{ name: 'MultipleImages', labels: [projectno], values: [projectno] },
//     //     { name: 'pds1ImgParameter', labels: [pds1ImgParameter], values: [pds1ImgParameter] },
//     //     { name: 'pds2ImgParameter', labels: [pds2ImgParameter], values: [pds2ImgParameter] },
//     //     { name: 'pds3ImgParameter', labels: [pds3ImgParameter], values: [pds3ImgParameter] },
//     //     { name: 'pds4ImgParameter', labels: [pds4ImgParameter], values: [pds4ImgParameter] },
//     //     ]
//     //   } else {
//     //     this.reportParameters = [{ name: 'MultipleImages', labels: [projectno], values: [projectno] },
//     //     { name: 'pds1ImgParameter', labels: [], values: [] },
//     //     { name: 'pds2ImgParameter', labels: [], values: [] },
//     //     { name: 'pds3ImgParameter', labels: [], values: [] },
//     //     { name: 'pds4ImgParameter', labels: [], values: [] },
//     //     ]
//     //   }


//     // },
//     //   err => {
//     //     alert(err.message);

//     //   });

//     // //   this.reportParameters= [{ name: 'MultipleImages', labels: ['1990-0238'], values: ['1990-0238'] },
//     // //   { name: 'pds1ImgParameter', labels: ['Photo1_1569500048.jpg'], values: ['Photo1_1569500048.jpg'] },
//     // //   { name: 'pds2ImgParameter', labels: ['Photo2_1569055528.jpg'], values: ['Photo2_1569055528.jpg'] },
//     // //   { name: 'pds3ImgParameter', labels: ['Photo3_1569055552.jpg'], values: ['Photo3_1569055552.jpg'] },
//     // //   { name: 'pds4ImgParameter', labels: ['Photo4_1569056418.jpg'], values: ['Photo4_1569056418.jpg'] },
//     // // ]


//   }


  
//   // Go to prosearch form to select multiple projects
//   openProjectSearch() {

//   // test - open component in new tab
//   // window.open('/ProjectSearch/', '_blank');
  

//     this.commonService.selectedItem = 2//this.findid //store the id of cmb before going to prosearch form to restore later
//     this.router.navigate(['ProjectSearch']);
//   }



//   ngOnInit() {
//   //  // to set the previous cmb value, if coming from projectsearch selecting multiple projects
//   //   if (this.commonService.selectedItem) {
//   //       this.selectedItem = this.commonService.selectedItem; 
//   //   }

//     // To go to Report Home page if refresh is clicked on chrome window
//     // else going to "Report Viewer" Blank Page which should be avoided
//     if (this.commonService.reportname == '') {
//       // this.router.navigate(['/']);
//       this.router.navigate(['ReportHome']);
//       return
//     }

//     this.fillEmpCmb();
//     this.fillProjectCmb();
//   }

  


//   // NOT USING HERE MOVED TO GENERATE REPORT METHOD AFTER COMBO IN REPORT PAGE
//   ngAfterViewInit(): void {


//     if (this.commonService.selectedItem) {
//       this.selectedItem = this.commonService.selectedItem;
//       this.paramempid = 2//this.commonService.selectedItem;
//       this.findid = 2
//       this.generatereport();
//     }

//     // not using this even with bold report
//     // if (this.commonService.reportname=='') {
//     //   this.router.navigate(['/'])
//     //   return;
//     // }

//     // // 2025 created for Power bi. using powerbi-resume-06
//     // if (this.commonService.reportname == 'Report_Resume') {
//     //   this.powerbirpt = 'resume';

//     //   // //for power bi sanatize url with param-resume. if needed use "&clientSideAuth=false"
//     //   // this.rawUrl = "https://app.powerbi.com/rdlEmbed?reportId=999821b0-cc66-459e-8338-01c7c736ceb9&autoAuth=true&ctid=d16fe3ee-a81a-45be-8c93-d1db70f836eb&experience=power-bi&rs:embed=true&rp:Parameter1="+ this.paramempid +"";
//     //   // this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.rawUrl);
//     // }
//     // // . using powerbi-pds-06
//     // if (this.commonService.reportname == 'Report_PDS') {
//     //   this.powerbirpt = 'pds';

//     // // //for power bi sanatize url with param
//     // //   this.rawUrl = "https://app.powerbi.com/rdlEmbed?reportId=751f59f1-689d-48a5-94c8-233c392c2af5&autoAuth=true&ctid=d16fe3ee-a81a-45be-8c93-d1db70f836eb&experience=power-bi&rs:embed=true&rp:Parameter1="+ this.paramprojectid +"";
//     // //   this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.rawUrl);
//     // }
    
//   }







//   // 2025 to use with ngselect
//   // using $event to get current id in html and pass to ts file-->
//   // https://stackoverflow.com/questions/65868830/ng-select-get-value-by-id -->
//   setfindid(x: any) {
//     // alert(x.EmpID)
//     //  this.test2=false;
//     this.findid = ''
//     if (x) {
//       this.findid = x.EmpID; //2025 if x is null then console giving err but with no problem. so condition is used
//       this.commonService.reportparamempid = x.EmpID;
//       this.paramempid = x.EmpID;
//     }
//   }


//   setfindid2(x: any) {
//     // alert(x.EmpID)
//     //  this.test2=false;
//     this.findid = ''
//     if (x) {
//       this.findid = x.ProjectID; //2025 if x is null then console giving err but with no problem. so condition is used
//       this.commonService.reportparamprojectid = x.ProjectID;
//       this.paramprojectid = x.ProjectID;
//     }
//   }


//   // to close dropdown on click
//   toggleDropdown(select: NgSelectComponent) {
//     if (this.dropdownOpen) {
//       select.close();
//     } //else {
//     if (this.isFocused == true) {
//       select.open();
//       // select.open();// second time called because when select losses focus and then clicked dropdown open and closes abruptly
//     }
//     this.dropdownOpen = !this.dropdownOpen;
//     this.isFocused = false;

//   }



//   onFocus() {
//     this.isFocused = true;
//   }



//   generatereport(){

//     // ***************************************************************************
//     // CHECK IF PARAMETERS ARE EMPTY
//     // ***************************************************************************
//     if (this.findid == '' && this.commonService.reportname == 'Report_Resume') {
//       alert("Please select employee for resume")
//       return
//     }
//     if (this.findid == '' && this.commonService.reportname == 'Report_PDS') {
//       alert("Please select project for pds")
//       return
//     }


//     // ***************************************************************************
//     // SANATIZE URL TO ACCEPT CUSTOM PARAMTERS
//     // ***************************************************************************
//      if (this.commonService.reportname == 'Report_Resume') {  // using powerbi-resume-06
//       //for power bi sanatize url with param-resume. if needed use "&clientSideAuth=false"
//       this.rawUrl = "https://app.powerbi.com/rdlEmbed?reportId=999821b0-cc66-459e-8338-01c7c736ceb9&autoAuth=true&ctid=d16fe3ee-a81a-45be-8c93-d1db70f836eb&experience=power-bi&rs:embed=true&rp:Parameter1="+ this.paramempid +"";
//       this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.rawUrl);
//     }
//     if (this.commonService.reportname == 'Report_PDS') {// using powerbi-pds-06
//     //for power bi sanatize url with param
//       this.rawUrl = "https://app.powerbi.com/rdlEmbed?reportId=751f59f1-689d-48a5-94c8-233c392c2af5&autoAuth=true&ctid=d16fe3ee-a81a-45be-8c93-d1db70f836eb&experience=power-bi&rs:embed=true&rp:Parameter1="+ this.paramprojectid +"";
//       this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.rawUrl);
//     }


//     // ***************************************************************************
//     // LOAD ITE IFRAME TO LOAD REPORT VIEWER
//     // ***************************************************************************
//      this.iframevisible = true; // will show iframe with new data, also can be used as refresh



//     // ***************************************************************************
//      // CLEAR THE COMBO AFTER REPORT GENERATE IF REQUIRED
//     // ***************************************************************************
//     // this.ngSelectComponent.handleClearClick(); // this line swowing err in console but no problem
//     this.empidSelect.handleClearClick(); 
//     this.projectidSelect.clearModel();    
//     this.findid = '';
//     this.paramempid='';
//     this.paramprojectid='';
 
//   }







//   // NOT USING NOW IN generatereport()
//   findbyemployeeid() {
//     //2025 this is uded for ngselect. For claring after search btn clicked so that placeholder shows
//     //https://stackoverflow.com/questions/56646397/how-to-clear-ng-select-selection
//     // this.ngSelectComponent.handleClearClick(); // this line swowing err in console but no problem
//     this.empidSelect.handleClearClick(); // clears country select
//     this.projectidSelect.handleClearClick();    // clears city select
//   }


//   backtoreport() {
//     this.router.navigate(['ReportHome']);
//   }


  
//   // Fill all combos in one function using forkJoin of rxjx
//   fillEmpCmb() {
//     this.empSearchService.getCmbEmp().subscribe(resp => {
//       this.cmbEmp = resp;
//     },
//       err => {
//         alert(err.message);
//       });
//   }



//   // Fill all combos in one function using forkJoin of rxjx
//   fillProjectCmb() {
//     this.projectService.getCmbProject().subscribe(resp => {
//       this.cmbProject = resp;
//       // console.log(resp);
//     },
//       err => {
//         alert(err.message);
//       });
//   }







// }
