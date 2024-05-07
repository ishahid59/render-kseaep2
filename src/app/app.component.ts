import { Component, ViewChild,HostListener } from '@angular/core';
import { CommonService } from './services/common.service';
import { Subject } from 'rxjs';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { observable,of as observableOf  } from 'rxjs';
import { LoginComponent } from './login/login.component';
import { ListItemsComponent } from './list-items/list-items.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})



export class AppComponent {

  constructor(public authService: AuthService,private router: Router, private commonService: CommonService) {}

  // myappser:AppService =new AppService();
  changingValue: Subject<boolean> = new Subject();
  title = 'angulardttest';
  logedin:boolean=true;

email:any=localStorage.getItem('email');
isRoleAdmin:boolean=false;

// // CALL CHILD METHOD
// @ViewChild(ListItemsComponent) listitemscomponent!:ListItemsComponent;

  // CALL CHILD METHOD
  @ViewChild(ListItemsComponent)
  private listitemscomponent!: ListItemsComponent;//https://stackoverflow.com/questions/54104187/typescript-complain-has-no-initializer-and-is-not-definitely-assigned-in-the-co


  ngOnInit() {
    // alert("main init")

    // app component ngoninit always runs browser is refreshed and initially when app starts
    // so we can run check role and save in common services

    // this.checkRole();
    // this.getUserRoles();
    // 2024 used condition to avoid console error when checking role without any data in localStorage
    if (localStorage.getItem('hashedpassword') != null) {
      this.checkRole();
      this.getUserRoles();
    }

    // setTimeout(()=>{
    //   this.getUserRoles();
    // }, 150);




  }


  ngAfterViewInit(): void {

  }

 


 ngOnDestroy() {
    // alert("main destroyed")
  }

 
  
  logout() {
    this.router.navigate(['/']);
    localStorage.removeItem('token');
    localStorage.removeItem('hashedpassword');//2023 used to check roles securely without directly storing role in localstorage
    localStorage.removeItem('email'); //using to show user logo //2023
    this.authService.isLoggedIn$ = observableOf(false);

    // location reload is called to forcefully refresh login form after logout else it doesnt triger ondestroy() second time and dasboard doesnt show after login
    // location.reload();
    setTimeout(() => {
      location.reload(); // may be need to turn off 
    }, 1);
    // this.authService.logedOut=true; //added later to hide login form when looged in
    // $(".wrapper").css("margin-left","0px !important");
  }




  // 2023 Check role from users table
  checkRole() {
    // ** CHECK PERMISSION USING ROLE from server (not secured in localstorage since user can edit). 
    // Disabling btns by checking role is too complicated and needs dttable refresh
    // New concept: hashed password is storied in localstorage and using that check user role from database
    // ******************************************************************************************************

    // this.loading2 = true;
    this.authService.checkUserRole().subscribe(resp => {
      this.commonService.user_role = resp.user_role;

      // to control visibility of admin menu items
      if (resp.user_role=='admin') {
        this.isRoleAdmin=true;
      } else {
        this.isRoleAdmin=false;
      }


      // this.loading2 = false;
    },
      err => {
        //2024 db server down err for "0 unknown error"
        if (err.status === 0) {
          // alert(err.error.errors[0].msg);
          alert("Cannot connect with database server.\n(app.component-checkRole())");
        }else{
           alert(err.message);
        }
       
        // this.loading2 = false;
      });
    // this.loading2 = false;
  }


  setListTableName(listTableName:any,disListTableName:any){
    // alert();
    this.commonService.listtablename=listTableName;
    this.commonService.dislisttablename=disListTableName;
    // this.listitemscomponent.refreshDatatableListItems();
    $("#refreshDatatableListItems").click();
  }

  setReportName(reportName: any,reportHeader:any) {

    this.commonService.reportname = reportName;
    this.commonService.reportheader = reportHeader;

    // this.commonService.dislisttablename=disListTableName;
    // this.listitemscomponent.refreshDatatableListItems();
    // $("#refreshDatatableListItems").click();

    // this.router.navigate(['/']);
    // this.router.navigate(['ReportResume']);
    setTimeout(() => {
      // this.router.navigate(['ReportResume']);
      // this.router.navigate(['/ReportResume/' + reportName+'/'+reportHeader]);
      this.router.navigate(['Report']);



    }, 1);

  }

// will use later tested  
// ***2023 get all user roles in th uaccess_control table for the userid(empid) comparing hashed password stored in local storage
// This returned array will be then stored in the common service in 'user_roles' array.
// this function getUserRoles() will run everytime with refresh from app.component. So this data s always available for checking role.
// *************************************************************************************************************
getUserRoles(){
    // this.loading2 = true;
    this.authService.getUserRoles().subscribe(resp => {
      this.commonService.user_roles = resp;
      // this.loading2 = false;
      // console.log(this.commonService.user_roles);
    },
      err => {
        //2024 db server down err for "0 unknown error"
        if (err.status === 0) {
          // alert(err.error.errors[0].msg);
          alert("Cannot connect with database server.\n(app.component-getUserRoles())");
        }
        else{
          alert(err.message);
        }
        
        // this.loading2 = false;
      });
    // this.loading2 = false;
}










  // firstname for search is supplied from parent to child for angular-datatable, since table code is written in ngOnInit() 
  // search input field is in parent component else ngOnInit() will clear all input in child component
  // firstname: string = "";

  // CALL CHILD METHOD
  // @ViewChild(CustomRangeSearchComponent)
  // private CustomRangeSearchComponent!: CustomRangeSearchComponent;//https://stackoverflow.com/questions/54104187/typescript-complain-has-no-initializer-and-is-not-definitely-assigned-in-the-co

  // // CALL CHILD METHOD
  // // https://stackoverflow.com/questions/65934987/how-to-call-child-components-method-from-parent-component
  // callChildSearch() {
  //   this.CustomRangeSearchComponent.SearchAngularTable();
  // }

  // ClearAngularTableSearch() {
  //  var that=this;
  //   this.firstname = "";
  //   // this.callChildSearch();
  //   // this.CustomRangeSearchComponent.SearchAngularTable();
  //   setTimeout<any>(function() {
  //     that.CustomRangeSearchComponent.SearchAngularTable()
  //   }, 5);
   
  // }



}
