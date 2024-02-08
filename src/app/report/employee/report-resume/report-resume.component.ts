import { Component, Input } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { Router } from '@angular/router';
import { ProphotoService } from '../../../services/project/prophoto.service';

@Component({
  selector: 'app-report-resume',
  templateUrl: './report-resume.component.html',
  styleUrls: ['./report-resume.component.css']
})

export class ReportResumeComponent {

  // @Input() childempid:any;
  @Input() childprojectid: any;


  title = 'reportviewerapp';
  public reportServiceUrl: any;
  public reportServerUrl: any;
  public reportPath: any;
  public serverServiceAuthorizationToken: any;
  public reportParameters: any;

  reportheader: any = this.commonService.reportheader

  //https://www.youtube.com/watch?v=Ln6rrudjAnU
  //https://help.boldreports.com/embedded-reporting/angular-reporting/report-viewer/reportserver-report/
  //Dynamic parameters fron application at runtime - https://help.boldreports.com/report-viewer-sdk/javascript-reporting/report-viewer/report-parameters/
  constructor(private commonService: CommonService, private router: Router, private proPhotoService: ProphotoService,) {
    // Initialize the Report Viewer properties here.
    this.reportServiceUrl = 'https://on-premise-demo.boldreports.com/reporting/reportservice/api/viewer';
    this.reportServerUrl = 'https://on-premise-demo.boldreports.com/reporting/api/site/site1';
    // this.reportPath= '/Tutorial Sample/TestReport(PDS)';
    this.reportPath = '/Tutorial Sample/' + this.commonService.reportname;
    // this.reportPath = '/Tutorial Sample/' + 'TestReport(PDS)';

    // this.serverServiceAuthorizationToken = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imd1ZXN0QGJvbGRyZXBvcnRzLmNvbSIsIm5hbWVpZCI6IjIiLCJ1bmlxdWVfbmFtZSI6IjNmNWJlNDdkLTA3ZjctNDU2MS04OTYzLWUzYjFlMzRlOTIwOSIsIklQIjoiMTM5LjU5LjU2LjkiLCJpc3N1ZWRfZGF0ZSI6IjE3MDQ0NDQwNjIiLCJuYmYiOjE3MDQ0NDQwNjIsImV4cCI6MTcwNTA0ODg2MiwiaWF0IjoxNzA0NDQ0MDYyLCJpc3MiOiJodHRwczovL29uLXByZW1pc2UtZGVtby5ib2xkcmVwb3J0cy5jb20vcmVwb3J0aW5nL3NpdGUvc2l0ZTEiLCJhdWQiOiJodHRwczovL29uLXByZW1pc2UtZGVtby5ib2xkcmVwb3J0cy5jb20vcmVwb3J0aW5nL3NpdGUvc2l0ZTEifQ.sjdOL6MNFIyyF7ggoOFm47oFt4dCcBAfCSSTWoRUKcQ';
    this.serverServiceAuthorizationToken = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imd1ZXN0QGJvbGRyZXBvcnRzLmNvbSIsIm5hbWVpZCI6IjIiLCJ1bmlxdWVfbmFtZSI6IjNmNWJlNDdkLTA3ZjctNDU2MS04OTYzLWUzYjFlMzRlOTIwOSIsIklQIjoiMTM5LjU5LjU2LjkiLCJpc3N1ZWRfZGF0ZSI6IjE3MDcxODcyMzgiLCJuYmYiOjE3MDcxODcyMzgsImV4cCI6MTcwNzc5MjAzOCwiaWF0IjoxNzA3MTg3MjM4LCJpc3MiOiJodHRwczovL29uLXByZW1pc2UtZGVtby5ib2xkcmVwb3J0cy5jb20vcmVwb3J0aW5nL3NpdGUvc2l0ZTEiLCJhdWQiOiJodHRwczovL29uLXByZW1pc2UtZGVtby5ib2xkcmVwb3J0cy5jb20vcmVwb3J0aW5nL3NpdGUvc2l0ZTEifQ.VtHjfTQMGDNaEbVQzOucNq6yLEfPT3Cv4iNZikndH3M'

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
