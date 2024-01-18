import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../../services/common.service';
import { EmployeeService } from '../../services/employee/employee.service';
import { EmpdegreeService } from '../../services/employee/empdegree.service';

import { DatePipe } from '@angular/common';// datepipe used to convert date format to show in html date element
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, forkJoin, of } from 'rxjs';
import { ProjectSearchService } from '../../services/project/project-search.service';
import { EmployeeSearchService } from '../../services/employee/employee-search.service';



@Component({
  selector: 'app-emp-degree',
  templateUrl: './emp-degree.component.html',
  styleUrls: ['./emp-degree.component.css']
})
export class EmpDegreeComponent {

  constructor(private http: HttpClient,private empSearchService: EmployeeSearchService, private empService: EmployeeService,private empDegreeService: EmpdegreeService, public datePipe: DatePipe, private router: Router,public activatedRoute: ActivatedRoute,private commonService: CommonService) {
  }

  @Input() childempid:any;

  // dtOptions: DataTables.Settings = {};
   dtOptions: any = {}; // any is used instead of DataTables.Settings else datatable export buttons wont show

   // To refresh datatable with search parameters without using destroy
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective; //used "!" to avoid initialization of variable. Also can use strict:false in tsconfig.json

  empDegreeData: any = []; // in angular should ([]) for array
  empdegree:any={};
  formErrors: any = [{}];
  loading2: boolean = false;
  componentLoaded = false;

  modalClicked="editModal";
 

  cmbEmpDegree: any = ([]);
  cmbState: any = ([]);
  cmbCountry: any = ([]);

 

  //ANGULAR FORMGROUP is used to pass Value to frm control without jquery and better error handling
  //ANGULAR VALIDATORS  https://angular.io/api/forms/Validators
  //*************************************************************************** */
  empDegreeFormGroup = new FormGroup({
    id: new FormControl(0),
    empid: new FormControl(0),
    // degree: new FormControl(0, Validators.min(1)),
    degree: new FormControl(0),
    degreefield: new FormControl(''), // added 2023
    // institution: new FormControl('', [Validators.required]),
    institution: new FormControl(''),
    degstate: new FormControl(0),
    country: new FormControl(0),
    yeardegreeearned: new FormControl(''),
    notes: new FormControl(''),

  });

  // set the getters for validation fields. convenient to use in html for validation
  get degree() {
    return this.empDegreeFormGroup.get('degree');
  }
  get degstate() {
    return this.empDegreeFormGroup.get('degstate');
  }
  get country() {
    return this.empDegreeFormGroup.get('country');
  }





  ngOnInit() {
    // this.loadDatatableEmpDegree();

    // ngOnInit is called only once. So for all next calls Observable is used so that it can always listen
    // https://www.youtube.com/watch?v=b4zpvh_saic&list=PL1BztTYDF-QNrtkvjkT6Wjc8es7QB4Gty&index=65
    if (!this.componentLoaded) {
      this.loadDatatableEmpDegree(); //loadDatatableEmpDegree() has to be called for first time only. Then refreshDatatableEmpDegree() is called everytime
      // this.componentLoaded = false;
      this.componentLoaded = true; //2023 to avoid duplicate datatable on load

    }


    // // following observer code moved from ngOnInit() to ngAfterViewInit() since datatable instance is not created yet to be refreshed
      // this.activatedRoute.paramMap.subscribe((param) => {
      //   this.childempid = param.get('id')
      //   this.refreshDatatableEmpDegree();// refresh instance of angular-datatable
      // })

    // this.fillAllCmb(); // 2023  moved to datatable so that so that cmd can be loaded after dttable data
    // this.fillCmbEmpDegree();
    // this.fillCmbState();
    // this.fillCmbCountry();

  }

 
// tab clicked in emp detail
degreetabClicked(){
  // alert();
  // only fill cmb when tab clicked to make faster
  // this.loadDatatableEmpDegree();
  // this.fillAllCmb();
}




  /* to remove "no matching records found" even if angular-datatable is not empty */
  // https://github.com/l-lin/angular-datatables/issues/1260
  ngAfterViewInit(): void {
    var that = this;
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.on('draw.dt', function () {
        if (that.empDegreeData.length > 0) {
          $('.dataTables_empty').remove();
        }
      });
    });


    // // ngOnInit is called only once. So for all next calls Observable is used so that it can always listen
    // // https://www.youtube.com/watch?v=b4zpvh_saic&list=PL1BztTYDF-QNrtkvjkT6Wjc8es7QB4Gty&index=65
    // // following observer code moved from ngOnInit() to here ngAfterViewInit()
    this.activatedRoute.paramMap.subscribe((param) => {
      this.childempid = param.get('id')
      if (!this.componentLoaded) { //2023 to avoid duplicate datatable on load
        this.refreshDatatableEmpDegree();// refresh instance of angular-datatable
      }
      this.componentLoaded = false; //2023 to avoid duplicate datatable on load
    })

  }




  // Refresh/reload Angular-Datatable. Following method must be used to reload angular-datatable since ngOnInit() is used to initilize table 
  // https://l-lin.github.io/angular-datatables/#/advanced/custom-range-search
  refreshDatatableEmpDegree() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

 


  loadDatatableEmpDegree() {
    
    var that = this;

    this.dtOptions = {
      pagingType: 'full_numbers',
      processing: true,
      serverSide: true,// server side processing
      searching: false,
      lengthChange: false,
      // lengthMenu: [ 10, 35, 50, 75, 100 ],
      // dom: 'Blfrtip', //'Bfrtip', use l before f to show length with bottons
      // // //"any" is used in "dtOptions" instead of DataTables.Settings else datatable export buttons wont show
      // buttons: [
      //     'lengthChange','copy', 'csv', 'excel', 'pdf', 'print'
      // ],

      ajax: (dataTablesParameters: any, callback:any) => {
        this.http.post<any>(
          // 'http://localhost:5000/api/empdegree/empdegree-angular-datatable/' + 145 + '',
          // 'http://localhost:5000/api/empdegree/empdegree-angular-datatable',
          '' + that.commonService.baseUrl + '/api/empdegree/empdegree-angular-datatable',
          Object.assign(dataTablesParameters,
            {
              // token: '',
              empid: this.childempid,//this.id, 
            }),
          {
            // ** Header is now coming from Auth.Inceptor file
            // headers: {
            // Authorization: "Bearer " + localStorage.getItem("token"),
            // Accept: "application/json" //the token is a variable which holds the token
            // }
          },
        ).subscribe(resp => {
          this.empDegreeData = resp.data; //use .data after resp for post method
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: []
            // //https://stackoverflow.com/questions/57849250/angular-datatables-server-side-processing-and-buttons-extension-data-is-empty
            // data:  resp.data  // set data
          });
          this.fillAllCmb(); // moved here so that so that cmd can be loaded after dttable data
        });
      },
      "columnDefs": [ {
        "targets": 7,
        "orderable": false
        } ],
      columns: [
        // // { data: '', title: "id" }, 
        // { data: 'empid', title: "empid", width: "200px" },
        // { data: 'str1', title: "Degree", width: "500px" },
        // // { data: 'DegreeField', title: "DegreeField", width: "500px" },
        // { data: '', title: "Action", width: "100px" },

                // { data: '', title: "id" }, 
                { data: 'EmpID', title: "empid", width: "50px", visible: false },
                { data: 'disDegree', title: "Degree", width: "80px" },
                { data: 'DegreeField', title: "DegreeField", width: "80px" },
                { data: 'YearDegreeEarned', title: "YearDegreeEarned", width: "80px" },
                { data: 'Institution', title: "Institution", width: "150px" },
                { data: 'disState', title: "DegState", width: "60px" },
                { data: 'disCountry', title: "Country", width: "80px" },

                { data: '', title: "Action", width: "120px" },
      ]
    };
  }


  // showEmpDegreeChildModalAdd() {

  //   alert("showEmpDegreeChildModalAdd");

  // }



  clearForm(){
    this.empDegreeFormGroup.controls['id'].setValue(0);
    this.empDegreeFormGroup.controls['empid'].setValue(this.childempid);
    this.empDegreeFormGroup.controls['degree'].setValue(0);
    this.empDegreeFormGroup.controls['degreefield'].setValue('');
    this.empDegreeFormGroup.controls['institution'].setValue('');
    this.empDegreeFormGroup.controls['degstate'].setValue(0);
    this.empDegreeFormGroup.controls['country'].setValue(0);
    this.empDegreeFormGroup.controls['yeardegreeearned'].setValue('');
    this.empDegreeFormGroup.controls['notes'].setValue('');
  }



  showEmpDegreeAddModal() {

    // if (this.commonService.user_role === 'guest' || this.commonService.user_role === 'user' ) {
    //   alert("Need permission.");
    //   return;
    // }

    if (!this.commonService.checkAddRole()) {
      return;
    }

    // alert("addModal");
    this.modalClicked = "addModal"
    $('#btnEmpDegreeModalShow').click();
    


// alert(this.childempid);
    //Get the maxid
    //***************************** */
    let maxid = 0;
    this.empDegreeService.getMaxEmpDegreeID().subscribe(resp => {
      
      maxid = resp[0].maxempdegreeid;

      // alert(maxid);

      //**employeeFormGroup control within the subscribe so tha values are set after maxid is retrieved from database  */
      // clear form group since same group is used for edit and add
      // Now formgroup is used instead of data object to pass value
      this.empDegreeFormGroup.reset(); // to clear the previous validations
      // Manualy set default values since reset() will will turn values to null: // https://stackoverflow.com/questions/51448764/why-are-formgroup-controls-null-after-formgroup-reset
      // this.employeeFormGroup.controls['empid'].setValue(0);

      this.empDegreeFormGroup.controls['id'].setValue(maxid + 1);
      this.empDegreeFormGroup.controls['empid'].setValue(this.childempid);
      this.empDegreeFormGroup.controls['degree'].setValue(0);
      this.empDegreeFormGroup.controls['degreefield'].setValue('');
      this.empDegreeFormGroup.controls['institution'].setValue('');
      this.empDegreeFormGroup.controls['degstate'].setValue(0);
      this.empDegreeFormGroup.controls['country'].setValue(0);
      this.empDegreeFormGroup.controls['yeardegreeearned'].setValue('');
      this.empDegreeFormGroup.controls['notes'].setValue('');
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




  showEmpDegreeEditModal(e:any) {

    // if (this.commonService.user_role === 'guest') { 
    //   alert("Need permission.");
    //   return;
    // }

    if (!this.commonService.checkEditRole()) {
      return;
    }


    // this.clearForm(); //clear the form of previous edit data
    this.modalClicked="editModal"
    $('#btnEmpDegreeModalShow').click();
    this.loading2=true;

    this.empDegreeService.getEmpDegree(e).subscribe(resp => {

      //this.editData = resp; //use .data after resp for post method. Now using FormFroup to put data
      // **FormFroup and FormControl is used to pass value to edit form instead of [(ngModel)]
      // this.empid=resp.empid; // to pass to child modal if used

      // this.empid = resp.EmpID; // to pass to child modal if used
     
      // this.empDegreeFormGroup.patchValue(resp); 
      // OR
      this.empDegreeFormGroup.controls['id'].setValue(resp.ID);
      this.empDegreeFormGroup.controls['empid'].setValue(resp.EmpID);
      this.empDegreeFormGroup.controls['degree'].setValue(resp.Degree);
      this.empDegreeFormGroup.controls['degreefield'].setValue(resp.DegreeField);
      this.empDegreeFormGroup.controls['institution'].setValue(resp.Institution);
      this.empDegreeFormGroup.controls['degstate'].setValue(resp.DegState);
      this.empDegreeFormGroup.controls['country'].setValue(resp.Country);
      this.empDegreeFormGroup.controls['yeardegreeearned'].setValue(resp.YearDegreeEarned);
      this.empDegreeFormGroup.controls['notes'].setValue(resp.Notes);
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




  showEmpDegreeDetailModal(e:any){
    

    // this.clearForm(); //clear the form of previous edit data
    // this.modalClicked="editModal"
    this.loading2=true;
    // $('#empregdetailmodalShow').click(); 
    
    this.empDegreeService.getEmpDegreeDetail(e).subscribe(resp => {

      //this.editData = resp; //use .data after resp for post method. Now using FormFroup to put data
      // **FormFroup and FormControl is used to pass value to edit form instead of [(ngModel)]
      // this.empid=resp.empid; // to pass to child modal if used
  
      // this.empid = resp.EmpID; // to pass to child modal if used
     this.empdegree=resp;
    
    
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
  saveEmpDegree() {

    //   // check internet connection first
    //   var onlineOffline = navigator.onLine;
    //   if (onlineOffline===false) {
    //     alert("no internet connection");
    //     return;
    //   }
      if (this.modalClicked == "editModal") {
        this.updateEmpDegree();
      }
      if (this.modalClicked == "addModal") {
        this.addEmpDegree();
      }
    }



  addEmpDegree() {

    this.loading2 = true;
    this.empDegreeService.addEmpDegree(this.empDegreeFormGroup.value).subscribe(resp => {
      // $("#empdegreemodal").modal("hide");
      $("#btnEmpDegreeEditCloseModal").click();
      // this.refreshEmployeeDatatable();
      this.loading2 = false;
      // this.refreshEmpDetail.next('somePhone'); //calling  loadEmpDetail() from parent component
      // this.router.navigateByUrl('Employee') //navigate to AngularDatatable
      //this.router.navigateByUrl('Empdetail/2') //navigate to AngularDatatable
      // var a= this.getMaxId();
      // this.router.navigateByUrl('Empdetail/' + a) //navigate to AngularDatatable // not working

      this.refreshDatatableEmpDegree ();
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




  updateEmpDegree() {

        // **FormFroup and FormControl is used to pass value to save form instead of [(ngModel)]
        this.loading2=true;

        if (this.empDegreeFormGroup.invalid) {
          this.loading2=false;
          return;
        }
    
        // Handle date. If cleared in html the datepicker returns empty string "" and saves as '0000-00-00' in database 
        // which gives error while reading in form . So convert the date to "null" before saving empty string
        // if (this.employeeFormGroup.controls['hiredate'].value === '') {
        //   this.employeeFormGroup.controls['hiredate'].setValue(null);
        // }
        
        this.empDegreeService.updateEmpDegree(this.empDegreeFormGroup.value).subscribe(resp => {
          
          // $("#empdegreemodal").modal("hide");
          $("#btnEmpDegreeEditCloseModal").click();
          // this.refreshEmployeeDatatable();
          // this.refreshEmpDetail.next('somePhone'); //calling  loadEmpDetail() from parent component
          this.refreshDatatableEmpDegree();
          this.loading2=false;
          
        },
          err => {
            // console.log(error.error.errors[0].param); //working
            // console.log(error.error.errors[0].msg); //working
            this.loading2=false;
    
            // Form backend Validation errors
            if (err.status === 422 || err.status === 400) {
              this.formErrors=err.error.errors;// alert(err.error.errors[0].msg);
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

  }





 

  deleteEmpDegree(empdegreeid: any) {

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
   
  
    this.empDegreeService.deleteEmpDegree(empdegreeid).subscribe(resp => {
      // $("#empdegreemodal").modal("hide");
      // this.refreshEmployeeDatatable();
      // this.router.navigateByUrl('Employee') //navigate to AngularDatatable
      this.refreshDatatableEmpDegree();  // to refresh datatable after delete

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
        this.empSearchService.getCmbEmpDegree(), //observable 1
        this.empSearchService.getCmbState(), //observable 2
        this.empSearchService.getCmbCountry() //observable 2
      ]).subscribe(([cmbEmpDegreeDegree, cmbEmpState, cmbEmpCountry]) => {
        // When Both are done loading do something
        this.cmbEmpDegree = cmbEmpDegreeDegree;
        this.cmbState = cmbEmpState;
        this.cmbCountry = cmbEmpCountry;
      }, err => {
        alert(err.message);
        // alert("Problem filling Employee combos");
      });
      // if (!this.errors) {
      //   //route to new page
      // }
    }







    // // Fill all combos in one function using forkJoin of rxjx
    // fillAllCmb() {
    //   forkJoin([
    //     this.empDegreeService.getCmbEmpDegree(), //observable 1
    //     this.empDegreeService.getCmbState(), //observable 2
    //     this.empDegreeService.getCmbCountry() //observable 2
    //   ]).subscribe(([cmbEmpDegreeDegree, cmbEmpState, cmbEmpCountry]) => {
    //     // When Both are done loading do something
    //     this.cmbEmpDegree = cmbEmpDegreeDegree;
    //     this.cmbState = cmbEmpState;
    //     this.cmbCountry = cmbEmpCountry;
    //   }, err => {
    //     alert(err.message);
    //     // alert("Problem filling Employee combos");
    //   });
    //   // if (!this.errors) {
    //   //   //route to new page
    //   // }
    // }


  // // Fill all combos in one function using forkJoin of rxjx
  // fillAllCmb() {
  //   this.empDegreeService.getCmbEmpDegree().subscribe(resp => {
  //     this.cmbEmpDegree = resp;
  //     // console.log(resp);
  //   },
  //     err => {
  //       alert(err.message);
  //     });
  // }
    // Fill all combos in one function using forkJoin of rxjx


    // fillCmbEmpDegree() {
    //   this.empDegreeService.getCmbEmpDegree().subscribe(resp => {
    //     this.cmbEmpDegree = resp;
    //     // console.log(resp);
    //   },
    //     err => {
    //       alert(err.message);
    //     });
    // }
    // fillCmbState() {
    //   this.empDegreeService.getCmbState().subscribe(resp => {
    //     this.cmbState = resp;
    //     // console.log(resp);
    //   },
    //     err => {
    //       alert(err.message);
    //     });
    // }
    // fillCmbCountry() {
    //   this.empDegreeService.getCmbCountry().subscribe(resp => {
    //     this.cmbCountry = resp;
    //     // console.log(resp);
    //   },
    //     err => {
    //       alert(err.message);
    //     });
    // }


}
