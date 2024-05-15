// import { Component } from '@angular/core';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../../services/common.service';
// import { EmployeeService } from '../../services/employee/employee.service';
import { ProjectService } from '../../services/project/project.service';
// import { ProdacService } from '../../services/project/prodac.service';
import { ProclientcontactService } from '../../services/project/proclientcontact.service';

import { DatePipe, Location } from '@angular/common';// datepipe used to convert date format to show in html date element
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, forkJoin, of } from 'rxjs';
import { ProjectSearchService } from '../../services/project/project-search.service';
import { error } from 'jquery';

@Component({
  selector: 'app-pro-clientcontact',
  templateUrl: './pro-clientcontact.component.html',
  styleUrls: ['./pro-clientcontact.component.css']
})
export class ProClientcontactComponent {


  constructor(private http: HttpClient,private projectSearchService: ProjectSearchService, private projectService: ProjectService, private proClientcontactService: ProclientcontactService, public datePipe: DatePipe, private router: Router, public activatedRoute: ActivatedRoute, private commonService: CommonService) {
  }


  // @Input() childempid:any;
  @Input() childprojectid: any;


// To refresh datatable with search parameters without using destroy
@ViewChild(DataTableDirective, { static: false })
datatableElement!: DataTableDirective; //used "!" to avoid initialization of variable. Also can use strict:false in tsconfig.json

proClientcontactData: any = []; // in angular should ([]) for array
proclientcontact:any={};
formErrors: any = [{}];
loading2: boolean = false;
componentLoaded = false;
// test:boolean=true;
modalClicked = "editModal";
// nodataavailable2:any="No data available"
nodataavailable:any="________________\n________________\n________________\n________________";


//  cmbEmpDegree: any = ([]);
//  cmbState: any = ([]);
//  cmbCountry: any = ([]);
// CmbEmpProjectRole: any = ([]);
// CmbEmpMain: any = ([]);

CmbEmpMain: any = ([]);


// ID
// Person1
// Person2
// Person3
// Notes
// CAOID
// ProjectID


proClientcontactFormGroup = new FormGroup({
  id: new FormControl(0),
  notes: new FormControl('',[Validators.required]), // required since it will hold toata address and phone of contact for now
  person1: new FormControl(0),
  person2: new FormControl(0),
  person3: new FormControl(0),
  caoid: new FormControl(0),
  projectid: new FormControl(0),

});



// set the getters for validation fields. convenient to use in html for validation
get notes() {
  return this.proClientcontactFormGroup.get('notes');
}



ngOnInit() {
  // this.loadDatatableProTeam();

  // ngOnInit is called only once. So for all next calls Observable is used so that it can always listen
  // https://www.youtube.com/watch?v=b4zpvh_saic&list=PL1BztTYDF-QNrtkvjkT6Wjc8es7QB4Gty&index=65
  if (!this.componentLoaded) {
    this.loadProClientcontactDetail(this.childprojectid); //loadDatatableProTeam() has to be called for first time only. Then refreshDatatableEmpDegree() is called everytime
    // this.componentLoaded = false;
    this.componentLoaded = true; //2023 to avoid duplicate datatable on load

  }


  // // following observer code moved from ngOnInit() to ngAfterViewInit() since datatable instance is not created yet to be refreshed
  // this.activatedRoute.paramMap.subscribe((param) => {
  //   this.childempid = param.get('id')
  //   this.refreshDatatableEmpDegree();// refresh instance of angular-datatable
  // })

  // this.fillAllCmb();
  // this.fillAllCmb2();
  // this.fillCmbEmpDegree();
  // this.fillCmbState();
  // this.fillCmbCountry();

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

  this.fillAllCmb();

  this.activatedRoute.paramMap.subscribe((param) => {
    this.childprojectid = param.get('id')
    if (!this.componentLoaded) { //2023 to avoid duplicate datatable on load
      this.loadProClientcontactDetail(this.childprojectid);
    }
    this.componentLoaded = false; //2023 to avoid duplicate datatable on load
  })

}




refreshDatatableProClientcontact(){
    this.activatedRoute.paramMap.subscribe((param) => {
    this.childprojectid = param.get('id')
    this.loadProClientcontactDetail(this.childprojectid);
  })
 
}



clearForm(){
  // this.proDacFormGroup.controls['id'].setValue(maxid + 1);
  this.proClientcontactFormGroup.controls['projectid'].setValue(this.childprojectid);//(this.childprojectid);
  this.proClientcontactFormGroup.controls['notes'].setValue('');
  this.proClientcontactFormGroup.controls['person1'].setValue(0);
  this.proClientcontactFormGroup.controls['person2'].setValue(0);
  this.proClientcontactFormGroup.controls['person3'].setValue(0);
  this.proClientcontactFormGroup.controls['caoid'].setValue(0);


}



// to check if proClientcontact already exists to avoid adding duplicate data
checkForProjectID() {
  let maxid = 0;
  this.proClientcontactService.checkForProjectID(this.childprojectid).subscribe(resp => {
    // alert(resp.length);
    if (resp.length>0) {
      alert("Project Client Contact exists for this project.\nIf you want to change the record press edit.");
      return;
    }
    else{
      $("#openaddmodalproclientcontact").click();
      this.modalClicked = "addModal";
      this.showProClientcontactAddModal();
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


// to check if proClientcontact already exists to avoid adding duplicate data
checkForProjectIDEdit(e:any) {
  let maxid = 0;
  this.proClientcontactService.checkForProjectID(this.childprojectid).subscribe(resp => {
    // alert(resp.length);
    if (resp.length==0) {
      alert("No Project Client Contact record exists for this project to Edit.");
      return;
    }
    else{
      $("#openaddmodalproclientcontact").click();
      this.modalClicked = "addModal";
      this.showProClientcontactEditModal(e);
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




showProClientcontactAddModal() {

  // if (this.commonService.user_role === 'guest' || this.commonService.user_role === 'user' ) {
  //   alert("Need permission.");
  //   return;
  // }

  if (!this.commonService.checkAddRole()) {
    return;
  }


  this.modalClicked = "addModal";
  // $('#btnProTeamEditModalShow').click(); 
  $('#btnProClientcontactEditModalShow').click(); 


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
    this.proClientcontactFormGroup.reset(); // to clear the previous validations
    // Manualy set default values since reset() will will turn values to null: // https://stackoverflow.com/questions/51448764/why-are-formgroup-controls-null-after-formgroup-reset
    // this.employeeFormGroup.controls['empid'].setValue(0);


   // this.proDacFormGroup.controls['id'].setValue(maxid + 1);
    this.proClientcontactFormGroup.controls['id'].setValue(0);
    this.proClientcontactFormGroup.controls['projectid'].setValue(this.childprojectid);//(this.childprojectid);
    this.proClientcontactFormGroup.controls['notes'].setValue('');
    this.proClientcontactFormGroup.controls['person1'].setValue(0);
    this.proClientcontactFormGroup.controls['person2'].setValue(0);
    this.proClientcontactFormGroup.controls['person3'].setValue(0);
    this.proClientcontactFormGroup.controls['caoid'].setValue(0);

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






showProClientcontactEditModal(e:any) {

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
  $('#btnProClientcontactEditModalShow').click(); 
      
  
  // $('#btnProDacEditModalShow').click(); 
  this.proClientcontactService.getProClientcontact(e).subscribe(resp => {

    //this.editData = resp; //use .data after resp for post method. Now using FormFroup to put data
    // **FormFroup and FormControl is used to pass value to edit form instead of [(ngModel)]
    // this.empid=resp.empid; // to pass to child modal if used

    // this.empid = resp.EmpID; // to pass to child modal if used
   
    // this.empDegreeFormGroup.patchValue(resp); 
    // OR

    this.proClientcontactFormGroup.controls['id'].setValue(resp.ID);
    this.proClientcontactFormGroup.controls['projectid'].setValue(resp.ProjectID);//(this.childprojectid);
    this.proClientcontactFormGroup.controls['notes'].setValue(resp.Notes);
    this.proClientcontactFormGroup.controls['person1'].setValue(resp.Person1);
    this.proClientcontactFormGroup.controls['person2'].setValue(resp.Person2);
    this.proClientcontactFormGroup.controls['person3'].setValue(resp.Person3);
    this.proClientcontactFormGroup.controls['caoid'].setValue(resp.CAOID);


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









loadProClientcontactDetail(e:any){

  // this.clearForm(); //clear the form of previous edit data
  // this.modalClicked="editModal"
  // this.loading2=true;
  // $('#proteamdetailmodalShow').click(); 

  this.loading2 = true;

  this.proclientcontact=""; // to clear the proclientcontact tab after project is selected from dropdown
  this.proClientcontactService.getProClientcontactDetail(e).subscribe(resp => {

    //this.editData = resp; //use .data after resp for post method. Now using FormFroup to put data
    // **FormFroup and FormControl is used to pass value to edit form instead of [(ngModel)]
    // this.empid=resp.empid; // to pass to child modal if used

    // this.empid = resp.EmpID; // to pass to child modal if used

    this.proclientcontact = resp;



  // NOW USING COMMON FUNCTION      
  // First check ButtonStatus on the basis record found
  //******************************************************************************* */
  
  // if (resp == null) {
  //   $('#detailsproclientcontacttab').find('.btn-edit').css({ "pointer-events": "none", "color": "rgb(145 145 145)" }); 
  //   $('#detailsproclientcontacttab').find('.btn-delete').css({ "pointer-events": "none", "color": "rgb(145 145 145)" }); 
  //   $('#detailsproclientcontacttab').find('.btn-add').css({ "pointer-events": "auto", "color": "rgb(9, 85, 166)" });
  // }
  // if (resp != null) {
  //   $('#detailsproclientcontacttab').find('.btn-add').css({ "pointer-events": "none", "color": "rgb(145 145 145)" });
  //   $('#detailsproclientcontacttab').find('.btn-delete').css({ "pointer-events": "auto", "color": "rgb(9, 85, 166)" });
  //   $('#detailsproclientcontacttab').find('.btn-edit').css({ "pointer-events": "auto", "color": "rgb(9, 85, 166)" });
  // }

    this.commonService.setButtonStatusEditmode("#detailsproclientcontacttab",resp); // disable btn if no permission

  //******************************************************************************* */




  // Then check buttonstatus on the basis of user role
  //*********************************************************************************** */
  this.commonService.setButtonStatus(); // disable btn if no permission



  //  alert(e);
  //  alert(this.proteam.EmpProjectRole);
  //  return;
    // this.empDegreeFormGroup.patchValue(resp); 
    // OR
    // this.empDegreeFormGroup.controls['id'].setValue(resp.ID);
    // this.empDegreeFormGroup.controls['empid'].setValue(resp.EmpID);
    // this.empDegreeFormGroup.controls['degree'].setValue(resp.Degree);
    // this.empDegreeFormGroup.controls['degreefield'].setValue(resp.DegreeField);
    // this.empDegreeFormGroup.controls['institution'].setValue(resp.Institution);
    // this.empDegreeFormGroup.controls['degstate'].setValue(resp.DegState);
    // this.empDegreeFormGroup.controls['country'].setValue(resp.Country);
    // this.empDegreeFormGroup.controls['yeardegreeearned'].setValue(resp.YearDegreeEarned);
    // this.empDegreeFormGroup.controls['notes'].setValue(resp.Notes);
// alert(resp.DegreeField);
    // Handle date : First datepipe used to convert date format, so that it can be shown in html input element properly
    // But null date returns 1/1/1970. So condition is used to convert only when date is not null
    // if (this.empDegreeFormGroup.controls['hiredate'].value !== null) {
    //   var date = new Date(resp.HireDate);
    //   var formattedDate = this.datePipe.transform(date, "yyyy-MM-dd");//output : 2018-02-13
    //   this.empDegreeFormGroup.controls['hiredate'].setValue(formattedDate);
    // }

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



// saveEmp common for edit and add. Option to call 2 function from here 
saveProClientcontact() {

  //   // check internet connection first
  //   var onlineOffline = navigator.onLine;
  //   if (onlineOffline===false) {
  //     alert("no internet connection");
  //     return;
  //   }
  if (this.modalClicked == "editModal") {
    this.updateProClientcontact();
  }
  if (this.modalClicked == "addModal") {
    this.addProClientcontact();
  }
}





addProClientcontact() {

  this.loading2 = true;


  this.proClientcontactService.addProClientcontact(this.proClientcontactFormGroup.value).subscribe(resp => {
    // $("#empeditmodal").modal("hide");
    $("#btnProClientContactEditCloseModal").click();
    // this.refreshEmployeeDatatable();
    this.loading2 = false;
    // this.refreshEmpDetail.next('somePhone'); //calling  loadEmpDetail() from parent component
    // this.router.navigateByUrl('Employee') //navigate to AngularDatatable
    //this.router.navigateByUrl('Empdetail/2') //navigate to AngularDatatable
    // var a= this.getMaxId();
    // this.router.navigateByUrl('Empdetail/' + a) //navigate to AngularDatatable // not working

    this.refreshDatatableProClientcontact();
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




updateProClientcontact() {

  // **FormFroup and FormControl is used to pass value to save form instead of [(ngModel)]
  this.loading2 = true;

  if (this.proClientcontactFormGroup.invalid) {
    this.loading2 = false;
    return;
  }

  // Handle date. If cleared in html the datepicker returns empty string "" and saves as '0000-00-00' in database 
  // which gives error while reading in form . So convert the date to "null" before saving empty string
  // if (this.employeeFormGroup.controls['hiredate'].value === '') {
  //   this.employeeFormGroup.controls['hiredate'].setValue(null);
  // }


  this.proClientcontactService.updateProClientcontact(this.proClientcontactFormGroup.value).subscribe(resp => {

    // $("#empeditmodal").modal("hide");
    $("#btnProClientContactEditCloseModal").click();
    // this.refreshEmployeeDatatable();
    // this.refreshEmpDetail.next('somePhone'); //calling  loadEmpDetail() from parent component
    this.refreshDatatableProClientcontact();
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





  deleteProClientcontact(projectid: any) {

    // if (this.commonService.user_role === 'guest' || this.commonService.user_role === 'user' ) {
    //   alert("Need permission.");
    //   return;
    // }

    
    if (!this.commonService.checkDeleteRole()) {
      return;
    }

    
    if (confirm('Are you sure you want to delete this record?')) {
      // Delete it!
    } else {
      // Do nothing!
      return;
    }
     

    this.proClientcontactService.deleteProClientcontact(projectid).subscribe(resp => {
      // $("#empeditmodal").modal("hide");
      // this.refreshEmployeeDatatable();
      // this.router.navigateByUrl('Employee') //navigate to AngularDatatable
      // this.refreshDatatableProDac();  // to refresh datatable after delete
      // this.clearForm();
      this.proclientcontact={};
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



      // Fill all combos in one function using forkJoin of rxjx
    // Fill all combos in one function using forkJoin of rxjx
    fillAllCmb() {
      this.loading2=true;
      forkJoin([

        this.projectSearchService.getCmbEmpMain(), //observable 3
        // this.projectsearchservice.getCmbProposalMain(), //observable 9
      ]).subscribe(([CmbEmpMain]) => {
        // When Both are done loading do something
        this.CmbEmpMain = CmbEmpMain;
        this.loading2=false;

      }, err => {
        alert(err.message);
        // alert("Problem filling Employee combos");
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
