import { Component, Input } from '@angular/core';
import { CommonService } from '../services/common.service';
import { Router } from '@angular/router';
import { ProphotoService } from '../services/project/prophoto.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent {



  // @Input() childempid:any;
  @Input() childprojectid: any;


  title = 'reportviewerapp';
  public reportServiceUrl: any;
  public reportServerUrl: any;
  public reportPath: any;
  public serverServiceAuthorizationToken: any;
  public reportParameters: any;

  reportheader: any = this.commonService.reportheader
  
  //https://www.youtube.com/watch?v=Ln6rrudjAnU&t=6s
  // https://help.boldreports.com/embedded-reporting/angular-reporting/report-viewer/reportserver-report/
  // https://www.youtube.com/watch?v=MZOw6HkpMi4
  //https://www.youtube.com/watch?v=Ln6rrudjAnU
  //https://help.boldreports.com/embedded-reporting/angular-reporting/report-viewer/reportserver-report/
  //Dynamic parameters fron application at runtime - https://help.boldreports.com/report-viewer-sdk/javascript-reporting/report-viewer/report-parameters/
  constructor(private commonService: CommonService, private router: Router, private proPhotoService: ProphotoService,) {
    
    // // on-premise-demo SERVER
    // //*************************************************************** */
    // // Initialize the Report Viewer properties here.
    // this.reportServiceUrl = 'https://on-premise-demo.boldreports.com/reporting/reportservice/api/viewer';
    // this.reportServerUrl = 'https://on-premise-demo.boldreports.com/reporting/api/site/site1';
    // // this.reportPath= '/Tutorial Sample/TestReport(PDS)';
    // this.reportPath = '/Tutorial Sample/' + this.commonService.reportname;
    // // this.reportPath = '/Tutorial Sample/' + 'TestReport(PDS)';

    // // this.serverServiceAuthorizationToken = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imd1ZXN0QGJvbGRyZXBvcnRzLmNvbSIsIm5hbWVpZCI6IjIiLCJ1bmlxdWVfbmFtZSI6IjNmNWJlNDdkLTA3ZjctNDU2MS04OTYzLWUzYjFlMzRlOTIwOSIsIklQIjoiMTM5LjU5LjU2LjkiLCJpc3N1ZWRfZGF0ZSI6IjE3MDQ0NDQwNjIiLCJuYmYiOjE3MDQ0NDQwNjIsImV4cCI6MTcwNTA0ODg2MiwiaWF0IjoxNzA0NDQ0MDYyLCJpc3MiOiJodHRwczovL29uLXByZW1pc2UtZGVtby5ib2xkcmVwb3J0cy5jb20vcmVwb3J0aW5nL3NpdGUvc2l0ZTEiLCJhdWQiOiJodHRwczovL29uLXByZW1pc2UtZGVtby5ib2xkcmVwb3J0cy5jb20vcmVwb3J0aW5nL3NpdGUvc2l0ZTEifQ.sjdOL6MNFIyyF7ggoOFm47oFt4dCcBAfCSSTWoRUKcQ';
    // this.serverServiceAuthorizationToken = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imd1ZXN0QGJvbGRyZXBvcnRzLmNvbSIsIm5hbWVpZCI6IjIiLCJ1bmlxdWVfbmFtZSI6IjNmNWJlNDdkLTA3ZjctNDU2MS04OTYzLWUzYjFlMzRlOTIwOSIsIklQIjoiMTM5LjU5LjU2LjkiLCJpc3N1ZWRfZGF0ZSI6IjE3MDgyNDczMzIiLCJuYmYiOjE3MDgyNDczMzIsImV4cCI6MTcwODg1MjEzMiwiaWF0IjoxNzA4MjQ3MzMyLCJpc3MiOiJodHRwczovL29uLXByZW1pc2UtZGVtby5ib2xkcmVwb3J0cy5jb20vcmVwb3J0aW5nL3NpdGUvc2l0ZTEiLCJhdWQiOiJodHRwczovL29uLXByZW1pc2UtZGVtby5ib2xkcmVwb3J0cy5jb20vcmVwb3J0aW5nL3NpdGUvc2l0ZTEifQ.Up3yhGfwUZNqf45S8-ZZN_8Md6zjtoWYRpKqj5wmVTw'




   // TRIAL Cloud SERVER(compulink-reports)
   // *************************************************************** */
   // Initialize the Report Viewer properties here.
   this.reportServiceUrl = 'https://service.boldreports.com/api/Viewer';
   this.reportServerUrl = 'https://compulink-reports.boldreports.com/reporting/api';
   // this.reportPath= '/Tutorial Sample/TestReport(PDS)';
   this.reportPath = '/Project/' + this.commonService.reportname;
  //  this.serverServiceAuthorizationToken = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImlzaGFoaWQud2VibWFpbEBnbWFpbC5jb20iLCJuYW1laWQiOiIxIiwidW5pcXVlX25hbWUiOiI5ZTZkYThkMy04ODZiLTRiNzUtYmQxYi00NzdmOGQ0ZmEzMWIiLCJJUCI6IjEwLjIzNi4yLjEyNCIsImlzc3VlZF9kYXRlIjoiMTcwODI3MTAzNiIsIm5iZiI6MTcwODI3MTAzNiwiZXhwIjoxNzA4ODc1ODM2LCJpYXQiOjE3MDgyNzEwMzYsImlzcyI6Imh0dHBzOi8vY29tcHVsaW5rLXJlcG9ydHMuYm9sZHJlcG9ydHMuY29tL3JlcG9ydGluZy8iLCJhdWQiOiJodHRwczovL2NvbXB1bGluay1yZXBvcnRzLmJvbGRyZXBvcnRzLmNvbS9yZXBvcnRpbmcvIn0.QEe3GPX91GfB0vAf6571ycD6xbJ6Dm4gfh06DH26D8w'
  // this.serverServiceAuthorizationToken = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImlzaGFoaWQud2VibWFpbEBnbWFpbC5jb20iLCJuYW1laWQiOiIxIiwidW5pcXVlX25hbWUiOiI5ZTZkYThkMy04ODZiLTRiNzUtYmQxYi00NzdmOGQ0ZmEzMWIiLCJJUCI6IjEwLjIzNi4xLjIzIiwiaXNzdWVkX2RhdGUiOiIxNzA4OTQwOTIwIiwibmJmIjoxNzA4OTQwOTIwLCJleHAiOjE3MDk1NDU3MjAsImlhdCI6MTcwODk0MDkyMCwiaXNzIjoiaHR0cHM6Ly9jb21wdWxpbmstcmVwb3J0cy5ib2xkcmVwb3J0cy5jb20vcmVwb3J0aW5nLyIsImF1ZCI6Imh0dHBzOi8vY29tcHVsaW5rLXJlcG9ydHMuYm9sZHJlcG9ydHMuY29tL3JlcG9ydGluZy8ifQ.FkivjAcNHVFxBsk5cx_gkwhhmSmm_l6naKK_ZSAaAXo'
  // this.serverServiceAuthorizationToken = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImlzaGFoaWQud2VibWFpbEBnbWFpbC5jb20iLCJuYW1laWQiOiIxIiwidW5pcXVlX25hbWUiOiI5ZTZkYThkMy04ODZiLTRiNzUtYmQxYi00NzdmOGQ0ZmEzMWIiLCJJUCI6IjEwLjIzNi4zLjIyIiwiaXNzdWVkX2RhdGUiOiIxNzExNzg5NzQ0IiwibmJmIjoxNzExNzg5NzQ0LCJleHAiOjE3MTIzOTQ1NDQsImlhdCI6MTcxMTc4OTc0NCwiaXNzIjoiaHR0cHM6Ly9jb21wdWxpbmstcmVwb3J0cy5ib2xkcmVwb3J0cy5jb20vcmVwb3J0aW5nLyIsImF1ZCI6Imh0dHBzOi8vY29tcHVsaW5rLXJlcG9ydHMuYm9sZHJlcG9ydHMuY29tL3JlcG9ydGluZy8ifQ.ZHhDMmMeT8Cb9cW3NG0o07X3qgpOJ45uqvloASVr2cU'
  // this.serverServiceAuthorizationToken = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImlzaGFoaWQud2VibWFpbEBnbWFpbC5jb20iLCJuYW1laWQiOiIxIiwidW5pcXVlX25hbWUiOiI5ZTZkYThkMy04ODZiLTRiNzUtYmQxYi00NzdmOGQ0ZmEzMWIiLCJJUCI6IjEwLjIzNi4yLjIyOSIsImlzc3VlZF9kYXRlIjoiMTcwOTcyMDg3MSIsIm5iZiI6MTcwOTcyMDg3MSwiZXhwIjoxNzEwMzI1NjcxLCJpYXQiOjE3MDk3MjA4NzEsImlzcyI6Imh0dHBzOi8vY29tcHVsaW5rLXJlcG9ydHMuYm9sZHJlcG9ydHMuY29tL3JlcG9ydGluZy8iLCJhdWQiOiJodHRwczovL2NvbXB1bGluay1yZXBvcnRzLmJvbGRyZXBvcnRzLmNvbS9yZXBvcnRpbmcvIn0.9yAvj9gk2jIgxla1N09db_juijOe-E-OKb15gc2_2gw'
  this.serverServiceAuthorizationToken =""//"bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImlzaGFoaWQud2VibWFpbEBnbWFpbC5jb20iLCJuYW1laWQiOiIxIiwidW5pcXVlX25hbWUiOiI5ZTZkYThkMy04ODZiLTRiNzUtYmQxYi00NzdmOGQ0ZmEzMWIiLCJJUCI6IjEwLjIzNi4wLjEyNiIsImlzc3VlZF9kYXRlIjoiMTcxMzEwMTA3OSIsIm5iZiI6MTcxMzEwMTA3OSwiZXhwIjoxNzEzNzA1ODc5LCJpYXQiOjE3MTMxMDEwNzksImlzcyI6Imh0dHBzOi8vY29tcHVsaW5rLXJlcG9ydHMuYm9sZHJlcG9ydHMuY29tL3JlcG9ydGluZy8iLCJhdWQiOiJodHRwczovL2NvbXB1bGluay1yZXBvcnRzLmJvbGRyZXBvcnRzLmNvbS9yZXBvcnRpbmcvIn0.vfbyB_2FoNlK_6D8gATu78hJ4JpZRY-8UrUuELyklLU"

   



    // for Dynamic parameters from application at runtime
    // **************************************************************************************************
    // this.reportPath= '/Tutorial Sample/TestReport(PDS)';
    // this.reportParameters= [{ name: 'MultipleImages', labels: ['1990-0238'], values: ['1990-0238'] }]
    // this.reportParameters= [{ name: 'MultipleImages', labels: ['1994-0001'], values: ['1994-0001'] }]
    // this.reportParameters= [{ name: 'pds1ImgParameter', labels: ['Photo6.jpg'], values: ['Photo6.jpg'] }]
    // this.reportPath= '/Tutorial Sample/TestReport(resume)';
    // this.reportParameters= [{ name: 'empid', labels: ['Abu-SittehKM'], values: ['1'] },
    //                         // { name: 'projectid', labels: ['1990-0238','1995-0003','1995-0002'], values: ['242','117','215'] }] // For IN clause in mysql
    //                         { name: 'projectid', labels: ['1990-0238','1995-0003','1995-0002'], values: ['242','117','215'] }] // For IN clause in mysql


    // var projectno:any=$("#reportViewer_Control_Param_101_hidden").val();
    //  alert(this.commonService.reportProjectNo);









    // for Dynamic parameters from application at runtime
    // **************************************************************************************************
    // let projectno: any = this.commonService.reportProjectNo
    // this.proPhotoService.getImageData(this.commonService.reportProjectID).subscribe(resp => {

    //   let pds1ImgParameter:any='';
    //   let pds2ImgParameter:any='';
    //   let pds3ImgParameter:any='';
    //   let pds4ImgParameter:any='';

    //   if (resp.length > 0) {
    //     if (typeof resp[0] !== 'undefined') {pds1ImgParameter = resp[0].ImageData;}
    //     if (typeof resp[1] !== 'undefined') {pds2ImgParameter = resp[1].ImageData;}
    //     if (typeof resp[2] !== 'undefined') {pds3ImgParameter = resp[2].ImageData;}  
    //     if (typeof resp[3] !== 'undefined') {pds4ImgParameter = resp[3].ImageData;}
    //   }

    //   if (resp.length > 0) {
    //     this.reportParameters = [{ name: 'MultipleImages', labels: [projectno], values: [projectno] },
    //     { name: 'pds1ImgParameter', labels: [pds1ImgParameter], values: [pds1ImgParameter] },
    //     { name: 'pds2ImgParameter', labels: [pds2ImgParameter], values: [pds2ImgParameter] },
    //     { name: 'pds3ImgParameter', labels: [pds3ImgParameter], values: [pds3ImgParameter] },
    //     { name: 'pds4ImgParameter', labels: [pds4ImgParameter], values: [pds4ImgParameter] },
    //     ]
    //   } else {
    //     this.reportParameters = [{ name: 'MultipleImages', labels: [projectno], values: [projectno] },
    //     { name: 'pds1ImgParameter', labels: [], values: [] },
    //     { name: 'pds2ImgParameter', labels: [], values: [] },
    //     { name: 'pds3ImgParameter', labels: [], values: [] },
    //     { name: 'pds4ImgParameter', labels: [], values: [] },
    //     ]
    //   }


    // },
    //   err => {
    //     alert(err.message);

    //   });

    // //   this.reportParameters= [{ name: 'MultipleImages', labels: ['1990-0238'], values: ['1990-0238'] },
    // //   { name: 'pds1ImgParameter', labels: ['Photo1_1569500048.jpg'], values: ['Photo1_1569500048.jpg'] },
    // //   { name: 'pds2ImgParameter', labels: ['Photo2_1569055528.jpg'], values: ['Photo2_1569055528.jpg'] },
    // //   { name: 'pds3ImgParameter', labels: ['Photo3_1569055552.jpg'], values: ['Photo3_1569055552.jpg'] },
    // //   { name: 'pds4ImgParameter', labels: ['Photo4_1569056418.jpg'], values: ['Photo4_1569056418.jpg'] },
    // // ]






  }







  
  ngAfterViewInit(): void {
    // if (this.commonService.reportname=='') {
    //   this.router.navigate(['/'])
    //   return;
    // }


  }






}
