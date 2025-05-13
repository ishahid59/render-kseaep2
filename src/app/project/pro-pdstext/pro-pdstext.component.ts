// import { Component } from '@angular/core';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../../services/common.service';
// import { EmployeeService } from '../../services/employee/employee.service';
import { ProjectService } from '../../services/project/project.service';
import { PropdstextService } from '../../services/project/propdstext.service';
// import { EmployeeSearchService } from '../../services/employee/employee-search.service';
import { ProjectSearchService } from '../../services/project/project-search.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';




@Component({
  selector: 'app-pro-pdstext',
  templateUrl: './pro-pdstext.component.html',
  styleUrls: ['./pro-pdstext.component.css']
})
export class ProPdstextComponent {
 
  constructor(private http: HttpClient,private projectsearchservice: ProjectSearchService,  private projectService: ProjectService, private ProPdsTextService: PropdstextService,  private router: Router, public activatedRoute: ActivatedRoute, private commonService: CommonService) {
  }

  // tinymce
  editorConfig3 = {
    //chatGPT TinyMCE needs to know where its plugins are stored locally (inside node_modules/tinymce/).
    // so add following 2 lines
    base_url: '/tinymce', // 👈 tells TinyMCE where to load resources
    suffix: '.min',       // 👈 uses tinymce.min.js and plugin.min.js
  
    height: 300,
    menubar: false,
    plugins: 'link image code lists textcolor contextmenu',
    toolbar: 'undo redo | bold italic | forecolor backcolor | alignleft aligncenter alignright | bullist numlist outdent indent | link image | code',
    content_style: 'body{font-family:Helvetica,Arial,sans-serif; font-size:14px;color: #2a2a2a}',
    contextmenu: 'copy paste',// for right click copy
    branding: false //to remove the logo
    }; 

    editorConfig4 = {
      //chatGPT TinyMCE needs to know where its plugins are stored locally (inside node_modules/tinymce/).
      // so add following 2 lines
      base_url: '/tinymce', // 👈 tells TinyMCE where to load resources
      suffix: '.min',       // 👈 uses tinymce.min.js and plugin.min.js
      editable_root :false,

      height: 180,
      menubar: false,
      plugins: 'link image code lists textcolor contextmenu',
      toolbar: false, //'undo redo | bold italic | forecolor backcolor | alignleft aligncenter alignright | bullist numlist outdent indent | link image | code',
      content_style: 'body{font-family:Helvetica,Arial,sans-serif;color:#2a2a2a; font-size:14px;cursor:default;background-color:#f4f4f4}',
      contextmenu: 'copy paste',// for right click copy
      branding: false //to remove the logo
      }; 


  // @Input() childempid:any;
  @Input() childprojectid: any;


  proPdsTextData: any = []; // in angular should ([]) for array
  propdstext:any={};
  formErrors: any = [{}];
  loading2: boolean = false;
  componentLoaded = false;
// test:boolean=true;
  modalClicked = "editModal";


  proPdsTextFormGroup = new FormGroup({
    id: new FormControl(0),
    pdsprojectname: new FormControl(''), 
    pdsprojectlocation: new FormControl(''), 
    ownercontact: new FormControl(''), 
    clientcontact: new FormControl(''),
    startenddates: new FormControl(''),
    contractamount: new FormControl(''),
    pdsprojectdescription: new FormControl(''),
    notes: new FormControl(''),
    projectid: new FormControl(0),
  });


  ngOnInit() {
    // this.loadDatatableProTeam();

    // ngOnInit is called only once. So for all next calls Observable is used so that it can always listen
    // https://www.youtube.com/watch?v=b4zpvh_saic&list=PL1BztTYDF-QNrtkvjkT6Wjc8es7QB4Gty&index=65
    if (!this.componentLoaded) {
      this.loadProPdsTextDetail(this.childprojectid); //loadDatatableProTeam() has to be called for first time only. Then refreshDatatableEmpDegree() is called everytime
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
      this.childprojectid = param.get('id')
      if (!this.componentLoaded) { //2023 to avoid duplicate datatable on load
        this.loadProPdsTextDetail(this.childprojectid);
      }
      this.componentLoaded = false; //2023 to avoid duplicate datatable on load
    })

  }


  refreshDatatableProPdsText(){
    this.activatedRoute.paramMap.subscribe((param) => {
    this.childprojectid = param.get('id')
    this.loadProPdsTextDetail(this.childprojectid);
  })
 
}


clearForm(){
  // // this.proDacFormGroup.controls['id'].setValue(maxid + 1);
  // this.proAddressFormGroup.controls['projectid'].setValue(this.childprojectid);//(this.childprojectid);
  // this.proAddressFormGroup.controls['projectlocation'].setValue('');
  // this.proAddressFormGroup.controls['addressline1'].setValue('');
  // this.proAddressFormGroup.controls['addressline2'].setValue('');
  // this.proAddressFormGroup.controls['city'].setValue('');
  // this.proAddressFormGroup.controls['state'].setValue(0);
  // this.proAddressFormGroup.controls['zipcode'].setValue('');
  // this.proAddressFormGroup.controls['country'].setValue(0);
  // this.proAddressFormGroup.controls['notes'].setValue('');

}


  // to check if proAddress already exists to avoid adding duplicate data
  checkForProjectID() {

    let maxid = 0;
    this.ProPdsTextService.checkForProjectID(this.childprojectid).subscribe(resp => {
      // alert(resp.length);
      if (resp.length>0) {
        alert("Project Address record exists for this project.\nIf you want to change the record press edit.");
        return;
      }
      else{
        $("#openaddmodalpropdstext").click();
        this.modalClicked = "addModal";
        this.showProPdsTextAddModal();
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
  checkForProjectIDEdit(e:any){

    let maxid = 0;
    this.ProPdsTextService.checkForProjectID(this.childprojectid).subscribe(resp => {
      // alert(resp.length);
      if (resp.length==0) {
        alert("No Project Address record exists for this project to Edit.");
        return;
      }
      else{
        $("#openaddmodalpropdstext").click();
        this.modalClicked = "editModal";
        this.showProPdsTextEditModal(e);
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





  showProPdsTextAddModal() {

    // if (this.commonService.user_role === 'guest' || this.commonService.user_role === 'user' ) {
    //   alert("Need permission.");
    //   return;
    // }

    if (!this.commonService.checkAddRole()) {
      return;
    }


    this.modalClicked = "addModal";
    // $('#btnProTeamEditModalShow').click(); 
   
    $('#btnProPdsTextEditModalShow').click(); 


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
      this.proPdsTextFormGroup.reset(); // to clear the previous validations
      // Manualy set default values since reset() will will turn values to null: // https://stackoverflow.com/questions/51448764/why-are-formgroup-controls-null-after-formgroup-reset
      // this.employeeFormGroup.controls['empid'].setValue(0);


      // this.proDacFormGroup.controls['id'].setValue(maxid + 1);
      this.proPdsTextFormGroup.controls['id'].setValue(0);
      this.proPdsTextFormGroup.controls['projectid'].setValue(this.childprojectid);//(this.childprojectid);
      // this.proPdsTextFormGroup.controls['projectlocation'].setValue('');
      // this.proPdsTextFormGroup.controls['addressline1'].setValue('');
      // this.proPdsTextFormGroup.controls['addressline2'].setValue('');
      // this.proPdsTextFormGroup.controls['city'].setValue('');
      // this.proPdsTextFormGroup.controls['state'].setValue(0);
      // this.proPdsTextFormGroup.controls['zipcode'].setValue('');
      // this.proPdsTextFormGroup.controls['country'].setValue(0);

      this.proPdsTextFormGroup.controls['pdsprojectname'].setValue('');
      this.proPdsTextFormGroup.controls['pdsprojectlocation'].setValue('');
      this.proPdsTextFormGroup.controls['ownercontact'].setValue('');
      this.proPdsTextFormGroup.controls['clientcontact'].setValue('');
      this.proPdsTextFormGroup.controls['startenddates'].setValue('');
      this.proPdsTextFormGroup.controls['contractamount'].setValue('');
      this.proPdsTextFormGroup.controls['pdsprojectdescription'].setValue('');
      this.proPdsTextFormGroup.controls['notes'].setValue('');


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






  showProPdsTextEditModal(e:any) {

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
    $('#btnProPdsTextEditModalShow').click(); 

    
    // $('#btnProDacEditModalShow').click(); 
    this.ProPdsTextService.getProPdsText(e).subscribe(resp => {

      //this.editData = resp; //use .data after resp for post method. Now using FormFroup to put data
      // **FormFroup and FormControl is used to pass value to edit form instead of [(ngModel)]
      // this.empid=resp.empid; // to pass to child modal if used

      // this.empid = resp.EmpID; // to pass to child modal if used
     
      // this.empDegreeFormGroup.patchValue(resp); 
      // OR

      this.proPdsTextFormGroup.controls['id'].setValue(resp.ID);
      this.proPdsTextFormGroup.controls['projectid'].setValue(resp.ProjectID);//(this.childprojectid);
      this.proPdsTextFormGroup.controls['pdsprojectname'].setValue(resp.PdsProjectName);
      this.proPdsTextFormGroup.controls['pdsprojectlocation'].setValue(resp.PdsProjectLocation);
      this.proPdsTextFormGroup.controls['ownercontact'].setValue(resp.OwnerContact);
      this.proPdsTextFormGroup.controls['clientcontact'].setValue(resp.ClientContact);
      this.proPdsTextFormGroup.controls['startenddates'].setValue(resp.StartEndDates);
      this.proPdsTextFormGroup.controls['contractamount'].setValue(resp.ContractAmount);
      this.proPdsTextFormGroup.controls['pdsprojectdescription'].setValue(resp.PdsProjectDescription);
      this.proPdsTextFormGroup.controls['notes'].setValue(resp.Notes);
      
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









  loadProPdsTextDetail(e: any) {

    // this.clearForm(); //clear the form of previous edit data
    // this.modalClicked="editModal"
    // this.loading2=true;
    // $('#proteamdetailmodalShow').click(); 
    this.loading2 = true;
    this.propdstext = ""; // to clear the address tab after project is selected from dropdown
    this.ProPdsTextService.getProPdsTextDetail(e).subscribe(resp => {

      //this.editData = resp; //use .data after resp for post method. Now using FormFroup to put data
      // **FormFroup and FormControl is used to pass value to edit form instead of [(ngModel)]
      // this.empid=resp.empid; // to pass to child modal if used

      // this.empid = resp.EmpID; // to pass to child modal if used
      //  this.roPdsText="";

      this.propdstext = resp;

      //2025 formcontrol is used because without formcontrol tinymce editor not showing content in html
      this.proPdsTextFormGroup.controls['pdsprojectdescription'].setValue(resp.PdsProjectDescription);


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
                                                   
      this.commonService.setButtonStatusEditmode("#detailspropdstexttab", resp); // disable btn if no permission

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
  saveProPdsText() {

    //   // check internet connection first
    //   var onlineOffline = navigator.onLine;
    //   if (onlineOffline===false) {
    //     alert("no internet connection");
    //     return;
    //   }
    if (this.modalClicked == "editModal") {
      this.updateProPdsText();
    }
    if (this.modalClicked == "addModal") {
      this.addProPdsText();
    }
  }



  addProPdsText() {

    this.loading2 = true;


    this.ProPdsTextService.addProPdsText(this.proPdsTextFormGroup.value).subscribe(resp => {
      // $("#empeditmodal").modal("hide");
      $("#btnProPdsTextEditCloseModal").click();
      // this.refreshEmployeeDatatable();
      this.loading2 = false;
      // this.refreshEmpDetail.next('somePhone'); //calling  loadEmpDetail() from parent component
      // this.router.navigateByUrl('Employee') //navigate to AngularDatatable
      //this.router.navigateByUrl('Empdetail/2') //navigate to AngularDatatable
      // var a= this.getMaxId();
      // this.router.navigateByUrl('Empdetail/' + a) //navigate to AngularDatatable // not working

      this.refreshDatatableProPdsText();
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
  
  
  
  
  updateProPdsText() {

    // **FormFroup and FormControl is used to pass value to save form instead of [(ngModel)]
    this.loading2 = true;

    if (this.proPdsTextFormGroup.invalid) {
      this.loading2 = false;
      return;
    }

    // Handle date. If cleared in html the datepicker returns empty string "" and saves as '0000-00-00' in database 
    // which gives error while reading in form . So convert the date to "null" before saving empty string
    // if (this.employeeFormGroup.controls['hiredate'].value === '') {
    //   this.employeeFormGroup.controls['hiredate'].setValue(null);
    // }


    this.ProPdsTextService.updateProPdsText(this.proPdsTextFormGroup.value).subscribe(resp => {

      // $("#empeditmodal").modal("hide");
      $("#btnProPdsTextEditCloseModal").click();
      // this.refreshEmployeeDatatable();
      // this.refreshEmpDetail.next('somePhone'); //calling  loadEmpDetail() from parent component
      this.refreshDatatableProPdsText();
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





    deleteProPdsText(projectid: any) {

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
       

      this.ProPdsTextService.deleteProPdsText(projectid).subscribe(resp => {
        // $("#empeditmodal").modal("hide");
        // this.refreshEmployeeDatatable();
        // this.router.navigateByUrl('Employee') //navigate to AngularDatatable
        // this.refreshDatatableProDac();  // to refresh datatable after delete
        // this.clearForm();
        this.refreshDatatableProPdsText();
        this.propdstext={};
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
