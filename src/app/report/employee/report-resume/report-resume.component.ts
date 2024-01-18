import { Component } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report-resume',
  templateUrl: './report-resume.component.html',
  styleUrls: ['./report-resume.component.css']
})
export class ReportResumeComponent {

  title = 'reportviewerapp';
  public reportServiceUrl: any;
  public reportServerUrl: any;
  public reportPath: any;
  public serverServiceAuthorizationToken: any;
  public reportParameters:any;

  reportheader:any=this.commonService.reportheader

  //https://www.youtube.com/watch?v=Ln6rrudjAnU
  //https://help.boldreports.com/embedded-reporting/angular-reporting/report-viewer/reportserver-report/
  //Dynamic parameters fron application at runtime - https://help.boldreports.com/report-viewer-sdk/javascript-reporting/report-viewer/report-parameters/
    constructor(private commonService: CommonService, private router: Router) {
      // Initialize the Report Viewer properties here.
      this.reportServiceUrl = 'https://on-premise-demo.boldreports.com/reporting/reportservice/api/viewer';
      this.reportServerUrl = 'https://on-premise-demo.boldreports.com/reporting/api/site/site1';
      this.reportPath= '/Tutorial Sample/'+ this.commonService.reportname;
      this.serverServiceAuthorizationToken = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imd1ZXN0QGJvbGRyZXBvcnRzLmNvbSIsIm5hbWVpZCI6IjIiLCJ1bmlxdWVfbmFtZSI6IjNmNWJlNDdkLTA3ZjctNDU2MS04OTYzLWUzYjFlMzRlOTIwOSIsIklQIjoiMTM5LjU5LjU2LjkiLCJpc3N1ZWRfZGF0ZSI6IjE3MDQ0NDQwNjIiLCJuYmYiOjE3MDQ0NDQwNjIsImV4cCI6MTcwNTA0ODg2MiwiaWF0IjoxNzA0NDQ0MDYyLCJpc3MiOiJodHRwczovL29uLXByZW1pc2UtZGVtby5ib2xkcmVwb3J0cy5jb20vcmVwb3J0aW5nL3NpdGUvc2l0ZTEiLCJhdWQiOiJodHRwczovL29uLXByZW1pc2UtZGVtby5ib2xkcmVwb3J0cy5jb20vcmVwb3J0aW5nL3NpdGUvc2l0ZTEifQ.sjdOL6MNFIyyF7ggoOFm47oFt4dCcBAfCSSTWoRUKcQ';


      // for Dynamic parameters from application at runtime
      // **************************************************************************************************
      // this.reportPath= '/Tutorial Sample/TestReport(PDS)';
      // this.reportParameters= [{ name: 'MultipleImages', labels: ['1990-0238'], values: ['1990-0238'] }]
      // this.reportParameters= [{ name: 'MultipleImages', labels: ['1994-0001'], values: ['1994-0001'] }]
      // this.reportPath= '/Tutorial Sample/TestReport(resume)';
      // this.reportParameters= [{ name: 'empid', labels: ['Abu-SittehKM'], values: ['1'] },
      //                         // { name: 'projectid', labels: ['1990-0238','1995-0003','1995-0002'], values: ['242','117','215'] }] // For IN clause in mysql
      //                         { name: 'projectid', labels: ['1990-0238','1995-0003','1995-0002'], values: ['242','117','215'] }] // For IN clause in mysql



    }
    ngAfterViewInit(): void {
      // if (this.commonService.reportname=='') {
      //   this.router.navigate(['/'])
      //   return;
      // }
    }

}
