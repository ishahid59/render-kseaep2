// import { Component } from '@angular/core';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../../services/common.service';
// import { EmployeeService } from '../../services/employee/employee.service';
import { ProjectService } from '../../services/project/project.service';
// import { ProdacService } from '../../services/project/prodac.service';
import { ProaddressService } from '../../services/project/proaddress.service';
import { EmployeeSearchService } from '../../services/employee/employee-search.service';

import { DatePipe, Location } from '@angular/common';// datepipe used to convert date format to show in html date element
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, forkJoin, of } from 'rxjs';
import { ProjectSearchService } from '../../services/project/project-search.service';
import { error } from 'jquery';

@Component({
  selector: 'app-pro-address',
  templateUrl: './pro-address.component.html',
  styleUrls: ['./pro-address.component.css']
})
export class ProAddressComponent {


  constructor(private http: HttpClient,private projectsearchservice: ProjectSearchService, private empSearchService: EmployeeSearchService, private projectService: ProjectService, private proAddressService: ProaddressService, public datePipe: DatePipe, private router: Router, public activatedRoute: ActivatedRoute, private commonService: CommonService) {
  }


  // @Input() childempid:any;
  @Input() childprojectid: any;


  // To refresh datatable with search parameters without using destroy
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective; //used "!" to avoid initialization of variable. Also can use strict:false in tsconfig.json

  proAddressData: any = []; // in angular should ([]) for array
  proaddress:any={};
  formErrors: any = [{}];
  loading2: boolean = false;
  componentLoaded = false;
// test:boolean=true;
  modalClicked = "editModal";

  
  //  cmbEmpDegree: any = ([]);
   cmbState: any = ([]);
   cmbCountry: any = ([]);
  // CmbEmpProjectRole: any = ([]);
  // CmbEmpMain: any = ([]);




  // ID
  // AddressLine1
  // AddressLine2
  // ProjectLocation
  // City
  // State
  // Zipcode
  // Country
  // Notes
  // ProjectID
 

  proAddressFormGroup = new FormGroup({
    id: new FormControl(0),
    projectlocation: new FormControl('',[Validators.required]), 
    addressline1: new FormControl(''),
    addressline2: new FormControl(''),
    city: new FormControl(''),
    state: new FormControl(0),
    zipcode: new FormControl(''),
    country: new FormControl(0),
    notes: new FormControl(''),
    projectid: new FormControl(0),

  });



  // set the getters for validation fields. convenient to use in html for validation
  get projectlocation() {
    return this.proAddressFormGroup.get('projectlocation');
  }
 


  ngOnInit() {
    // this.loadDatatableProTeam();

    // ngOnInit is called only once. So for all next calls Observable is used so that it can always listen
    // https://www.youtube.com/watch?v=b4zpvh_saic&list=PL1BztTYDF-QNrtkvjkT6Wjc8es7QB4Gty&index=65
    if (!this.componentLoaded) {
      this.loadProAddressDetail(this.childprojectid); //loadDatatableProTeam() has to be called for first time only. Then refreshDatatableEmpDegree() is called everytime
      // this.componentLoaded = false;
      this.componentLoaded = true; //2023 to avoid duplicate datatable on load

    }


    // // following observer code moved from ngOnInit() to ngAfterViewInit() since datatable instance is not created yet to be refreshed
    // this.activatedRoute.paramMap.subscribe((param) => {
    //   this.childempid = param.get('id')
    //   this.refreshDatatableEmpDegree();// refresh instance of angular-datatable
    // })



    this.fillAllCmb();

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
        this.loadProAddressDetail(this.childprojectid);
      }
      this.componentLoaded = false; //2023 to avoid duplicate datatable on load
    })

  }




  refreshDatatableProAddress(){
      this.activatedRoute.paramMap.subscribe((param) => {
      this.childprojectid = param.get('id')
      this.loadProAddressDetail(this.childprojectid);
    })
   
  }

 

  clearForm(){
    // this.proDacFormGroup.controls['id'].setValue(maxid + 1);
    this.proAddressFormGroup.controls['projectid'].setValue(this.childprojectid);//(this.childprojectid);
    this.proAddressFormGroup.controls['projectlocation'].setValue('');
    this.proAddressFormGroup.controls['addressline1'].setValue('');
    this.proAddressFormGroup.controls['addressline2'].setValue('');
    this.proAddressFormGroup.controls['city'].setValue('');
    this.proAddressFormGroup.controls['state'].setValue(0);
    this.proAddressFormGroup.controls['zipcode'].setValue('');
    this.proAddressFormGroup.controls['country'].setValue(0);
    this.proAddressFormGroup.controls['notes'].setValue('');

  }



  // to check if proAddress already exists to avoid adding duplicate data
  checkForProjectID() {

    let maxid = 0;
    this.proAddressService.checkForProjectID(this.childprojectid).subscribe(resp => {
      // alert(resp.length);
      if (resp.length>0) {
        alert("Project Address record exists for this project.\nIf you want to change the record press edit.");
        return;
      }
      else{
        $("#openaddmodalproaddress").click();
        this.modalClicked = "addModal";
        this.showProAddressAddModal();
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
    this.proAddressService.checkForProjectID(this.childprojectid).subscribe(resp => {
      // alert(resp.length);
      if (resp.length==0) {
        alert("No Project Address record exists for this project to Edit.");
        return;
      }
      else{
        $("#openaddmodalproaddress").click();
        this.modalClicked = "editModal";
        this.showProAddressEditModal(e);
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



  showProAddressAddModal() {

    // if (this.commonService.user_role === 'guest' || this.commonService.user_role === 'user' ) {
    //   alert("Need permission.");
    //   return;
    // }

    if (!this.commonService.checkAddRole()) {
      return;
    }


    this.modalClicked = "addModal";
    // $('#btnProTeamEditModalShow').click(); 
   
    $('#btnProAddressEditModalShow').click(); 


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
      this.proAddressFormGroup.reset(); // to clear the previous validations
      // Manualy set default values since reset() will will turn values to null: // https://stackoverflow.com/questions/51448764/why-are-formgroup-controls-null-after-formgroup-reset
      // this.employeeFormGroup.controls['empid'].setValue(0);


      // this.proDacFormGroup.controls['id'].setValue(maxid + 1);
      this.proAddressFormGroup.controls['id'].setValue(0);
      this.proAddressFormGroup.controls['projectid'].setValue(this.childprojectid);//(this.childprojectid);
      this.proAddressFormGroup.controls['projectlocation'].setValue('');
      this.proAddressFormGroup.controls['addressline1'].setValue('');
      this.proAddressFormGroup.controls['addressline2'].setValue('');
      this.proAddressFormGroup.controls['city'].setValue('');
      this.proAddressFormGroup.controls['state'].setValue(0);
      this.proAddressFormGroup.controls['zipcode'].setValue('');
      this.proAddressFormGroup.controls['country'].setValue(0);
      this.proAddressFormGroup.controls['notes'].setValue('');


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






  showProAddressEditModal(e:any) {

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
    $('#btnProAddressEditModalShow').click(); 

    
    // $('#btnProDacEditModalShow').click(); 
    this.proAddressService.getProAddress(e).subscribe(resp => {

      //this.editData = resp; //use .data after resp for post method. Now using FormFroup to put data
      // **FormFroup and FormControl is used to pass value to edit form instead of [(ngModel)]
      // this.empid=resp.empid; // to pass to child modal if used

      // this.empid = resp.EmpID; // to pass to child modal if used
     
      // this.empDegreeFormGroup.patchValue(resp); 
      // OR

      this.proAddressFormGroup.controls['id'].setValue(resp.ID);
      this.proAddressFormGroup.controls['projectid'].setValue(resp.ProjectID);//(this.childprojectid);
      // this.proDacFormGroup.controls['biddate'].setValue(resp.BidDate);
      this.proAddressFormGroup.controls['projectlocation'].setValue(resp.ProjectLocation);
      this.proAddressFormGroup.controls['addressline1'].setValue(resp.AddressLine1);
      this.proAddressFormGroup.controls['addressline2'].setValue(resp.AddressLine2);
      this.proAddressFormGroup.controls['city'].setValue(resp.City);
      this.proAddressFormGroup.controls['state'].setValue(resp.State);
      this.proAddressFormGroup.controls['zipcode'].setValue(resp.Zipcode);
      this.proAddressFormGroup.controls['country'].setValue(resp.Country);
      this.proAddressFormGroup.controls['notes'].setValue(resp.Notes);


      // // change date format using datepipe, else will not show in form
      // let x=this.proTeamFormGroup.controls['durationfrom'].value;
      // var formattedDate1 = this.datePipe.transform(x, "yyyy-MM-dd");//output : 2018-02-13
      // this.proTeamFormGroup.controls['durationfrom'].setValue(formattedDate1);
      // var formattedDate2 = this.datePipe.transform(resp.DurationTo, "yyyy-MM-dd");//output : 2018-02-13
      // this.proTeamFormGroup.controls['durationto'].setValue(formattedDate2);
   
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









  loadProAddressDetail(e: any) {

    // this.clearForm(); //clear the form of previous edit data
    // this.modalClicked="editModal"
    // this.loading2=true;
    // $('#proteamdetailmodalShow').click(); 
    this.loading2 = true;
    this.proaddress = ""; // to clear the address tab after project is selected from dropdown
    this.proAddressService.getProAddressDetail(e).subscribe(resp => {

      //this.editData = resp; //use .data after resp for post method. Now using FormFroup to put data
      // **FormFroup and FormControl is used to pass value to edit form instead of [(ngModel)]
      // this.empid=resp.empid; // to pass to child modal if used

      // this.empid = resp.EmpID; // to pass to child modal if used
      //  this.proaddress="";

      this.proaddress = resp;




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

      this.commonService.setButtonStatusEditmode("#detailsproaddresstab", resp); // disable btn if no permission

      //******************************************************************************* */     




      // Then check buttonstatus on the basis of user role
      //*********************************************************************************** */
      this.commonService.setButtonStatus(); // disable btn if no permission




      //  alert(resp);
      //  return;









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
  saveProAddress() {

    //   // check internet connection first
    //   var onlineOffline = navigator.onLine;
    //   if (onlineOffline===false) {
    //     alert("no internet connection");
    //     return;
    //   }
    if (this.modalClicked == "editModal") {
      this.updateProAddress();
    }
    if (this.modalClicked == "addModal") {
      this.addProAddress();
    }
  }





  addProAddress() {

    this.loading2 = true;


    this.proAddressService.addProAddress(this.proAddressFormGroup.value).subscribe(resp => {
      // $("#empeditmodal").modal("hide");
      $("#btnProAddressEditCloseModal").click();
      // this.refreshEmployeeDatatable();
      this.loading2 = false;
      // this.refreshEmpDetail.next('somePhone'); //calling  loadEmpDetail() from parent component
      // this.router.navigateByUrl('Employee') //navigate to AngularDatatable
      //this.router.navigateByUrl('Empdetail/2') //navigate to AngularDatatable
      // var a= this.getMaxId();
      // this.router.navigateByUrl('Empdetail/' + a) //navigate to AngularDatatable // not working

      this.refreshDatatableProAddress();
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
  
  
  
  
  updateProAddress() {

    // **FormFroup and FormControl is used to pass value to save form instead of [(ngModel)]
    this.loading2 = true;

    if (this.proAddressFormGroup.invalid) {
      this.loading2 = false;
      return;
    }

    // Handle date. If cleared in html the datepicker returns empty string "" and saves as '0000-00-00' in database 
    // which gives error while reading in form . So convert the date to "null" before saving empty string
    // if (this.employeeFormGroup.controls['hiredate'].value === '') {
    //   this.employeeFormGroup.controls['hiredate'].setValue(null);
    // }


    this.proAddressService.updateProAddress(this.proAddressFormGroup.value).subscribe(resp => {

      // $("#empeditmodal").modal("hide");
      $("#btnProAddressEditCloseModal").click();
      // this.refreshEmployeeDatatable();
      // this.refreshEmpDetail.next('somePhone'); //calling  loadEmpDetail() from parent component
      this.refreshDatatableProAddress();
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





    deleteProAddress(projectid: any) {

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
       

      this.proAddressService.deleteProAddress(projectid).subscribe(resp => {
        // $("#empeditmodal").modal("hide");
        // this.refreshEmployeeDatatable();
        // this.router.navigateByUrl('Employee') //navigate to AngularDatatable
        // this.refreshDatatableProDac();  // to refresh datatable after delete
        // this.clearForm();
        this.proaddress={};
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
      fillAllCmb() {
        forkJoin([
          this.empSearchService.getCmbState(), //observable 2
          this.empSearchService.getCmbCountry() //observable 2
        ]).subscribe(([cmbState, cmbCountry]) => {
          // When Both are done loading do something
          this.cmbState = cmbState;
          this.cmbCountry = cmbCountry;
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
