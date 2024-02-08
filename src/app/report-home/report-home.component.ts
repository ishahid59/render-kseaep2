import { Component } from '@angular/core';
import { CommonService } from '../services/common.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-report-home',
  templateUrl: './report-home.component.html',
  styleUrls: ['./report-home.component.css']
})

export class ReportHomeComponent {

  constructor( private commonService: CommonService,private router: Router) {
  }




  setReportName(reportName: any,reportHeader:any) {
    // alert();


    this.commonService.reportname = reportName;
    this.commonService.reportheader = reportHeader;

    // this.commonService.dislisttablename=disListTableName;
    // this.listitemscomponent.refreshDatatableListItems();
    // $("#refreshDatatableListItems").click();

    this.router.navigate(['/']);
    
    // this.router.navigate(['ReportResume']);
    setTimeout(() => {
      this.router.navigate(['ReportResume']);
    }, 1);

  }





}
