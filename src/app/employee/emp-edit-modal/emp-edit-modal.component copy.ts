import { Component, Input, Output, EventEmitter } from '@angular/core';


import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../../services/common.service';
import { EmployeeService } from '../../services/employee/employee.service';
import { DatePipe } from '@angular/common';// datepipe used to convert date format to show in html date element
import { Router } from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';


@Component({
  selector: 'app-emp-edit-modal',
  templateUrl: './emp-edit-modal.component.html',
  styleUrls: ['./emp-edit-modal.component.css']
})
export class EmpEditModalComponent {


  constructor(private http: HttpClient, private empService: EmployeeService,public datePipe: DatePipe,private router: Router,private commonService: CommonService) {
  }


  @Input() empid: any = null;

  // https://stackoverflow.com/questions/43323272/angular-4-call-parent-method-in-a-child-component
  //to use seperate child component for modal and call it from parent
  @Output() refreshEmployeeDatatable = new EventEmitter<string>();
  @Output() refreshEmpDetail = new EventEmitter<string>();


  // table data
  myData: any = ([]); // in angular should ([]) for array
  // empid: any = 0; // to pass to child modal if used
  cmbJobtitle: any = ([]);
  cmbRegistration: any = ([]);

  formErrors:any=[{}];
  loading2:boolean=false;
  modalClicked="editModal";
  // maxid:any=0;

  //ANGULAR FORMGROUP is used to pass Value to frm control without jquery and better error handling
  //ANGULAR VALIDATORS  https://angular.io/api/forms/Validators
  //*************************************************************************** */
  employeeFormGroup = new FormGroup({
    empid: new FormControl(0),
    employeeid: new FormControl(''), // added 2023
    firstname: new FormControl('', [Validators.required]),
    // firstname: new FormControl(''),
    // firstname: new FormControl(''),
    lastname: new FormControl('', [Validators.required]),
    // lastname: new FormControl(''),
    middlei: new FormControl(''), // added 2023
    jobtitle: new FormControl(0),
    registration: new FormControl(0),
    hiredate: new FormControl(''), // should use null instead of ''
    employee_consultant: new FormControl(0),

    // ImageData: new FormControl('imgdat'),
    // ImageDataWeb: new FormControl('imgdatweb'),
  });


  // for validation fields set the getters for convenience to use in html for validation
  get firstname() {
    return this.employeeFormGroup.get('firstname');
  }
  get lastname() {
    return this.employeeFormGroup.get('lastname');
  }
  get jobtitle() {
    return this.employeeFormGroup.get('jobtitle');
  }
  get registration() {
    return this.employeeFormGroup.get('registration');
  }




  public ngOnInit(): void {

    this.fillAllCmb();
  }







  showChildModal() {
    // alert("edit");
    $('#btnEmpEditModalShow').click();
    this.modalClicked="editModal";
    this.showEmpEditModal();
    
  }

  showChildModalAdd() {
    // alert("add");
    $('#btnEmpEditModalShow').click();
    this.modalClicked="addModal";
    this.showEmpAddModal();
    
  }

  callChildModalDelete() {

    this.deleteEmp(114);
    
  }








  // showEmpEditModal(e: any) {
  // showEmpEditModal(e: any) {
      showEmpEditModal() {

    this.modalClicked="editModal"
    this.loading2=true;

    this.empService.getEmployeeFromModal(this.empid).subscribe(resp => {

      //this.editData = resp; //use .data after resp for post method. Now using FormFroup to put data
      // **FormFroup and FormControl is used to pass value to edit form instead of [(ngModel)]
      // this.empid=resp.empid; // to pass to child modal if used
      this.empid = resp.EmpID; // to pass to child modal if used

      // this.employeeFormGroup.patchValue(resp);
      // OR
      // this.employeeFormGroup.controls['empid'].setValue(resp.empid);
      // this.employeeFormGroup.controls['firstname'].setValue(resp.firstname);
      // this.employeeFormGroup.controls['lastname'].setValue(resp.lastname);
      // this.employeeFormGroup.controls['jobtitle'].setValue(resp.jobtitle);
      // this.employeeFormGroup.controls['registration'].setValue(resp.registration);
      // this.employeeFormGroup.controls['hiredate'].setValue(resp.hiredate);
      // this.employeeFormGroup.controls['employee_consultant'].setValue(resp.employee_consultant);
      
      this.employeeFormGroup.controls['empid'].setValue(resp.EmpID);
      this.employeeFormGroup.controls['employeeid'].setValue(resp.EmployeeID);//added 2023
      this.employeeFormGroup.controls['firstname'].setValue(resp.Firstname);
      this.employeeFormGroup.controls['lastname'].setValue(resp.Lastname);
      this.employeeFormGroup.controls['middlei'].setValue('');//added 2023  
      this.employeeFormGroup.controls['jobtitle'].setValue(resp.JobTitle);
      this.employeeFormGroup.controls['registration'].setValue(resp.Registration);
      this.employeeFormGroup.controls['hiredate'].setValue(resp.Hiredate);
      this.employeeFormGroup.controls['employee_consultant'].setValue(resp.Employee_Consultant);

      // Handle date : First datepipe used to convert date format, so that it can be shown in html input element properly
      // But null date returns 1/1/1970. So condition is used to convert only when date is not null
      if (this.employeeFormGroup.controls['hiredate'].value !== null) {
        var date = new Date(resp.HireDate);
        var formattedDate = this.datePipe.transform(date, "yyyy-MM-dd");//output : 2018-02-13
        this.employeeFormGroup.controls['hiredate'].setValue(formattedDate);
      }

      // this.loading2 = false;
    },
      err => {
        // For Validation errors
        if (err.status === 422 || err.status === 400) {
          // alert(err.error.errors[0].msg);
          this.formErrors=err.error.errors;
        }
        else{
          alert(err.message);
        }
      });

    // if (!this.errors) {
    //   //route to new page
    // }
  }


  showEmpAddModal() {

    this.modalClicked = "addModal"


    //Get the maxid
    //***************************** */
    let maxid = 0;
    this.empService.getMaxEmpID().subscribe(resp => {
      
      maxid = resp[0].maxempid;

      //**employeeFormGroup control within the subscribe so tha values are set after maxid is retrieved from database  */
      // clear form group since same group is used for edit and add
      // Now formgroup is used instead of data object to pass value
      this.employeeFormGroup.reset(); // to clear the previous validations
      // Manualy set default values since reset() will will turn values to null: // https://stackoverflow.com/questions/51448764/why-are-formgroup-controls-null-after-formgroup-reset
      // this.employeeFormGroup.controls['empid'].setValue(0);
      this.employeeFormGroup.controls['empid'].setValue(maxid + 1);
      this.employeeFormGroup.controls['employeeid'].setValue('');//added 2023
      this.employeeFormGroup.controls['firstname'].setValue('');
      this.employeeFormGroup.controls['lastname'].setValue('');
      this.employeeFormGroup.controls['middlei'].setValue('');//added 2023  
      this.employeeFormGroup.controls['jobtitle'].setValue(0);
      this.employeeFormGroup.controls['registration'].setValue(0);
      this.employeeFormGroup.controls['hiredate'].setValue(null);  // should use null instead of ''
      this.employeeFormGroup.controls['employee_consultant'].setValue(0);
    },

      err => {
        // For Validation errors
        if (err.status === 422 || err.status === 400) {
          // alert(err.error.errors[0].msg);
          this.formErrors = err.error.errors;
        }
        else {
          alert(err.message);
        }
      });


    //Timeout is used to run following code after maxid is returned from database
    //************************************************************************************** */
    // let that=this;
    // setTimeout(function () {

      //  this.editData.empid= 0;
      //  this.editData.firstname= '';
      //  this.editData.lastname= '';
      //  this.editData.jobtitle= 0;
      //  this.editData.registration= 0; 

    // // clear form group since same group is used for edit and add
    // // Now formgroup is used instead of data object to pass value
    // that.employeeFormGroup.reset(); // to clear the previous validations
    // // Manualy set default values since reset() will will turn values to null: // https://stackoverflow.com/questions/51448764/why-are-formgroup-controls-null-after-formgroup-reset
    // // this.employeeFormGroup.controls['empid'].setValue(0);
    // that.employeeFormGroup.controls['empid'].setValue(maxid+1);
    // that.employeeFormGroup.controls['employeeid'].setValue('');//added 2023
    // that.employeeFormGroup.controls['firstname'].setValue('');
    // that.employeeFormGroup.controls['lastname'].setValue('');
    // that.employeeFormGroup.controls['middlei'].setValue('');//added 2023  
    // that.employeeFormGroup.controls['jobtitle'].setValue(0);
    // that.employeeFormGroup.controls['registration'].setValue(0);
    // that.employeeFormGroup.controls['hiredate'].setValue(null);  // should use null instead of ''
    // that.employeeFormGroup.controls['employee_consultant'].setValue(0);

    // }, 1000)



  }








  // saveEmp(): void { // save btn click will call parents refreshEmployeeDatatable() method after save
  //   this.refreshEmployeeDatatable.next('somePhone');
  //   this.refreshEmpDetail.next('somePhone'); //calling  loadEmpDetail() from parent component
  //   $("#btnEmpEditModalClose").click();  //close bootstrap modal
  // }




    // saveEmp common for edit and add. Option to call 2 function from here 
    saveEmp() {

    //   // check internet connection first
    //   var onlineOffline = navigator.onLine;
    //   if (onlineOffline===false) {
    //     alert("no internet connection");
    //     return;
    //   }
      if (this.modalClicked == "editModal") {
        this.updateEmp();
      }
      if (this.modalClicked == "addModal") {
        this.addEmp();
      }
    }



  updateEmp() {
    // **FormFroup and FormControl is used to pass value to save form instead of [(ngModel)]

    this.loading2=true;
    // console.log(this.employeeFormGroup);
    if (this.employeeFormGroup.invalid) {
      this.loading2=false;
      return;
    }

    // Handle date. If cleared in html the datepicker returns empty string "" and saves as '0000-00-00' in database 
    // which gives error while reading in form . So convert the date to "null" before saving empty string
    if (this.employeeFormGroup.controls['hiredate'].value === '') {
      this.employeeFormGroup.controls['hiredate'].setValue(null);
    }
    
    this.empService.updateEmployee(this.employeeFormGroup.value).subscribe(resp => {
      
      // $("#empeditmodal").modal("hide");
      $("#btnEditCloseModal").click();
      
      // this.refreshEmployeeDatatable();
      this.refreshEmpDetail.next('somePhone'); //calling  loadEmpDetail() from parent component
      
      this.loading2=false;
      
    },
      err => {
        // console.log(error.response.data);
        // console.log(error.error.errors[0].param); //working
        // console.log(error.error.errors[0].msg); //working

        this.loading2=false;

        // For Validation errors
        if (err.status === 422 || err.status === 400) {
          // alert(err.error.errors[0].msg);
          this.formErrors=err.error.errors;
        }
        else{
          alert(err.message);
        }

            // // Validation errors
            // if (err.response.status === 422 || err.response.status === 400) {
            //   this.formErrors = err.response.data.errors;
            //   var arr = Object.keys(this.formErrors);
            //   var height = arr.length * 33;
            //    $("#emptoperrbar").css({"height": height + "px","border": "1px solid #ffb4bb"});
            // }

            // // For no token(401) or token failed varification(403)
            // else if (err.response.status === 401 || err.response.status === 403){
            //   this.formErrors = err.message 
            //    $("#emptoperrbar").css({ "height": 60 + "px", "padding": 10 + "px","border": "1px solid #ffb4bb" });
            // }

            // // Other errors including sql errors(500-internal server error)
            // else {
            //   this.formErrors = err.message + ". Please check network connection.";
            //   $("#emptoperrbar").css({ "height": 60 + "px", "padding": 10 + "px","border": "1px solid #ffb4bb" });
            // }
      });

    // if (!this.errors) {
    //   //route to new page
    // }

  }



  goToNewRecord(){
      // To Goto the newly added Record in Empdetail after new record is added
    //******************************************************************************** */
    this.empService.getMaxEmpID().subscribe(resp => {

      // this.refreshEmpDetail.next('somePhone'); //calling  loadEmpDetail() from parent component
      // this.router.navigateByUrl('Employee') //navigate to EmployeeDatatable
      // this.router.navigateByUrl('Empdetail/2') //navigate to Empdetail
      let a = resp[0].maxempid;
      this.router.navigateByUrl('Empdetail/' + a) //navigate to AngularDatatable
      // return a;
    },
      err => {
        // For Validation errors
        if (err.status === 422 || err.status === 400) {
          // alert(err.error.errors[0].msg);
          this.formErrors = err.error.errors;
        }
        else {
          alert(err.message);
        }
      });
}





  addEmp() {

    this.loading2 = true;


    // Create EmployeeID in frontend now
    //************************************************** */
    let fname:any=this.employeeFormGroup.controls['firstname'].value;
    let lname:any=this.employeeFormGroup.controls['lastname'].value;
    let mi:any=this.employeeFormGroup.controls['middlei'].value;
    let lnamecap:any=lname.charAt(0).toUpperCase() + lname.slice(1);
    let eid=lnamecap+fname.charAt(0).toUpperCase()+mi.charAt(0).toUpperCase();
    this.employeeFormGroup.controls['employeeid'].setValue(eid);



    this.empService.addEmployee(this.employeeFormGroup.value).subscribe(resp => {
      // $("#empeditmodal").modal("hide");
      alert("addemployee");
      $("#btnEditCloseModal").click();
      // this.refreshEmployeeDatatable();
      this.loading2 = false;
      this.refreshEmpDetail.next('somePhone'); //calling  loadEmpDetail() from parent component
      // this.router.navigateByUrl('Employee') //navigate to AngularDatatable
      // var a= this.getMaxId();      
      // this.router.navigateByUrl('Empdetail/' + a) //navigate to Empdetail // not working

      this.goToNewRecord();
    },

      err => {
        this.loading2 = false;

        // For Validation errors
        if (err.status === 422 || err.status === 400) {
          // alert(err.error.errors[0].msg);
          this.formErrors = err.error.errors;
        }
        else {
          alert(err.message);
        }
      });
    // if (!this.errors) {
    //   //route to new page
    // }





    // // To Goto the newly added Record in Empdetail after new record is added
    // //******************************************************************************** */
    // this.empservice.getMaxEmpID().subscribe(resp => {

    //   // this.refreshEmpDetail.next('somePhone'); //calling  loadEmpDetail() from parent component
    //   // this.router.navigateByUrl('Employee') //navigate to EmployeeDatatable
    //   // this.router.navigateByUrl('Empdetail/2') //navigate to Empdetail
    //   alert(resp[0].empid);
    //   let a = resp[0].empid;
    //   this.router.navigateByUrl('Empdetail/' + a) //navigate to AngularDatatable
    // },
    //   err => {
    //     // For Validation errors
    //     if (err.status === 422 || err.status === 400) {
    //       // alert(err.error.errors[0].msg);
    //       this.formErrors = err.error.errors;
    //     }
    //     else {
    //       alert(err.message);
    //     }
    //   });

  }






  deleteEmp(e: any) {

    if (confirm('Are you sure you want to delete this record?')) {
      // Delete it!
    } else {
      // Do nothing!
      return;
    }
  
    this.empService.deleteEmployeeFromModal(e).subscribe(resp => {
      // $("#empeditmodal").modal("hide");
      // this.refreshEmployeeDatatable();
      this.router.navigateByUrl('Employee') //navigate to AngularDatatable

    },
      err => {
        // For Validation errors
        if (err.status === 422 || err.status === 400) {
          // alert(err.error.errors[0].msg);
          this.formErrors=err.error.errors;
        }
        else{
          alert(err.message);
        }
      });

    // if (!this.errors) {
    //   //route to new page
    // }
  }




  // called form save clicked to detect any new errors on save click.
  clearFormErrors(){
    this.formErrors=[{}];
  }















  // Fill all combos in one function using forkJoin of rxjx
  fillAllCmb() {
    forkJoin([
      this.empService.getCmbEmpJobtitle(), //observable 1
      this.empService.getCmbEmpRegistration() //observable 2
    ]).subscribe(([cmbEmpJobtitle, cmbEmpRegistration]) => {
      // When Both are done loading do something
      this.cmbJobtitle = cmbEmpJobtitle;
      this.cmbRegistration = cmbEmpRegistration;
    }, err => {
      alert(err.message);
      // alert("Problem filling Employee combos");
    });
    // if (!this.errors) {
    //   //route to new page
    // }
  }




}
