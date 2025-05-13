// import { Component } from '@angular/core';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../../services/common.service';
import { EmployeeService } from '../../services/employee/employee.service';
// import { ProjectService } from '../../services/project/project.service';
import { PropdstextService } from '../../services/project/propdstext.service';
import { EmployeeSearchService } from '../../services/employee/employee-search.service';
// import { ProjectSearchService } from '../../services/project/project-search.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { EmpresumetextService } from '../../services/employee/empresumetext.service';


@Component({
  selector: 'app-emp-resumetext',
  templateUrl: './emp-resumetext.component.html',
  styleUrls: ['./emp-resumetext.component.css']
})
export class EmpResumetextComponent {

  constructor(private http: HttpClient,private employeesearchservice: EmployeeSearchService,  private employeeService: EmployeeService, private EmpResumeTextService: EmpresumetextService,  private router: Router, public activatedRoute: ActivatedRoute, private commonService: CommonService) {
  }
 
 @Input() childempid:any;

// tab clicked in emp detail
empresumetexttabClicked(){
  // alert();
  // only fill cmb when tab clicked to make faster
  // this.loadDatatableempReg();
  // this.fillAllCmb();


}


empResumeTextData: any = []; // in angular should ([]) for array
empresumetext:any={};
formErrors: any = [{}];
loading2: boolean = false;
componentLoaded = false;
// test:boolean=true;
modalClicked = "editModal";


empResumeTextFormGroup = new FormGroup({
  id: new FormControl(0),
  education: new FormControl(''), 
  registration: new FormControl(''),
  training: new FormControl(''),
  affiliations: new FormControl(''),
  employment: new FormControl(''),
  experience: new FormControl(''),
  notes: new FormControl(''),
  empid: new FormControl(0),
});


ngOnInit() {
  // this.loadDatatableProTeam();

  // ngOnInit is called only once. So for all next calls Observable is used so that it can always listen
  // https://www.youtube.com/watch?v=b4zpvh_saic&list=PL1BztTYDF-QNrtkvjkT6Wjc8es7QB4Gty&index=65
  if (!this.componentLoaded) {
    this.loadEmpResumeTextDetail(this.childempid); //loadDatatableProTeam() has to be called for first time only. Then refreshDatatableEmpDegree() is called everytime
    // this.componentLoaded = false;

    this.componentLoaded = true; //2023 to avoid duplicate datatable on load

  }
}


    /* to remove "no matching records found" even if angular-datatable is not empty */
  // https://github.com/l-lin/angular-datatables/issues/1260
  ngAfterViewInit(): void {
    // var that = this;
    // this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //   dtInstance.on('draw.dt', function () {
    //     if (that.proTeamData.length > 0) {
    //       $('.dataTables_empty').remove();
    //     }
    //   });
    // });
 
    
    // // // ngOnInit is called only once. So for all next calls Observable is used so that it can always listen
    // // // https://www.youtube.com/watch?v=b4zpvh_saic&list=PL1BztTYDF-QNrtkvjkT6Wjc8es7QB4Gty&index=65
    // // // following observer code moved from ngOnInit() to here ngAfterViewInit()
    // this.activatedRoute.paramMap.subscribe((param) => {
    //   this.childprojectid = param.get('id')
    //   this.refreshDatatableProTeam();// refresh instance of angular-datatable
    // })


    // this.loadProDacDetail(115);
   
    this.activatedRoute.paramMap.subscribe((param) => {
      this.childempid = param.get('id')
      if (!this.componentLoaded) { //2023 to avoid duplicate datatable on load
        this.loadEmpResumeTextDetail(this.childempid);
      }
      this.componentLoaded = false; //2023 to avoid duplicate datatable on load
    })
  }

  refreshDatatableEmpResumeText(){
    this.activatedRoute.paramMap.subscribe((param) => {
    this.childempid = param.get('id')
    this.loadEmpResumeTextDetail(this.childempid);
  })
 
}

clearForm(){
  // this.proDacFormGroup.controls['id'].setValue(maxid + 1);
  this.empResumeTextFormGroup.controls['empid'].setValue(this.childempid);//(this.childprojectid);
  this.empResumeTextFormGroup.controls['education'].setValue('');
  this.empResumeTextFormGroup.controls['registration'].setValue('');
  this.empResumeTextFormGroup.controls['training'].setValue('');
  this.empResumeTextFormGroup.controls['affiliations'].setValue('');
  this.empResumeTextFormGroup.controls['employment'].setValue('');
  this.empResumeTextFormGroup.controls['notes'].setValue('');


}


  // to check if proAddress already exists to avoid adding duplicate data
  checkForEmpID() {

    let maxid = 0;
    this.EmpResumeTextService.checkForEmpID(this.childempid).subscribe(resp => {
      // alert(resp.length);
      if (resp.length>0) {
        alert("Employee resume text record exists for this employee.\nIf you want to change the record press edit.");
        return;
      }
      else{
        $("#openaddmodalempresumetext").click();
        this.modalClicked = "addModal";
        this.showEmpResumeTextAddModal();
      }
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



  // Added 20240503 to check if there is any proAddress to edit, called from html
  checkForEmpIDEdit(e:any){
    let maxid = 0;
    this.EmpResumeTextService.checkForEmpID(this.childempid).subscribe(resp => {
      // alert(resp.length);
      if (resp.length==0) {
        alert("No Employee resume text record exists for this employee to Edit.");
        return;
      }
      else{
        $("#openaddmodalempresumetext").click();
        this.modalClicked = "editModal";
        this.showEmpResumeTextEditModal(e);
      }
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





  showEmpResumeTextAddModal() {

    // if (this.commonService.user_role === 'guest' || this.commonService.user_role === 'user' ) {
    //   alert("Need permission.");
    //   return;
    // }

    if (!this.commonService.checkAddRole()) {
      return;
    }


    this.modalClicked = "addModal";
    // $('#btnProTeamEditModalShow').click(); 
   
    $('#btnEmpResumeTextEditModalShow').click(); 


    // Now maxid is generated in backend
    //Get the maxid
    //***************************** */
    // let maxid = 0;
    // this.proDacService.getMaxProDacID().subscribe(resp => {

    //   maxid = resp[0].maxprodacid;

      // alert(maxid);

      //**employeeFormGroup control within the subscribe so tha values are set after maxid is retrieved from database  */
      // clear form group since same group is used for edit and add
      // Now formgroup is used instead of data object to pass value
      this.empResumeTextFormGroup.reset(); // to clear the previous validations
      // Manualy set default values since reset() will will turn values to null: // https://stackoverflow.com/questions/51448764/why-are-formgroup-controls-null-after-formgroup-reset
      // this.employeeFormGroup.controls['empid'].setValue(0);


      // this.proDacFormGroup.controls['id'].setValue(maxid + 1);
      this.empResumeTextFormGroup.controls['id'].setValue(0);
      this.empResumeTextFormGroup.controls['empid'].setValue(this.childempid);//(this.childprojectid);
      this.empResumeTextFormGroup.controls['education'].setValue('');
      this.empResumeTextFormGroup.controls['registration'].setValue('');
      this.empResumeTextFormGroup.controls['training'].setValue('');
      this.empResumeTextFormGroup.controls['affiliations'].setValue('');
      this.empResumeTextFormGroup.controls['employment'].setValue('');
      this.empResumeTextFormGroup.controls['notes'].setValue('');

      // this.loading2=false;


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






  showEmpResumeTextEditModal(e:any) {

    // if (this.commonService.user_role === 'guest') { 
    //   alert("Need permission.");
    //   return;
    // }


    if (!this.commonService.checkEditRole()) {
      return;
    }



    this.clearForm(); //clear the form of previous edit data
    this.modalClicked="editModal"
    this.loading2=true;
    $('#btnEmpResumeTextEditModalShow').click(); 

    
    // $('#btnProDacEditModalShow').click(); 
    this.EmpResumeTextService.getEmpResumeText(e).subscribe(resp => {

      //this.editData = resp; //use .data after resp for post method. Now using FormFroup to put data
      // **FormFroup and FormControl is used to pass value to edit form instead of [(ngModel)]
      // this.empid=resp.empid; // to pass to child modal if used

      // this.empid = resp.EmpID; // to pass to child modal if used
     
      // this.empDegreeFormGroup.patchValue(resp); 
      // OR

      this.empResumeTextFormGroup.controls['id'].setValue(resp.ID);
      this.empResumeTextFormGroup.controls['empid'].setValue(resp.EmpID);//(this.childprojectid);
      this.empResumeTextFormGroup.controls['education'].setValue(resp.Education);
      this.empResumeTextFormGroup.controls['registration'].setValue(resp.Registration);
      this.empResumeTextFormGroup.controls['training'].setValue(resp.Training);
      this.empResumeTextFormGroup.controls['affiliations'].setValue(resp.Affiliations);
      this.empResumeTextFormGroup.controls['employment'].setValue(resp.Employment);
      this.empResumeTextFormGroup.controls['experience'].setValue(resp.Experience);
      this.empResumeTextFormGroup.controls['notes'].setValue(resp.Notes);



      this.loading2 = false;
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




  loadEmpResumeTextDetail(e: any) {
    

    // this.clearForm(); //clear the form of previous edit data
    // this.modalClicked="editModal"
    // this.loading2=true;
    // $('#proteamdetailmodalShow').click(); 
    this.loading2 = true;
    this.empresumetext = ""; // to clear the address tab after project is selected from dropdown
    this.EmpResumeTextService.getEmpResumeTextDetail(e).subscribe(resp => {
  
      //this.editData = resp; //use .data after resp for post method. Now using FormFroup to put data
      // **FormFroup and FormControl is used to pass value to edit form instead of [(ngModel)]
      // this.empid=resp.empid; // to pass to child modal if used

      // this.empid = resp.EmpID; // to pass to child modal if used
      //  this.roPdsText="";

      this.empresumetext = resp;
    


      // NOW USING COMMON FUNCTION   
      // First check ButtonStatus on the basis record found
      //******************************************************************************* */

      // if (resp == null) {
      //   $('#detailsproaddresstab').find('.btn-edit').css({ "pointer-events": "none", "color": "rgb(145 145 145)" }); 
      //   $('#detailsproaddresstab').find('.btn-delete').css({ "pointer-events": "none", "color": "rgb(145 145 145)" }); 
      //   $('#detailsproaddresstab').find('.btn-add').css({ "pointer-events": "auto", "color": "rgb(9, 85, 166)" });
      // }

      // if (resp != null) {
      //   $('#detailsproaddresstab').find('.btn-add').css({ "pointer-events": "none", "color": "rgb(145 145 145)" });
      //   $('#detailsproaddresstab').find('.btn-delete').css({ "pointer-events": "auto", "color": "rgb(9, 85, 166)" });
      //   $('#detailsproaddresstab').find('.btn-edit').css({ "pointer-events": "auto", "color": "rgb(9, 85, 166)" });
      // }

      this.commonService.setButtonStatusEditmode("#detailsempresumetexttab", resp); // disable btn if no permission

      //******************************************************************************* */     
      // Then check buttonstatus on the basis of user role
      //*********************************************************************************** */
      this.commonService.setButtonStatus(); // disable btn if no permission

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

    // if (!this.errors) {
    //   //route to new page
    // }

  }




  // saveEmp common for edit and add. Option to call 2 function from here 
  saveEmpResumeText() {

    //   // check internet connection first
    //   var onlineOffline = navigator.onLine;
    //   if (onlineOffline===false) {
    //     alert("no internet connection");
    //     return;
    //   }
    if (this.modalClicked == "editModal") {
      this.updateEmpResumeText();
    }
    if (this.modalClicked == "addModal") {
      this.addEmpResumeText();
    }
  }



  addEmpResumeText() {

    this.loading2 = true;


    this.EmpResumeTextService.addEmpResumeText(this.empResumeTextFormGroup.value).subscribe(resp => {
      // $("#empeditmodal").modal("hide");
      $("#btnEmpResumeTextEditCloseModal").click();
      // this.refreshEmployeeDatatable();
      this.loading2 = false;
      // this.refreshEmpDetail.next('somePhone'); //calling  loadEmpDetail() from parent component
      // this.router.navigateByUrl('Employee') //navigate to AngularDatatable
      //this.router.navigateByUrl('Empdetail/2') //navigate to AngularDatatable
      // var a= this.getMaxId();
      // this.router.navigateByUrl('Empdetail/' + a) //navigate to AngularDatatable // not working

      this.refreshDatatableEmpResumeText();
    },

      err => {
        this.loading2 = false;
        // Form Validation backend errors
        if (err.status === 422 || err.status === 400) {
          this.formErrors = err.error.errors;// alert(err.error.errors[0].msg);
        }
        else {
          alert(err.message);
        }
      });


  }
  
  
  
  
  updateEmpResumeText() {

    // **FormFroup and FormControl is used to pass value to save form instead of [(ngModel)]
    this.loading2 = true;

    if (this.empResumeTextFormGroup.invalid) {
      this.loading2 = false;
      return;
    }

    // Handle date. If cleared in html the datepicker returns empty string "" and saves as '0000-00-00' in database 
    // which gives error while reading in form . So convert the date to "null" before saving empty string
    // if (this.employeeFormGroup.controls['hiredate'].value === '') {
    //   this.employeeFormGroup.controls['hiredate'].setValue(null);
    // }


    this.EmpResumeTextService.updateEmpResumeText(this.empResumeTextFormGroup.value).subscribe(resp => {

      // $("#empeditmodal").modal("hide");
      $("#btnEmpResumeTextEditCloseModal").click();
      // this.refreshEmployeeDatatable();
      // this.refreshEmpDetail.next('somePhone'); //calling  loadEmpDetail() from parent component
      this.refreshDatatableEmpResumeText();
      this.loading2 = false;

    },
      err => {
        // console.log(error.error.errors[0].param); //working
        // console.log(error.error.errors[0].msg); //working
        this.loading2 = false;

        // Form backend Validation errors
        if (err.status === 422 || err.status === 400) {
          this.formErrors = err.error.errors;// alert(err.error.errors[0].msg);
        }
        else {
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

    }





    deleteEmpResumeText(projectid: any) {

      // if (this.commonService.user_role === 'guest' || this.commonService.user_role === 'user' ) {
      //   alert("Need permission.");
      //   return;
      // }

      
      if (!this.commonService.checkDeleteRole()) {
        return;
      }

      
      if (confirm('Are you sure you want to delete this resume text record?')) {
        // Delete it!
      } else {
        // Do nothing!
        return;
      }
       

      this.EmpResumeTextService.deleteEmpResumeText(projectid).subscribe(resp => {
        // $("#empeditmodal").modal("hide");
        // this.refreshEmployeeDatatable();
        // this.router.navigateByUrl('Employee') //navigate to AngularDatatable
        // this.refreshDatatableProDac();  // to refresh datatable after delete
        // this.clearForm();
        this.empresumetext={};
        this.refreshDatatableEmpResumeText();

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










}
 