import { Component, ViewChild, QueryList } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../services/employee/employee.service';
import { DatePipe, Location } from '@angular/common';// datepipe used to convert date format to show in html date element
import { EmpDegreeComponent } from '../emp-degree/emp-degree.component';
import { EmpRegComponent } from '../emp-reg/emp-reg.component';

import { Observable, forkJoin, of } from 'rxjs';
// import { EmpEditModalComponent } from '../employee/emp-edit-modal/emp-edit-modal.component';
// import { EmpEditModalComponent } from './employee/emp-edit-modal/emp-edit-modal.component';
import { EmpEditModalComponent } from '../emp-edit-modal/emp-edit-modal.component';
import { EmployeeSearchService } from '../../services/employee/employee-search.service';
import { AuthService } from '../../services/auth.service';


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

  // // comid
  // // department
  // // disciplinesf254
  // // disciplinesf330
  // // empid
  // // employeeid
  // // employeestatus
  // // employee_consultant
  // // expwithotherfirm
  // // firstname
  // // fullname
  // // hiredate
  // imagedata
  // imagedataweb
  // // jobtitle
  // // lastname
  // // middlei
  // // prefix
  // // registration
  // // suffix


  // ComID
  // Department
  // DisciplineSF254
  // DisciplineSF330
  // EmpID
  // EmployeeID
  // EmployeeStatus
  // Employee_Consultant
  // ExpWithOtherFirm
  // Firstname
  // FullName
  // HireDate
  // ImageData
  // ImageDataWeb
  // JobTitle
  // Lastname
  // MiddleI
  // Prefix
  // Registration
  // Suffix


  id: any = null;
  loading2: boolean = false;
  formErrors: any = [{}];
  lstEmpID: any = [];
  findid: any = '';
  cmbEmp: any = [{}];

  // CALL CHILD METHOD
  @ViewChild(EmpDegreeComponent) empdegreecomponent!: EmpDegreeComponent;
  @ViewChild(EmpRegComponent) empregcomponent!: EmpRegComponent;


  constructor(private router: Router, private authService: AuthService, public activatedRoute: ActivatedRoute, private empSearchService: EmployeeSearchService, private empService: EmployeeService, public datePipe: DatePipe, private location: Location) {
    // this.id = this.activatedRoute.snapshot.paramMap.get('id'); //get id parameter
  }


  // CALL CHILD METHOD
  @ViewChild(EmpEditModalComponent)
  private empmainmodalcomponent!: EmpEditModalComponent;//https://stackoverflow.com/questions/54104187/typescript-complain-has-no-initializer-and-is-not-definitely-assigned-in-the-co


  // todo: to load cmbs only when tab is clicked
  degreetabClicked() {
    this.empdegreecomponent.degreetabClicked();
  }

  regtabClicked() {
    this.empregcomponent.regtabClicked();
  }


  // CHECKING ROLE IS DONE FROM SERVER WHEN BUTTON CLICKED.LOCALSTORAGE IS NOT SAFE
  // IT IS COMPLICATED TO ENABLE/DISABLE BUTTONS OR USING isAdmin variable globally for datatable and detail page
  // ******************************************************************************************************************
  //EDIT to use seperate child component for modal and call it from parent
  showEmpMainChildModal() {
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

    this.loading2 = true;
    this.authService.checkRole(this.id, 'Employee Main').subscribe(resp => {
      if (resp === null || resp.EditData == 0) { //if table uaccess_control have no record gor this empid it returns null so null is checked
        // this.checkRole();
        // if (this.isAdmin === false) {
        this.loading2 = false;
        alert("Need permission.");
      }
      else {
        this.empmainmodalcomponent.showChildModal();
      }
      this.loading2 = false;
    },
      err => {
        this.loading2 = false;
        alert(err.message);
      });
  }

    checkAddRole() {
    this.loading2 = false;
    this.authService.checkRole(this.id, 'Employee Main').subscribe(resp => {
      if (resp === null || resp.EditData == 0) { //if table uaccess_control have no record gor this empid it returns null so null is checked
        // this.checkRole();
        // if (this.isAdmin === false) {
        this.loading2 = false;
        alert("Need permission.");
      }
      else {
        this.empmainmodalcomponent.showChildModalAdd();
      }
    },
      err => {
        this.loading2 = false;
        alert(err.message);
      });
  }

  checkDeleteRole() {
    this.loading2 = true;
    this.authService.checkRole(this.id, 'Employee Main').subscribe(resp => {
      if (resp === null || resp.EditData == 0) { //if table uaccess_control have no record gor this empid it returns null so null is checked
        // this.checkRole();
        // if (this.isAdmin === false) {
        this.loading2 = false;
        alert("Need permission.");
      }
      else {
        this.empmainmodalcomponent.callChildModalDelete(this.id);
      }
    },
      err => {
        this.loading2 = false;
        alert(err.message);
      });
  }



  ngOnInit() {

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
    this.fillEmpCmb();//2023
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
    })


  }

//   checkRole() {
  
// // }

//   // checkRole(){
//     // **Must Place it under ngAfterViewInit
//     // CHECK PERMISSION USING ROLE and disable btns when required(not secured in localstorage since user can edit)
//     // ******************************************************************************************
//     this.authService.checkRole(this.id, 'Employee Main').subscribe(resp => {
//       // this.loading2 = true;

//       if (resp === null || resp.EditData === 0) { //if table uaccess_control have no record gor this empid it returns null so null is checked
//         this.isAdmin = false
//         // $("#empdetaileditbtn").attr("disabled", "disabled");
//         // $("#empdetailaddbtn").attr("disabled", "disabled");
//         // $("#empdetaildeletebtn").attr("disabled", "disabled");
//         // alert("Need permission to edit this form. ");
//         // return;
//       }
//       else {
//         this.isAdmin = true;
//       }
//     },
//       err => {
//         alert(err.message);
//       });
//   }



  ngAfterViewInit(): void {

    // // **Must Place it under ngAfterViewInit
    // // CHECK PERMISSION USING ROLE and disable btns when required(not secured in localstorage since user can edit)
    // // ******************************************************************************************
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
  }








  findbyemployeeid() {
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
