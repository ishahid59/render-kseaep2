import { Component, ViewChild } from '@angular/core';
import { CommonService } from '../services/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgSelectComponent } from '@ng-select/ng-select';
import { EmployeeSearchService } from '../services/employee/employee-search.service';
import { retry } from 'rxjs';


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


  // @ViewChild(NgSelectComponent) mySelect!: NgSelectComponent;//used for ngselect dropdown to close on that second click. chatgpt
  // @ViewChild(NgSelectComponent) ngSelectComponent!: NgSelectComponent;


  // chatgpt to use handleClearClick(); to clear all NgSelectComponent use the following way 
  // also to use multiple ngselect in one for this style will avoid any conflict between controls
  @ViewChild('empidSelect') empidSelect!: NgSelectComponent;

  // NOT USING. Used for combo in modal form
  ngOnInit() {
    this.fillEmpCmb();
  }
  

  // NOT USING. Used for combo in modal form
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



  // NOT USING. Used for combo in modal form
  onFocus() {
    this.isFocused = true;
  }


  // NOT USING for combo in modal form
  // 2025 to use with ngselect
  // using $event to get current id in html and pass to ts file-->
  // https://stackoverflow.com/questions/65868830/ng-select-get-value-by-id -->
  setfindid(x: any) {
    // alert(x.ProjectID)
    if (x) {
      this.findid = x.EmpID; //2025 if x is null then console giving err but with no problem. so condition is used
    this.commonService.selectedEmpID=x.EmpID;
    }
  }


  // NOT USING. Used for combo in modal form
  // Fill all combos in one function using forkJoin of rxjx
  fillEmpCmb() {
    this.empSearchService.getCmbEmp().subscribe(resp => {
      this.cmbEmp = resp;
    },
      err => {
        alert(err.message);
      });
  }

  
  // NOT USING. Used for combo in modal form
  findbyemployeeid() {
    //2025 this is uded for ngselect. For claring after search btn clicked so that placeholder shows
    //https://stackoverflow.com/questions/56646397/how-to-clear-ng-select-selection
    // this.ngSelectComponent.handleClearClick(); // this line swowing err in console but no problem
    this.empidSelect.handleClearClick(); // NOW USING ID empidSelect TO AVOID ERRORS
  }




  // USING THIS FOR COMBO IN REPORT PAGE INSTEAD OF MODAL FORM
  setReportName(reportName: any,reportHeader:any) {

    this.commonService.reportname = reportName;
    this.commonService.reportheader = reportHeader;

    // must clear id's here before opening form
    this.commonService.selectedEmpID = null;
    this.commonService.selectedProjectID = null;


    // this.commonService.dislisttablename=disListTableName;
    // this.listitemscomponent.refreshDatatableListItems();
    // $("#refreshDatatableListItems").click();



    // WITH CUSTOMIZED PARAMETERS WITHOUT MODAL, COMBO IN THE REPORT PAGE
    // **************************************************************************
    // this.router.navigate(['ReportResume']);
    setTimeout(() => {
      // this.router.navigate(['ReportResume']);
      this.router.navigate(['Report']);
      // this.router.navigate(['/ReportResume/' + reportName+'/'+reportHeader]);
    }, 1);
  

    // // WITHOUT CUSTOMIZED PARAMETERS
    // // ***********************************************************
    // // this.router.navigate(['ReportResume']);
    // setTimeout(() => {
    //   // this.router.navigate(['ReportResume']);
    //   this.router.navigate(['Report']);
    //   // this.router.navigate(['/ReportResume/' + reportName+'/'+reportHeader]);
    // }, 1);

    
    // // WITH CUSTOMIZED PARAMETERS AND MODAL FORM
    // // ********************************************************************
    // if (this.commonService.reportname == 'Report_Resume') {
    //     $('#btnRptEmpResumeModalShow').click();// table_emp_projects -->
    // }
    // if (this.commonService.reportname == 'Report_PDS') {
    //   // $('#btnRptEmpResumeModalShow').click();
    //   alert("pds")
    // }

  


  }

  // NOT USING. Used for combo in modal form
  // WITH CUSTOMIZED PARAMETERS CALLED FROM MODAL FORM
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
