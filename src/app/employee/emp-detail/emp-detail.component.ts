import { Component, ViewChild, QueryList } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../services/employee/employee.service';
import { DatePipe, Location } from '@angular/common';// datepipe used to convert date format to show in html date element
import { EmpDegreeComponent } from '../emp-degree/emp-degree.component';
import { EmpRegComponent } from '../emp-reg/emp-reg.component';
import { EmpTrainingComponent } from '../emp-training/emp-training.component';
import { EmpExpsummaryComponent } from '../emp-expsummary/emp-expsummary.component';
import { EmpPrevemploymentComponent } from '../emp-prevemployment/emp-prevemployment.component';
import { EmpDisciplinesf330Component } from '../emp-disciplinesf330/emp-disciplinesf330.component';


import { Observable, forkJoin, of } from 'rxjs';
// import { EmpEditModalComponent } from '../employee/emp-edit-modal/emp-edit-modal.component';
// import { EmpEditModalComponent } from './employee/emp-edit-modal/emp-edit-modal.component';
import { EmpEditModalComponent } from '../emp-edit-modal/emp-edit-modal.component';
import { EmployeeSearchService } from '../../services/employee/employee-search.service';
import { AuthService } from '../../services/auth.service';
import { CommonService } from '../../services/common.service';
import {callJSFun} from './Javascriptfun.js'; // test
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-emp-detail',
  templateUrl: './emp-detail.component.html',
  styleUrls: ['./emp-detail.component.css'],
})

 
export class EmpDetailComponent {

  emp: any = {};
  //{{emp.empid}} giving error in console so converted to "empid" only for interpolation 
  empid: any = 0;
  employeeid: any = "";
  fullname: any = "";
  prefix: any = "";
  firstname: any = "";
  lastname: any = "";
  middlei: any = "";
  suffix: any = "";
  hiredate: any = "";



  comid: any = "";
  department: any = "";
  jobtitle: any = "";
  registration: any = "";
  consultant: any = 0;
  disciplinesf254: any = "";
  disciplinesf330: any = "";
  employeestatus: any = "";
  expwithotherfirm: any = "";

  isAdmin: boolean=false;
  // user_role: any = "";  // now user_role value is checked in app.component and user_role value is saved in common.services


  loadempdegree:boolean=false;
  loadempreg:boolean=false;
  loademptraining:boolean=false;
  loadempmembership:boolean=false;
  loadempexpsummary:boolean=false;
  loadempprevemployment:boolean=false;
  loadempdisciplinesf330:boolean=false;
  loadempresumetext:boolean=false;

  id: any = null;
  loading2: boolean = false;
  formErrors: any = [{}];
  lstEmpID: any = [];
  findid: any = '';
  cmbEmp: any = [{}];


  //used for ngselect dropdown to close on that second click. chatgpt
  isDropdownOpen = false;
  dropdownOpen = false; // 2nd option
  isFocused = false; // to solve abruptly closing after loosing focus


  // CALL CHILD METHOD
  @ViewChild(EmpDegreeComponent) empdegreecomponent!: EmpDegreeComponent;
  @ViewChild(EmpRegComponent) empregcomponent!: EmpRegComponent;


  constructor(private router: Router,private commonService: CommonService, private authService: AuthService, public activatedRoute: ActivatedRoute, private empSearchService: EmployeeSearchService, private empService: EmployeeService, public datePipe: DatePipe, private location: Location) {
    // this.id = this.activatedRoute.snapshot.paramMap.get('id'); //get id parameter
  }


  // CALL CHILD METHOD
  @ViewChild(EmpEditModalComponent)
  private empmainmodalcomponent!: EmpEditModalComponent;//https://stackoverflow.com/questions/54104187/typescript-complain-has-no-initializer-and-is-not-definitely-assigned-in-the-co
  @ViewChild(NgSelectComponent) mySelect!: NgSelectComponent;//used for ngselect dropdown to close on that second click. chatgpt

  @ViewChild(NgSelectComponent) ngSelectComponent!: NgSelectComponent;


  // when searchable is on in html clicking in ngselect input doesnt close the dropdown
  // So the below 2 options can be used to manually close, but when the input looses 
  // focus the dropdown closing abruptly when clicked so the if (this.isFocused == true) is used 
  //************************************************************************************************** */
  //   toggleDropdown(select: NgSelectComponent) {
  //     if (this.dropdownOpen && this.isFocused == true) {
  //       select.close();
  //     } else {
  //       select.open();
  //     }
  //  this.dropdownOpen = !this.dropdownOpen;
  // }

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

  // // 2nd option  
  // handleClick(event: MouseEvent, select: any) {
  //   if (this.isDropdownOpen) {
  //     select.close();
  //   } else {
  //     select.open();
  //   }
  //   this.isDropdownOpen = !this.isDropdownOpen;
  // }


  onFocus() {
    this.isFocused = true;

  }

  


  // load tab data cmbs only when tab is clicked.  *ngIf="loadempdegree" is used in html.
  // Other option is to load child data with the empdetail which will take initial loading time
  degreetabClicked() {
    // this.empdegreecomponent.degreetabClicked();
    this.loadempdegree=true;
  }
  regtabClicked() {
    // this.empregcomponent.regtabClicked();
    this.loadempreg=true;
  }
  trainingtabClicked() {
    // this.empregcomponent.regtabClicked();
    this.loademptraining=true;
  }
  membershiptabClicked() {
    // this.empregcomponent.regtabClicked();
    this.loadempmembership=true;
  }
  expsummarytabClicked() {
    // this.empregcomponent.regtabClicked();
    this.loadempexpsummary=true;
  }
  prevemploymenttabClicked() {
    // this.empregcomponent.regtabClicked();
    this.loadempprevemployment=true;
  }
  disciplinesf330tabClicked() {
    // this.empregcomponent.regtabClicked();
    this.loadempdisciplinesf330=true;
  }
  empresumetexttabClicked() {
    // this.empregcomponent.regtabClicked();
    this.loadempresumetext=true;
  }

  // CHECKING ROLE IS DONE FROM SERVER WHEN BUTTON CLICKED.LOCALSTORAGE IS NOT SAFE
  // IT IS COMPLICATED TO ENABLE/DISABLE BUTTONS OR USING isAdmin variable globally for datatable and detail page
  // ******************************************************************************************************************
  //EDIT to use seperate child component for modal and call it from parent
  showEmpMainChildModal() {
    // this.checkRole();
    this.checkEditRole();
    // this.empmainmodalcomponent.showChildModal();
  }
  showEmpMainChildModalAdd() {
    this.checkAddRole();
      //this.empmainmodalcomponent.showChildModalAdd();
  }
  callEmpMainChildModalDelete() {
    this.checkDeleteRole();
      //this.empmainmodalcomponent.callChildModalDelete(this.id);
  }



  // CHECKING ROLE IS DONE FROM SERVER WHEN BUTTON CLICKED.LOCALSTORAGE IS NOT SAFE
  // IT IS COMPLICATED TO ENABLE/DISABLE BUTTONS OR USING isAdmin variable globally for datatable and detail page
  // ******************************************************************************************************************
  checkEditRole() {

    // this.loading2 = true;
    // this.authService.checkRole(this.id, 'Employee Main').subscribe(resp => {
    //   if (resp === null || resp.EditData == 0) { //if table uaccess_control have no record gor this empid it returns null so null is checked
    //     // this.checkRole();
    //     // if (this.isAdmin === false) {
    //     this.loading2 = false;
    //     alert("Need permission.");
    //   }
    //   else {
    //     this.empmainmodalcomponent.showChildModal();
    //   }
    //   this.loading2 = false;
    // },
    //   err => {
    //     this.loading2 = false;
    //     alert(err.message);
    //   });


    // this.checkRole();
    // if (this.isAdmin === false) {
    // if (this.user_role === 'guest') {
    // now user_role value is checked in app.component and user_role value is saved in common.services
    
    // if (this.commonService.user_role === 'guest') { 
    //   alert("Need permission.");
    // }
    // else {
    //   this.empmainmodalcomponent.showChildModal();
    //   // this.loading2=false;
    // }


    // ****TODO We will use common service to check role
    // We may also use data from uassecc_control table for detail role check for all module individually
    if (this.commonService.checkEditRole()) {
      this.empmainmodalcomponent.showChildModal();
    }

  }

  checkAddRole() {
    // if (this.isAdmin === false) {
    // if (this.user_role === 'guest' || this.user_role === 'user' ) {
    //  if (this.commonService.user_role === 'guest' || this.commonService.user_role === 'user' ) {
    //   alert("Need permission.");
    // }
    // else {
    //   this.empmainmodalcomponent.showChildModalAdd();
    // }
    if (this.commonService.checkAddRole()) {
      this.empmainmodalcomponent.showChildModalAdd();
    }
  }

  checkDeleteRole() {
    // if (this.isAdmin === false) {
    // if (this.user_role === 'guest' || this.user_role === 'user' ) {
    // if (this.commonService.user_role === 'guest' || this.commonService.user_role === 'user' ) {
    //   alert("Need permission.");
    // }
    // else {
    //   this.empmainmodalcomponent.callChildModalDelete(this.id);
    // }
    if (this.commonService.checkDeleteRole()) {
      this.empmainmodalcomponent.callChildModalDelete(this.id);
    }
  }













  ngOnInit() {

    callJSFun();
    // this.authService.checkRole(this.id, 'Employee Main').subscribe(resp => {
    //   this.loading2 = false;

    //   if (resp === null || resp.EditData == 0) { //if table uaccess_control have no record gor this empid it returns null so null is checked
    //     this.isAdmin = false
    //     // $("#empdetaileditbtn").attr("disabled", "disabled");
    //     // $("#empdetailaddbtn").attr("disabled", "disabled");
    //     // $("#empdetaildeletebtn").attr("disabled", "disabled");
    //     // alert("Need permission to edit this form. ");
    //     // return;
    //   }
    //   else {
    //     this.isAdmin = true;
    //   }
    // },
    //   err => {
    //     alert(err.message);
    //   });



    // this.loadEmpDetail();
    // this.fillEmpCmb();//2023
    // //child tabs initially will be updated using parent to child @Input()
    // //On emp cmb search child tabs will be updated using this.empdegreecomponent.loadAngularDatatable(); in findbyemployeeid() method

    // // option1
    // this.id = this.activatedRoute.snapshot.paramMap.get('id'); //get id parameter
    // this.emp = this.loadEmpDetail();
    // this.fillEmpCmb();


    // OPTION2  https://www.youtube.com/watch?v=b4zpvh_saic&list=PL1BztTYDF-QNrtkvjkT6Wjc8es7QB4Gty&index=65
    // ngOnInit() only called once so empcmb click will not refresh page. So we are using observable 
    this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id')
      this.emp = this.loadEmpDetail();
      this.findid = this.id; // set the initial value findid
      // **2023 checkRole(); For checking role everytime employee is changed 
      // ********************************************************************
      // now user_role value is checked in app.component and user_role value is saved in common.services
      // this.checkRole();   
      
    })


  }

  // Check role from uaccess_control table
  // checkRole() {
  //   // ** CHECK PERMISSION USING ROLE from server (not secured in localstorage since user can edit). 
  //   // Disabling btns by checking role is too complicated and needs dttable refresh
  //   // *************************************************************************************************

  //   // this.loading2 = true;
  //   // $("#empdetaileditbtn").attr("disabled", "disabled");
    
  //   // this.authService.checkRole(this.fkid, 'Employee Main').subscribe(resp => {
  //   this.authService.checkRole(this.id, 'Employee Main').subscribe(resp => {
  //     this.loading2 = true;
  //     if (resp === null || resp.EditData === 0) { //if table uaccess_control have no record gor this empid it returns null so null is checked

  //     this.isAdmin = false
  //       // $("#empdetaileditbtn").removeAttr('disabled');
  //       this.loading2 = false;
  //     }
  //     else {
  //       this.isAdmin = true;
  //       // $("#empdetaileditbtn").removeAttr('disabled');
  //       this.loading2 = false;
  //     }
  //   },
  //     err => {
  //       alert(err.message);
  //       this.loading2 = false;
  //     });

  //   // this.loading2 = false;
  // }




  // // Check role from users table
  // checkRole() {

  //   // ** CHECK PERMISSION USING ROLE from server (not secured in localstorage since user can edit). 
  //   // Disabling btns by checking role is too complicated and needs dttable refresh
  //   // New concept: hashed password is storied in localstorage and using that check user role from database
  //   // ******************************************************************************************************

  //   // this.loading2 = true;
  //   // $("#empdetaileditbtn").attr("disabled", "disabled");
    
  //   // this.authService.checkRole(this.fkid, 'Employee Main').subscribe(resp => {
  //   // this.authService.checkRole(this.id, 'Employee Main').subscribe(resp => {
  //     this.authService.checkUserRole().subscribe(resp => {
  //     this.loading2 = true;


  //     // if (resp === null || resp.EditData === 0) { //if table uaccess_control have no record gor this empid it returns null so null is checked
  //     if (resp.user_role === 'admin') { //if table uaccess_control have no record gor this empid it returns null so null is checked
  //     this.isAdmin = true
  //       // $("#empdetaileditbtn").removeAttr('disabled');
  //       this.loading2 = false;
  //     }
  //     else {
  //       this.isAdmin = false;
  //       // $("#empdetaileditbtn").removeAttr('disabled');
  //       this.loading2 = false;
  //     }
  //   },
  //     err => {
  //       alert(err.message);
  //       this.loading2 = false;
  //     });

  //   // this.loading2 = false;
  // }



  
  // now user_role value is checked in app.component and user_role value is saved in common.services
  // // Check role from users table
  // checkRole() {
  //   // ** CHECK PERMISSION USING ROLE from server (not secured in localstorage since user can edit). 
  //   // Disabling btns by checking role is too complicated and needs dttable refresh
  //   // New concept: hashed password is storied in localstorage and using that check user role from database
  //   // ******************************************************************************************************

  //   // this.loading2 = true;
  //   this.authService.checkUserRole().subscribe(resp => {
  //     this.loading2 = true;
  //     this.user_role = resp.user_role;
  //     this.loading2 = false;
  //   },
  //     err => {
  //       alert(err.message);
  //       this.loading2 = false;
  //     });
  //   // this.loading2 = false;
  // }




  ngAfterViewInit(): void {
      // // moved to observable in this.ngOnInit()
      // // **For checking role everytime employee is changed
      // // ********************************************************
      // this.checkRole();

     
  }




  // 2025 to use with ngselect
  // using $event to get current id in html and pass to ts file-->
  // https://stackoverflow.com/questions/65868830/ng-select-get-value-by-id -->
  setfindid(x: any) {
    // alert(x.ProjectID)
    if (x) {
      this.findid = x.EmpID; //2025 if x is null then console giving err but with no problem. so condition is used
    }


  }



  findbyemployeeid() {

    //2025 this is uded for ngselect. For claring after search btn clicked so that placeholder shows
    //https://stackoverflow.com/questions/56646397/how-to-clear-ng-select-selection
    this.ngSelectComponent.handleClearClick(); // this line swowing err in console but no problem

    //**NOW REFRESH DATATABLE AFTER SEARCH COMBO CHANGE IS DONE IN CHILD COMPONENT IN ngAfterViewInit WITH OBSERVABLE  */
    // SO DONT NEED IT NOW. BUT MAY NEED LATER.

    
    
    // // https://medium.com/@mvivek3112/reloading-components-when-change-in-route-params-angular-deed6107c6bb
    // this.router.navigate(['/Empdetail/' + this.findid + '']);

    // // after many search browser back only changes url not the page. So following is used so that going back
    // // with take to datatable page without showing all the search pages in url
    // // https://stackoverflow.com/questions/38891002/angular-2-replace-history-instead-of-pushing
    // this.location.replaceState('/Empdetail/' + this.findid + '');


    // // // this will load whole page
    // // setTimeout(() => {
    // //  location.reload();
    // // }, 1);


    // //Async observable: https://stackoverflow.com/questions/52115904/how-to-call-a-function-after-the-termination-of-another-function-in-angular/52116252

    // //this will only update emp
    // setTimeout(() => {
    //   this.id = this.activatedRoute.snapshot.paramMap.get('id'); //get id parameter
    //   this.loadEmpDetail()
    // }, 2);

    // setTimeout(() => {
    //   this.empdegreecomponent.loadAngularDatatable();
    // }, 3);
    // this.id = this.activatedRoute.snapshot.paramMap.get('id');
    // setTimeout(() => {
    // this.empdegreecomponent.loadAngularDatatable();
    // }, 3);
  }



  // findbyemployeeid() {

  //   this.findid = $("#selectemployeeid").val();

  //   // to find detail page for emp but looses history and reloads entire page
  //   // this :key is used for fid by Employeeid in detail page to avoid whole page reload . This :key will
  //   // check for any change in route and remount the page without reloading. History is also preserved   -->
  //   // https://laracasts.com/discuss/channels/vue/vue-2-reload-component-when-same-route-is-requested?page=1 -->
  //   // this line is added in master.blade.php <router-view :key="$route.fullPath"></router-view>
  //   this.$router.push({
  //     name: "empdetail", // name property of this route must be used in route list to use with parameter
  //     params: { empid: this.findid },
  //     query: { this: this.findid } // query param is used to pass empid to detail page to use it for refresh(id is lost in detail page when page is refreshed)
  //   });
  // },



  loadEmpDetail() {

 
    // alert("empdetail loaded");

    // this.id = this.activatedRoute.snapshot.paramMap.get('id'); //get id parameter
    this.loading2 = true;

    this.empService.getEmpdetail(this.id).subscribe(resp => {
      
      this.emp = resp;
      this.commonService.setButtonStatus(); // disable btn if no permission

      this.empid = resp.EmpID; //2023
      this.comid = resp.ComID; //2023
      this.department = resp.Department; //2023
      this.disciplinesf254 = resp.DisciplineSF254; //2023
      this.disciplinesf330 = resp.DisciplineSF330; //2023
      this.employeeid = resp.EmployeeID,
      this.employeestatus = resp.EmployeeStatus; //2023
      this.consultant = resp.Employee_Consultant,
      this.expwithotherfirm = resp.ExpWithOtherFirm; //2023
      this.firstname = resp.Firstname,
      this.fullname = resp.FullName,
      this.hiredate = resp.HireDate,
      this.jobtitle = resp.JobTitle,
      this.lastname = resp.Lastname,
      this.middlei = resp.MiddleI; //2023
      this.prefix = resp.Prefix; //2023
      this.registration = resp.Registration,
      this.suffix = resp.Suffix; //2023



      this.loading2 = false;

      this.fillEmpCmb();// added 2023 to refresh cmb when new emp added
      // alert(this.jobtitle);
    },
      err => {
        alert(err.message);
        this.loading2 = false;
      });
  }




  // Fill all combos in one function using forkJoin of rxjx
  fillEmpCmb() {

    this.empSearchService.getCmbEmp().subscribe(resp => {
      this.cmbEmp = resp;
      // console.log(resp);
    },
      err => {
        alert(err.message);
      });

  }
  

}
