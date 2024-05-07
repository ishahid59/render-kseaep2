import { Component, Input, Output, EventEmitter } from '@angular/core';


import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../../services/common.service';
import { EmployeeService } from '../../services/employee/employee.service';
import { DatePipe } from '@angular/common';// datepipe used to convert date format to show in html date element
import { Router } from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';
import { EmployeeSearchService } from '../../services/employee/employee-search.service';
import { ProjectSearchService } from '../../services/project/project-search.service';


@Component({
  selector: 'app-emp-edit-modal',
  templateUrl: './emp-edit-modal.component.html',
  styleUrls: ['./emp-edit-modal.component.css']
})
export class EmpEditModalComponent {


  constructor(private http: HttpClient,private proSearchService: ProjectSearchService,private empSearchService: EmployeeSearchService, private empService: EmployeeService,public datePipe: DatePipe,private router: Router,private commonService: CommonService) {
  }
 

  //TODO for project
  @Input() empid: any = null;

   //TODO for project
  // https://stackoverflow.com/questions/43323272/angular-4-call-parent-method-in-a-child-component
  //to use seperate child component for modal and call it from parent
  @Output() refreshEmployeeDatatable = new EventEmitter<string>();
  @Output() refreshEmpDetail = new EventEmitter<string>();


  // table data

  myData: any = ([]); // in angular should ([]) for array
  // empid: any = 0; // to pass to child modal if used
  // cmbJobtitle: any = ([]);
  // cmbRegistration: any = ([]);
count:any=0;
suggestion:any='';

  // from employee
  CmbJobtitle: any = ([]);
  CmbRegistration: any = ([]);
  CmbDepartment: any = ([]);// not present
  // CmbEmpDegree: any = ([]);// not present
  CmbEmpStatus: any = ([]); // not present
  // CmbTraining: any = ([]); // not present
  // from project
  CmbDisciplineSF254: any = ([]);// not present
  CmbDisciplineSF330: any = ([]);// not present
  // CmbCaoMain: any = ([]);
  // CmbProOCategory: any = ([]);
  // CmbProjectType: any = ([]);
  // CmbEmpProjectRole: any = ([]);
  CmbComMain: any = ([]);
  // CmbProPRole: any = ([]);
  // CmbEmpMain: any = ([]);
  // CmbProStatus: any = ([]);
  // CmbProposalMain: any = ([]);
  CmbEmpSuffix: any = ([]); // not present
  CmbEmpPrefix: any = ([]); // not present







  formErrors:any=[{}];
  loading2:boolean=false;
  modalClicked="editModal";
  // maxid:any=0;
 

  //ANGULAR FORMGROUP is used to pass Value to frm control without jquery and better error handling
  //ANGULAR VALIDATORS  https://angular.io/api/forms/Validators
  //*************************************************************************** */
  // employeeFormGroup = new FormGroup({
  //   empid: new FormControl(0),
  //   employeeid: new FormControl(''), // added 2023
  //   firstname: new FormControl('', [Validators.required]),
  //   // firstname: new FormControl(''),
  //   // firstname: new FormControl(''),
  //   // lastname: new FormControl('', [Validators.required]),
  //   lastname: new FormControl(''),
  //   middlei: new FormControl(''), // added 2023
  //   jobtitle: new FormControl(0),
  //   registration: new FormControl(0),
  //   hiredate: new FormControl(''), // should use null instead of ''
  //   employee_consultant: new FormControl(0),

  //   // ImageData: new FormControl('imgdat'),
  //   // ImageDataWeb: new FormControl('imgdatweb'),
  // });

  employeeFormGroup = new FormGroup({
    comid: new FormControl(0),
    department: new FormControl(0),
    disciplinesf254: new FormControl(0),
    disciplinesf330: new FormControl(0),
    empid: new FormControl(0),
    employeeid: new FormControl('', [Validators.required]),
    employeestatus: new FormControl(0),
    employee_consultant: new FormControl(0),
    expwithotherfirm: new FormControl(0),
    firstname: new FormControl('', [Validators.required]),
    fullname: new FormControl(''),
    hiredate: new FormControl(''),
    // imagedata: new FormControl(''),
    // imagedataweb: new FormControl(''),
    // jobtitle: new FormControl(0, [Validators.min(1)]),
    jobtitle: new FormControl(0),
    lastname: new FormControl('', [Validators.required]),
    middlei: new FormControl(''),
    prefix: new FormControl(0),
    registration: new FormControl(0),
    // registration: new FormControl(0, [Validators.min(1)]),
    suffix: new FormControl(0),
  });
  
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








  // for validation fields set the getters for convenience to use in html for validation
  get firstname() {
    return this.employeeFormGroup.get('firstname');
  }
  get lastname() {
    return this.employeeFormGroup.get('lastname');
  }
  get employeeid() {
    return this.employeeFormGroup.get('employeeid');
  }
  // get jobtitle() {
  //   return this.employeeFormGroup.get('jobtitle');
  // }
  // get registration() {
  //   return this.employeeFormGroup.get('registration');
  // }



  public ngOnInit(): void {

    let that=this;
    // wait for the datatable data load first
     setTimeout(function(){
       that.fillAllCmb();
   }, 150);
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

  callChildModalDelete(empid:any) {
//  alert(empid);
//  return;
    this.deleteEmp(empid);
   
  }




  clearForm(){
    this.employeeFormGroup.controls['comid'].setValue(0);
    this.employeeFormGroup.controls['department'].setValue(0);
    this.employeeFormGroup.controls['disciplinesf254'].setValue(0);
    this.employeeFormGroup.controls['disciplinesf330'].setValue(0);
    this.employeeFormGroup.controls['empid'].setValue(0);    
    this.employeeFormGroup.controls['employeeid'].setValue('');//added 2023
    this.employeeFormGroup.controls['employeestatus'].setValue(0);
    this.employeeFormGroup.controls['employee_consultant'].setValue(0);
    this.employeeFormGroup.controls['expwithotherfirm'].setValue(0);
    this.employeeFormGroup.controls['firstname'].setValue('');
    this.employeeFormGroup.controls['fullname'].setValue('');
    this.employeeFormGroup.controls['hiredate'].setValue(null);  // should use null instead of ''
    this.employeeFormGroup.controls['jobtitle'].setValue(0);
    this.employeeFormGroup.controls['lastname'].setValue('');
    this.employeeFormGroup.controls['middlei'].setValue('');//added 2023  
    this.employeeFormGroup.controls['prefix'].setValue(0);
    this.employeeFormGroup.controls['registration'].setValue(0);    
    this.employeeFormGroup.controls['suffix'].setValue(0);
  }



  showEmpEditModal() {
    
    this.clearForm(); //clear the form of previous edit data
    this.modalClicked = "editModal";
    $("#fullnameedit").prop("disabled", true); // auto generated field
    $("#employeeidedit").prop("disabled", true); // cannot allow edit after employeeid is created

    this.loading2 = true;

    this.empService.getEmployeeFromModal(this.empid).subscribe(resp => {

      //this.editData = resp; //use .data after resp for post method. Now using FormFroup to put data
      // **FormFroup and FormControl is used to pass value to edit form instead of [(ngModel)]
      // this.empid=resp.empid; // to pass to child modal if used
      this.empid = resp.EmpID; // to pass to child modal if used

      // this.employeeFormGroup.patchValue(resp);
      // OR
      // this.employeeFormGroup.controls['empid'].setValue(resp.EmpID);
      // this.employeeFormGroup.controls['employeeid'].setValue(resp.EmployeeID);//added 2023
      // this.employeeFormGroup.controls['firstname'].setValue(resp.Firstname);
      // this.employeeFormGroup.controls['lastname'].setValue(resp.Lastname);
      // this.employeeFormGroup.controls['middlei'].setValue('');//added 2023  
      // this.employeeFormGroup.controls['jobtitle'].setValue(resp.JobTitle);
      // this.employeeFormGroup.controls['registration'].setValue(resp.Registration);
      // this.employeeFormGroup.controls['hiredate'].setValue(resp.Hiredate);
      // this.employeeFormGroup.controls['employee_consultant'].setValue(resp.Employee_Consultant);

      this.employeeFormGroup.controls['comid'].setValue(resp.ComID);
      this.employeeFormGroup.controls['department'].setValue(resp.Department);
      this.employeeFormGroup.controls['disciplinesf254'].setValue(resp.DisciplineSF254);
      this.employeeFormGroup.controls['disciplinesf330'].setValue(resp.DisciplineSF330);
      this.employeeFormGroup.controls['empid'].setValue(resp.EmpID);    
      this.employeeFormGroup.controls['employeeid'].setValue(resp.EmployeeID);//added 2023
      this.employeeFormGroup.controls['employeestatus'].setValue(resp.EmployeeStatus);
      this.employeeFormGroup.controls['employee_consultant'].setValue(resp.Employee_Consultant);
      this.employeeFormGroup.controls['expwithotherfirm'].setValue(resp.ExpWithOtherFirm);
      this.employeeFormGroup.controls['firstname'].setValue(resp.Firstname);
      this.employeeFormGroup.controls['fullname'].setValue(resp.FullName);
      this.employeeFormGroup.controls['hiredate'].setValue(resp.HireDate);  // should use null instead of ''
      this.employeeFormGroup.controls['jobtitle'].setValue(resp.JobTitle);
      this.employeeFormGroup.controls['lastname'].setValue(resp.Lastname);
      this.employeeFormGroup.controls['middlei'].setValue(resp.MiddleI);//added 2023  
      this.employeeFormGroup.controls['prefix'].setValue(resp.Prefix);
      this.employeeFormGroup.controls['registration'].setValue(resp.Registration);    
      this.employeeFormGroup.controls['suffix'].setValue(resp.Suffix);

      // Handle date : First datepipe used to convert date format, so that it can be shown in html input element properly
      // But null date returns 1/1/1970. So condition is used to convert only when date is not null
      if (this.employeeFormGroup.controls['hiredate'].value !== null) {
        var date = new Date(resp.HireDate);
        var formattedDate = this.datePipe.transform(date, "yyyy-MM-dd");//output : 2018-02-13
        this.employeeFormGroup.controls['hiredate'].setValue(formattedDate);
      }

      this.loading2 = false;
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





  showEmpAddModal() {

    this.modalClicked = "addModal"

    $("#fullnameedit").prop("disabled", true); // field autogenerated
    $("#employeeidedit").prop("disabled", false); // allow change for first time created

    // Now maxid is generated in backend
    // //Get the maxid
    // //***************************** */
    // let maxid = 0;
    // this.empService.getMaxEmpID().subscribe(resp => {
    // maxid = resp[0].maxempid;

      //**employeeFormGroup control within the subscribe so tha values are set after maxid is retrieved from database  */
      // clear form group since same group is used for edit and add
      // Now formgroup is used instead of data object to pass value
      this.employeeFormGroup.reset(); // to clear the previous validations
      // Manualy set default values since reset() will will turn values to null: // https://stackoverflow.com/questions/51448764/why-are-formgroup-controls-null-after-formgroup-reset
      this.employeeFormGroup.controls['comid'].setValue(0);
      this.employeeFormGroup.controls['department'].setValue(0);
      this.employeeFormGroup.controls['disciplinesf254'].setValue(0);
      this.employeeFormGroup.controls['disciplinesf330'].setValue(0);
      // this.employeeFormGroup.controls['empid'].setValue(maxid + 1);    
      this.employeeFormGroup.controls['empid'].setValue(0);    

      this.employeeFormGroup.controls['employeeid'].setValue('');//added 2023
      this.employeeFormGroup.controls['employeestatus'].setValue(0);
      this.employeeFormGroup.controls['employee_consultant'].setValue(0);
      this.employeeFormGroup.controls['expwithotherfirm'].setValue(0);
      this.employeeFormGroup.controls['firstname'].setValue('');
      this.employeeFormGroup.controls['fullname'].setValue('');
      this.employeeFormGroup.controls['hiredate'].setValue(null);  // should use null instead of ''
      this.employeeFormGroup.controls['jobtitle'].setValue(0);
      this.employeeFormGroup.controls['lastname'].setValue('');
      this.employeeFormGroup.controls['middlei'].setValue('');//added 2023  
      this.employeeFormGroup.controls['prefix'].setValue(0);
      this.employeeFormGroup.controls['registration'].setValue(0);    
      this.employeeFormGroup.controls['suffix'].setValue(0);


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


    //***************************************************************************************************** */
    // *** 2023 Note If date is cleared the it always has a value of '' which tries to save 0000-00-00 00:00:00 in mysql server resulting err;
    // 2023 SO handle it in front end and save null when value is '' dont have to do antthing in backend
    //***************************************************************************************************** */
    if (this.employeeFormGroup.controls['hiredate'].value === '') {
      this.employeeFormGroup.controls['hiredate'].setValue(null);
    }
    

    // *********************************************************************************************
    // Generate FULLNAME
    // *********************************************************************************************
    let fname:any=this.employeeFormGroup.controls['firstname'].value;
    let fnamecap:any=fname.charAt(0).toUpperCase()+ fname.slice(1);
    let lname:any=this.employeeFormGroup.controls['lastname'].value;
    let lnamecap:any=lname.charAt(0).toUpperCase()+ lname.slice(1);;
    let mi:any=this.employeeFormGroup.controls['middlei'].value;
    let micap:any=mi.charAt(0).toUpperCase();

    if (micap!='') {
      this.employeeFormGroup.controls['fullname'].setValue(fnamecap+' '+micap+' '+lnamecap);
    } else {
      this.employeeFormGroup.controls['fullname'].setValue(fnamecap+' '+lnamecap);
    }
    // *********************************************************************************************



    this.empService.updateEmployee(this.employeeFormGroup.value).subscribe(resp => {
      
      // $("#empeditmodal").modal("hide");
      $("#btnEmpEditCloseModal").click();
      
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





  // addEmp() {

  //   this.loading2 = true;


  //   //*************************************************************************** */
  //   // Create EmployeeID. Creating in frontend now. NOT USING NOW. enter EmployeeID manually
  //   //**************************************************************************** */
  //   // let fname: any = this.employeeFormGroup.controls['firstname'].value;
  //   // let lname: any = this.employeeFormGroup.controls['lastname'].value;
  //   // let mi: any = this.employeeFormGroup.controls['middlei'].value;
  //   // let lnamecap: any = lname.charAt(0).toUpperCase() + lname.slice(1);
  //   // let newemployeeid = lnamecap + fname.charAt(0).toUpperCase() + mi.charAt(0).toUpperCase();
  //   // this.employeeFormGroup.controls['employeeid'].setValue(newemployeeid);



  //   //********************************************************************************************* */
  //   //chaining db calls(1st call - cheking for duplicate employeeid). validation is in frontend now
  //   //********************************************************************************************* */
  //   let newemployeeid= this.employeeFormGroup.controls['employeeid'].value;
  //   this.empService.getDuplicateEmployeeID(newemployeeid).subscribe(resp => {

  //     let duplicatecount = resp[0].employeeidcount;
  //     // let x=0/1;
  //     if (duplicatecount > 0) {
  //       alert("Duplicate EmployeeID '" + newemployeeid + "' found.Please enter another Id\n or enter 2 after the EmployeeID.");
  //       this.loading2 = false;
  //       // $("#btnEditCloseModal").click();
  //       duplicatecount = 0;
  //       return;
  //     }


  //   // *********************************************************************************************
  //   // Generate FULLNAME
  //   // *********************************************************************************************
  //     let fname:any=this.employeeFormGroup.controls['firstname'].value;
  //     let fnamecap:any=fname.charAt(0).toUpperCase()+ fname.slice(1);
  //     let lname:any=this.employeeFormGroup.controls['lastname'].value;
  //     let lnamecap:any=lname.charAt(0).toUpperCase()+ lname.slice(1);;
  //     let mi:any=this.employeeFormGroup.controls['middlei'].value;
  //     let micap:any=mi.charAt(0).toUpperCase();

  //     if (micap!='') {
  //       this.employeeFormGroup.controls['fullname'].setValue(fnamecap+' '+micap+' '+lnamecap);
  //     } else {
  //       this.employeeFormGroup.controls['fullname'].setValue(fnamecap+' '+lnamecap);
  //     }
      







  //   // ***********************************************************************************************************************************
  //   // *** 2023 Note If date is cleared the it always has a value of '' which tries to save 0000-00-00 00:00:00 in mysql server resulting err;
  //   // 2023 SO handle it in front end and save null when value is '' dont have to do antthing in backend
  //   // *************************************************************************************************************************************
  //   if (this.employeeFormGroup.controls['hiredate'].value === '') {
  //     this.employeeFormGroup.controls['hiredate'].setValue(null);
  //   }


  //     //************************************************************************************************* */
  //     //chaining db calls(2nd call for insert).then insert(chaining after duplicate employeeid validation)
  //     //*********************************************************************************************** */

  //     this.empService.addEmployee(this.employeeFormGroup.value).subscribe(resp => {
  //       // $("#empeditmodal").modal("hide");
  //       $("#btnEditCloseModal").click();
  //       this.loading2 = false;
  //       this.refreshEmpDetail.next('somePhone'); //calling  loadEmpDetail() from parent component
  //       // this.refreshEmployeeDatatable();
  //       // this.router.navigateByUrl('Employee') //navigate to AngularDatatable
  //       // var a= this.getMaxId();      
  //       // this.router.navigateByUrl('Empdetail/' + a) //navigate to Empdetail // not working
  //       this.goToNewRecord(); // jump to the newly added record
  //     },

  //       //error code for Chaining calls no.2(insert/add call) goes here
  //       //************************************************************************ */
  //       err => {
  //         this.loading2 = false;
  //         if (err.status === 422 || err.status === 400) {// Form validation backend errors
  //           this.formErrors = err.error.errors;// alert(err.error.errors[0].msg);
  //         }
  //         else {
  //           alert(err.message);
  //         }
  //       });

  //     // )

  //   },

  //     // error code Chaining calls no.1(chking duplicate employeeid) goes here
  //     //********************************************************************************************* */
  //     err => {
  //       alert(err.message);
  //       this.loading2 = false;
  //       $("#btnEditCloseModal").click();
  //     });
  //   //********************************************************************************************* */


  // }





  // async await (Chaining) used with promise instead of subscribe. Client side DUPLICATE EMPLOYEEID CHECK
  async addEmp() {

    this.loading2 = true;


    //*************************************************************************** */
    // Create EmployeeID. Creating in frontend now. NOT USING NOW. enter EmployeeID manually
    //**************************************************************************** */
    // let fname: any = this.employeeFormGroup.controls['firstname'].value;
    // let lname: any = this.employeeFormGroup.controls['lastname'].value;
    // let mi: any = this.employeeFormGroup.controls['middlei'].value;
    // let lnamecap: any = lname.charAt(0).toUpperCase() + lname.slice(1);
    // let newemployeeid = lnamecap + fname.charAt(0).toUpperCase() + mi.charAt(0).toUpperCase();
    // this.employeeFormGroup.controls['employeeid'].setValue(newemployeeid);


    // Client side DUPLICATE EMPLOYEEID CHECK Using async await (Chaining).To prevent going to next request before 
    // completing this one Note: must use async fuction await keyword and usi .toPromise()
    // https://stackoverflow.com/questions/34104638/how-can-i-chain-http-calls-in-angular-2
    //************************************************************************************************************************* */

    try {
      let newemployeeid = this.employeeFormGroup.controls['employeeid'].value;

      const resp = await this.empService.getDuplicateEmployeeID(newemployeeid).toPromise();
      this.count = resp[0].employeeidcount;
    } catch (error: any) {
      // alert("Error in checking DuplicateEmployeeID" + error.message);
      // alert(error.message);
      this.loading2 = false;
      $("#btnEmpEditCloseModal").click();
      throw error;// must throw error instesd of return else the following lines in the calling function will execute
    }

    if (this.count > 0) {
      this.loading2 = false;
      // alert("Duplicate EmployeeID '" + newemployeeid + "' found.Please enter another Id\n or enter 2 after the EmployeeID.");
      alert("Duplicate EmployeeID found.Please enter another Id\n or enter 2 after the EmployeeID.");
      return;
    }



    // *********************************************************************************************
    // Generate FULLNAME
    // *********************************************************************************************
    let fname: any = this.employeeFormGroup.controls['firstname'].value;
    let fnamecap: any = fname.charAt(0).toUpperCase() + fname.slice(1);
    let lname: any = this.employeeFormGroup.controls['lastname'].value;
    let lnamecap: any = lname.charAt(0).toUpperCase() + lname.slice(1);;
    let mi: any = this.employeeFormGroup.controls['middlei'].value;
    let micap: any = mi.charAt(0).toUpperCase();

    if (micap != '') {
      this.employeeFormGroup.controls['fullname'].setValue(fnamecap + ' ' + micap + ' ' + lnamecap);
    } else {
      this.employeeFormGroup.controls['fullname'].setValue(fnamecap + ' ' + lnamecap);
    }


    // ***********************************************************************************************************************************
    // *** 2023 Note If date is cleared the it always has a value of '' which tries to save 0000-00-00 00:00:00 in mysql server resulting err;
    // 2023 SO handle it in front end and save null when value is '' dont have to do antthing in backend
    // *************************************************************************************************************************************
    if (this.employeeFormGroup.controls['hiredate'].value === '') {
      this.employeeFormGroup.controls['hiredate'].setValue(null);
    }


    //************************************************************************************************* */
    //chaining db calls(2nd call for insert).then insert(chaining after duplicate employeeid validation)
    //*********************************************************************************************** */

    this.empService.addEmployee(this.employeeFormGroup.value).subscribe(resp => {
      // $("#empeditmodal").modal("hide");
      $("#btnEmpEditCloseModal").click();
      this.loading2 = false;
      this.refreshEmpDetail.next('somePhone'); //calling  loadEmpDetail() from parent component
      // this.refreshEmployeeDatatable();
      // this.router.navigateByUrl('Employee') //navigate to AngularDatatable
      // var a= this.getMaxId();      
      // this.router.navigateByUrl('Empdetail/' + a) //navigate to Empdetail // not working
      this.goToNewRecord(); // jump to the newly added record
    },

      //error code for Chaining calls no.2(insert/add call) goes here
      //************************************************************************ */
      err => {
        this.loading2 = false;
        if (err.status === 422 || err.status === 400) {// Form validation backend errors
          this.formErrors = err.error.errors;// alert(err.error.errors[0].msg);
        }
        else {
          alert(err.message);
        }
      });

  }




generateEmployeeID(){

  let fname: any = this.employeeFormGroup.controls['firstname'].value;
  let fnamecap: any = fname.charAt(0).toUpperCase() + fname.slice(1);
  let lname: any = this.employeeFormGroup.controls['lastname'].value;
  let lnamecap: any = lname.charAt(0).toUpperCase() + lname.slice(1);;
  let mi: any = this.employeeFormGroup.controls['middlei'].value;
  // let micap: any = mi.charAt(0).toUpperCase();

  // if (mi != '') {
  //   this.employeeFormGroup.controls['employeeid'].setValue(lnamecap+''+ mi + fnamecap.charAt(0));
  // } else {
  //   this.employeeFormGroup.controls['employeeid'].setValue(lnamecap+''+ fnamecap.charAt(0));
  // }
  // this.employeeFormGroup.controls['employeeid'].setValue(lnamecap+''+ mi + fnamecap.charAt(0));
this.suggestion=lnamecap+''+ mi + fnamecap.charAt(0);

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















  // // Fill all combos in one function using forkJoin of rxjx
  // fillAllCmb() {
  //   forkJoin([
  //     this.empSearchService.getCmbEmpJobtitle(), //observable 1
  //     this.empSearchService.getCmbEmpRegistration() //observable 2
  //   ]).subscribe(([cmbEmpJobtitle, cmbEmpRegistration]) => {
  //     // When Both are done loading do something
  //     this.cmbJobtitle = cmbEmpJobtitle;
  //     this.cmbRegistration = cmbEmpRegistration;
  //   }, err => {
  //     alert(err.message);
  //     // alert("Problem filling Employee combos");
  //   });
  //   // if (!this.errors) {
  //   //   //route to new page
  //   // }
  // }

  // Fill all combos in one function using forkJoin of rxjx
  fillAllCmb() {

    this.loading2=true;

    forkJoin([
      this.empSearchService.getCmbEmpJobtitle(), //observable 1
      this.empSearchService.getCmbEmpRegistration(), //observable 2
      this.empSearchService.getCmbEmpDepartment(), //observable 2 //not present
      // this.empSearchService.getCmbEmpDegree(), //observable 2 //not present
      this.empSearchService.getCmbEmpStatus(), //observable 2 //not present
      // this.empSearchService.getCmbEmpTraining(), //observable 2 //not present
      this.empSearchService.getCmbEmpSuffix(), //observable 2 //not present
      this.empSearchService.getCmbEmpPrefix(), //observable 2 //not present

      this.proSearchService.getCmbProProfilecodeSF254(), //observable 1
      this.proSearchService.getCmbProProfilecodeSF330(), //observable 1
      // this.proSearchService.getCmbCaoMain(), //observable 1
      // this.proSearchService.getCmbProOCategory(), //observable 1
      // this.proSearchService.getCmbProjectType(), //observable 1
      // this.proSearchService.getCmbEmpProjectRole(), //observable 1
      this.proSearchService.getCmbComMain(), //observable 1

    ]).subscribe(([CmbJobtitle, CmbRegistration, CmbDepartment, CmbEmpStatus,CmbEmpSuffix,CmbEmpPrefix,
      CmbDisciplineSF254, CmbDisciplineSF330, CmbComMain]) => {
      // When Both are done loading do something
      this.CmbJobtitle = CmbJobtitle;
      this.CmbRegistration = CmbRegistration;
      this.CmbDepartment = CmbDepartment;
      // this.CmbEmpDegree = CmbEmpDegree;
      this.CmbEmpStatus = CmbEmpStatus;
      // this.CmbTraining = CmbTraining;
      this.CmbEmpSuffix = CmbEmpSuffix;
      this.CmbEmpPrefix = CmbEmpPrefix;

      this.CmbDisciplineSF254 = CmbDisciplineSF254;
      this.CmbDisciplineSF330 = CmbDisciplineSF330;
      // this.CmbCaoMain = CmbCaoMain;
      // this.CmbProOCategory = CmbProOCategory;
      // this.CmbProjectType = CmbProjectType;
      // this.CmbEmpProjectRole = CmbEmpProjectRole;
      this.CmbComMain = CmbComMain;


      this.loading2=false;

    }, err => {
      alert(err.message);
      // alert("Problem filling Employee combos");
    });
    // if (!this.errors) {
    //   //route to new page
    // }
  }


}
