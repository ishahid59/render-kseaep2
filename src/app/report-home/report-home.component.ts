import { Component, ViewChild } from '@angular/core';
import { CommonService } from '../services/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgSelectComponent } from '@ng-select/ng-select';
import { EmployeeSearchService } from '../services/employee/employee-search.service';


@Component({
  selector: 'app-report-home',
  templateUrl: './report-home.component.html',
  styleUrls: ['./report-home.component.css']
})

export class ReportHomeComponent {


  //used for ngselect dropdown to close on that second click. chatgpt
  isDropdownOpen = false;
  dropdownOpen = false; // 2nd option
  isFocused = false; // to solve abruptly closing after loosing focus
  findid: any = '';
  cmbEmp: any = [{}];

  constructor( private commonService: CommonService,private router: Router, private empSearchService: EmployeeSearchService) {
  }


  @ViewChild(NgSelectComponent) mySelect!: NgSelectComponent;//used for ngselect dropdown to close on that second click. chatgpt
  @ViewChild(NgSelectComponent) ngSelectComponent!: NgSelectComponent;


  ngOnInit() {
    this.fillEmpCmb();
  }
  

  // to close dropdown on click
  toggleDropdown(select: NgSelectComponent) {
    if (this.dropdownOpen) {
      select.close();
    } //else {
    if (this.isFocused == true) {
      select.open();
      // select.open();// second time called because when select losses focus and then clicked dropdown open and closes abruptly
    }
    this.dropdownOpen = !this.dropdownOpen;
    this.isFocused = false;
  }



  onFocus() {
    this.isFocused = true;
  }



  // 2025 to use with ngselect
  // using $event to get current id in html and pass to ts file-->
  // https://stackoverflow.com/questions/65868830/ng-select-get-value-by-id -->
  setfindid(x: any) {
    // alert(x.ProjectID)
    if (x) {
      this.findid = x.EmpID; //2025 if x is null then console giving err but with no problem. so condition is used
    this.commonService.reportparamempid=x.EmpID;
    }
  }


  // Fill all combos in one function using forkJoin of rxjx
  fillEmpCmb() {
    this.empSearchService.getCmbEmp().subscribe(resp => {
      this.cmbEmp = resp;
    },
      err => {
        alert(err.message);
      });
  }

  

  findbyemployeeid() {
    //2025 this is uded for ngselect. For claring after search btn clicked so that placeholder shows
    //https://stackoverflow.com/questions/56646397/how-to-clear-ng-select-selection
    this.ngSelectComponent.handleClearClick(); // this line swowing err in console but no problem
  }




  setReportName(reportName: any,reportHeader:any) {
    // alert();


    this.commonService.reportname = reportName;
    this.commonService.reportheader = reportHeader;

    // this.commonService.dislisttablename=disListTableName;
    // this.listitemscomponent.refreshDatatableListItems();
    // $("#refreshDatatableListItems").click();

    // this.router.navigate(['/']);
    

    // // this.router.navigate(['ReportResume']);
    // setTimeout(() => {
    //   // this.router.navigate(['ReportResume']);
    //   this.router.navigate(['Report']);
    //   // this.router.navigate(['/ReportResume/' + reportName+'/'+reportHeader]);
    // }, 1);

    

    if (this.commonService.reportname == 'TestReport(resume)2') {
        $('#btnRptEmpResumeModalShow').click();// table_emp_projects -->
    }
    if (this.commonService.reportname == 'TestReport(PDS)3') {
      // $('#btnRptEmpResumeModalShow').click();
      alert("pds")
    }

  


  }

  generatereport(){

    if (this.findid=='') {
      alert("Please select employee for resume")
      return
    }

    $("#btnRptEmpResumeCloseModal").click();
    
    setTimeout(() => {
      // this.router.navigate(['ReportResume']);
      this.router.navigate(['Report']);
      // this.router.navigate(['/ReportResume/' + reportName+'/'+reportHeader]);
    }, 1);

  }





}
