// import { Component } from '@angular/core';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../../services/common.service';
import { EmployeeService } from '../../services/employee/employee.service';
import { CaoService } from '../../services/cao/cao.service';
import { EmployeeSearchService } from '../../services/employee/employee-search.service';

import { createUrlTreeFromSnapshot } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { __values } from 'tslib';
import { ThisReceiver } from '@angular/compiler';
import { DatePipe } from '@angular/common';// datepipe used to convert date format to show in html date element
import { cleanData, data } from 'jquery';
import { TestBed } from '@angular/core/testing';
// import * as moment from 'moment';
import { Observable, forkJoin, of } from 'rxjs';
import { Router } from '@angular/router';
import { CaoEditModalComponent } from '../cao-edit-modal/cao-edit-modal.component';


@Component({
  selector: 'app-cao',
  templateUrl: './cao.component.html',
  styleUrls: ['./cao.component.css']
})


export class CaoComponent {

 
  constructor(private http: HttpClient, private empSearchService: EmployeeSearchService, private caoService: CaoService, public datePipe: DatePipe, private router: Router, private commonService: CommonService) {
  }


  // dtOptions: DataTables.Settings = {};
  dtOptions: any = {}; // any is used instead of DataTables.Settings else datatable export buttons wont show

  // To refresh datatable with search parameters without using destroy
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective; //used "!" to avoid initialization of variable. Also can use strict:false in tsconfig.json


  // table data
  caoData: any = ([]); // in angular should ([]) for array
  cao: any = {};
  caoid: any = 0; // to pass to child modal if used
  cmbState: any = ([]);
  cmbCountry: any = ([]);


  formErrors: any = [{}];
  loading2: boolean = false;
  componentLoaded = false;
  modalClicked = "editModal";


 
  //ANGULAR FORMGROUP is used to pass Value to frm control without jquery and better error handling
  //ANGULAR VALIDATORS  https://angular.io/api/forms/Validators
  //*************************************************************************** */
  caoFormGroup = new FormGroup({
    caoid: new FormControl(0),
    name: new FormControl('', [Validators.required]),
    fullname: new FormControl(''),
    addressline1: new FormControl(''),
    addressline2: new FormControl(''),
    city: new FormControl(''),
    state: new FormControl(0),
    zipcode: new FormControl(''),
    country: new FormControl(0),
    email: new FormControl(''),
    phone: new FormControl(''),
    ext: new FormControl(''),
    fax: new FormControl(''),
    govtagency: new FormControl(0),

  });


  // set the getters for validation fields. convenient to use in html for validation
  get name() {
    return this.caoFormGroup.get('name');
  }



  // // For Angular-Datatable reload. Following method must be used to reload angular-datatable since ngOnInit() is used to initilize table 
  // https://l-lin.github.io/angular-datatables/#/advanced/custom-range-search
  refreshCaoDatatable() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }



  /* to remove "no matching records found" even if angular-datatable is not empty */
  // https://github.com/l-lin/angular-datatables/issues/1260
  ngAfterViewInit(): void {
    var that = this;
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.on('draw.dt', function () {
        if (that.caoData.length > 0) {
          $('.dataTables_empty').remove();
        }
      });
    });

    // test to remove hash https://www.youtube.com/watch?v=j1ZHuyhHApg
    // history.pushState({id:1},'','/AngularDatatable')
  }



  public ngOnInit(): void {

    // var onlineOffline = navigator.onLine;
    // if (onlineOffline===false) {
    //   alert("no internet connection");
    //   return;
    // }

    var that = this;

    // Angular-Datatable with POST Method
    // https://l-lin.github.io/angular-datatables/#/basic/server-side-angular-way
    // let additionalparameters = { token: '', firstname: this.searchFirstname,  lastname: this.searchLastname, }; // send additional params

    this.dtOptions = {
      pagingType: 'full_numbers',
      processing: true,
      serverSide: true,// server side processing
      lengthChange: true,
      // lengthMenu: [ 15, 35, 50, 75, 100 ],
      lengthMenu: [[15, 25, 50, -1], [15, 25, 50, "All"]],
      dom: 'Blfrtip',//'Blfrtip', //'Bfrtip', use l before f to show length with bottons
      // "any" is used in "dtOptions" instead of DataTables.Settings else datatable export buttons wont show
      buttons: [
        // 'copy', 'csv', 'excel', 'pdf', 'print'
        'excel', 'csv', 'pdf', 'print',
      ],

      ajax: (dataTablesParameters: any, callback: any) => {
        this.http.post<any>(
          // 'http://localhost:5000/api/employee/search/angular-datatable',
          '' + that.commonService.baseUrl + '/api/cao/angular-datatable',

          // Adding custom parameters: https://stackoverflow.com/questions/49645200/how-can-add-custom-parameters-to-angular-5-datatables
          // using Object.assign to bundle dataTablesParameters and additionalparameters in 1 object so that an additional  
          // parameter can be used for post,last parameter is for header which is passes in request header instead of body
          Object.assign(dataTablesParameters,
            {
              token: '',
            }),
          {
            // ** Header is now coming from Auth.Inceptor file
            // headers: {
            // Authorization: "Bearer " + localStorage.getItem("token"),
            // Accept: "application/json" //the token is a variable which holds the token
            // }

            // headers: new HttpHeaders({
            //   'Content-Type':  'application/json',
            //   'Authorization': 'token',
            // })
          },
        ).subscribe(resp => {
          this.caoData = resp.data; //use .data after resp for post method

          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            // data: []
            //https://stackoverflow.com/questions/57849250/angular-datatables-server-side-processing-and-buttons-extension-data-is-empty
            data: resp.data  // set data
          });
          this.fillAllCmb();
          this.commonService.setButtonStatus(); // disable btn if no permission

        });
      },

      order: [[0, 'asc']], // 1 col is selected instead of 0 since 1 is hidden
      columnDefs: [
        // {
        // "orderable": true,
        // "targets": '_all',
        // },
        {
          "targets": 4, // center action column
          "className": "dt-center",//"text-center",
          "orderable": false,
          // "width": "4%"
        },
      ],

      columns: [

        // { data: "CAOID", title: "CAOID", visible: false },
        {
          render: (data: any, type: any, row: any) => {
            // return "<a style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);'  href='/Empdetail/" + row.empid + "'>" + row.firstname + "</a> ";
            return "<a style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >" + row.Name + "</a> ";
          }, title: 'Name', width: "250px"
        },
        { data: "State", width: "80px" },  //   width: "80px"// visible: false,
        { data: "Country", width: "80px" },  //   width: "80px"// visible: false,
        { data: "Phone" },  //   width: "80px"// visible: false,
        {
          render: (data: any, type: any, row: any) => {
            // return "<a class='btn-detail' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Detail</a> ";
            return "<a class='btn-detail' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Detail</a> | <a class='btn-edit' data-toggle='modal' data-target='#empeditmodal' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Edit</a> | <a class='btn-delete' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Delete</a>";
          }, title: 'Action', class: 'dt-center'
        },

      ],


      // ** Calling angular method from within datatable. Routerlink is more smoth than a tag since it swith between components 
      // https://stackoverflow.com/questions/47529333/render-column-in-data-table-with-routerlink
      // https://l-lin.github.io/angular-datatables/#/advanced/row-click-event
      // https://datatables.net/reference/option/rowCallback
      // buttons in same column //https://datatables.net/forums/discussion/56914/rowcallback-mode-responsive
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;

        // Firstname col
        jQuery('a:eq(0)', row).unbind('click');
        jQuery('a:eq(0)', row).bind('click', () => { //in a:eq(0) "a" is used to specify the tag which will be clicked, and  :eq(0) is used to specify the col else whole row click will ire the event
          self.rowFirstNameClickHandler(data);
        });
        // // Detail col, Note: put a "," after "a" tag for the second column"
        // jQuery('a,:eq(5)', row).unbind('click');
        // jQuery('a,:eq(5)', row).bind('click', () => { //in a:eq(0) "a" is used to specify the tag which will be clicked, and  :eq(0) is used to specify the col else whole row click will ire the event
        //   self.rowFirstNameClickHandler(data);
        // });

        // Action column with 3 "a" tags in same column  // https://datatables.net/forums/discussion/56914/rowcallback-mode-responsive
        const eltdetail = $('td', row).find('a.btn-detail');
        if (eltdetail) {
          eltdetail.unbind('click');
          eltdetail.bind('click', () => {
            this.rowDetailClickHandler(data);
          });
        }
        const eltedit = $('td', row).find('a.btn-edit');
        if (eltedit) {
          eltedit.unbind('click');
          eltedit.bind('click', () => {
            this.rowEditClickHandler(data);
          });
        }
        const eltdelete = $('td', row).find('a.btn-delete');
        if (eltdelete) {
          eltdelete.unbind('click');
          eltdelete.bind('click', () => {
            this.rowDeleteClickHandler(data);
          });
        }
        return row;
      },

    }; // end dtOptions

  } // end onInit()



  // Action column handlers connecting to angular methods directly from within jquatu table
  rowFirstNameClickHandler(data: any) {
    // this.router.navigate(['/Caodetail/' + data.CAOID]);
    this.showCaoDetailModal(data.CAOID);
  }



  rowDetailClickHandler(data: any) {
    // this.router.navigate(['/Caodetail/' + data.CAOID]); 
    this.showCaoDetailModal(data.CAOID);
  }



  rowEditClickHandler(data: any) {
    // this.showCaoEditModal(data) // for edit pass only data instead of data.empid
    if (this.commonService.checkEditRole()) {
      this.showCaoEditModal(data.CAOID)
    }
  }



  rowDeleteClickHandler(data: any) {
    // this.deleteCao(data);
    if (this.commonService.checkDeleteRole()) {
      this.deleteCao(data.CAOID);
    }
  }



  viewEmp(e: any) {
    alert("view emp with id: " + e.empid);
    // console.log(e);
    this.router.navigate(['/Empdetail']);
  }



  clearSearch() {
    $('#dt').DataTable().search('').draw();//clear dt text search input
    // this.search();
  }





  
  clearForm() {
    // this.proDacFormGroup.controls['id'].setValue(maxid + 1);
    this.caoFormGroup.controls['caoid'].setValue(0);//(this.childprojectid);
    this.caoFormGroup.controls['name'].setValue('');
    this.caoFormGroup.controls['fullname'].setValue('');
    this.caoFormGroup.controls['addressline1'].setValue('');
    this.caoFormGroup.controls['addressline2'].setValue('');
    this.caoFormGroup.controls['city'].setValue('');
    this.caoFormGroup.controls['state'].setValue(0);
    this.caoFormGroup.controls['zipcode'].setValue('');
    this.caoFormGroup.controls['country'].setValue(0);
    this.caoFormGroup.controls['email'].setValue('');
    this.caoFormGroup.controls['phone'].setValue('');
    this.caoFormGroup.controls['ext'].setValue('');
    this.caoFormGroup.controls['fax'].setValue('');
    this.caoFormGroup.controls['govtagency'].setValue(0);
  }





  showCaoAddModal() {

    // if (this.commonService.user_role === 'guest' || this.commonService.user_role === 'user' ) {
    //   alert("Need permission.");
    //   return;
    // }

    if (!this.commonService.checkAddRole()) {
      return;
    }

    this.modalClicked = "addModal";
    // $('#btnProTeamEditModalShow').click(); 
    $('#btnCaoEditModalShow').click();


    // Now maxid is generated in backend
    // Get the maxid
    //***************************** */
    // let maxid = 0;
    // this.proDescriptionService.getMaxProDescriptionID().subscribe(resp => {

    // maxid = resp[0].maxprodescriptionid;

    //**employeeFormGroup control within the subscribe so tha values are set after maxid is retrieved from database  */
    // clear form group since same group is used for edit and add
    // Now formgroup is used instead of data object to pass value
    this.caoFormGroup.reset(); // to clear the previous validations
    // Manualy set default values since reset() will will turn values to null: // https://stackoverflow.com/questions/51448764/why-are-formgroup-controls-null-after-formgroup-reset
    // this.employeeFormGroup.controls['empid'].setValue(0);

    // this.proDescriptionFormGroup.controls['id'].setValue(maxid + 1);
    this.caoFormGroup.controls['caoid'].setValue(0);//(this.childprojectid);
    this.caoFormGroup.controls['name'].setValue('');
    this.caoFormGroup.controls['fullname'].setValue('');
    this.caoFormGroup.controls['addressline1'].setValue('');
    this.caoFormGroup.controls['addressline2'].setValue('');
    this.caoFormGroup.controls['city'].setValue('');
    this.caoFormGroup.controls['state'].setValue(0);
    this.caoFormGroup.controls['zipcode'].setValue('');
    this.caoFormGroup.controls['country'].setValue(0);
    this.caoFormGroup.controls['email'].setValue('');
    this.caoFormGroup.controls['phone'].setValue('');
    this.caoFormGroup.controls['ext'].setValue('');
    this.caoFormGroup.controls['fax'].setValue('');
    this.caoFormGroup.controls['govtagency'].setValue(0);

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



  showCaoEditModal(e: any) {

    // alert("from edit");
    // if (this.commonService.user_role === 'guest') { 
    //   alert("Need permission.");
    //   return;
    // }

    if (!this.commonService.checkEditRole()) {
      return;
    }

    this.clearForm(); //clear the form of previous edit data
    this.modalClicked = "editModal"
    this.loading2 = true;
    $('#btnCaoEditModalShow').click();

    // $('#btnProDacEditModalShow').click(); 
    this.caoService.getCao(e).subscribe(resp => {

      // this.editData = resp; //use .data after resp for post method. Now using FormFroup to put data
      // **FormFroup and FormControl is used to pass value to edit form instead of [(ngModel)]
      // this.empid=resp.empid; // to pass to child modal if used
      // this.empid = resp.EmpID; // to pass to child modal if used

      // this.empDegreeFormGroup.patchValue(resp); 
      // OR

      // this.proDacFormGroup.controls['id'].setValue(maxid + 1);
      this.caoFormGroup.controls['caoid'].setValue(resp.CAOID);//(this.childprojectid);
      this.caoFormGroup.controls['name'].setValue(resp.Name);
      this.caoFormGroup.controls['fullname'].setValue(resp.FullName);
      this.caoFormGroup.controls['addressline1'].setValue(resp.AddressLine1);
      this.caoFormGroup.controls['addressline2'].setValue(resp.AddressLine2);
      this.caoFormGroup.controls['city'].setValue(resp.City);
      this.caoFormGroup.controls['state'].setValue(resp.State);
      this.caoFormGroup.controls['zipcode'].setValue(resp.Zipcode);
      this.caoFormGroup.controls['country'].setValue(resp.Country);
      this.caoFormGroup.controls['email'].setValue(resp.Email);
      this.caoFormGroup.controls['phone'].setValue(resp.Phone);
      this.caoFormGroup.controls['ext'].setValue(resp.Ext);
      this.caoFormGroup.controls['fax'].setValue(resp.Fax);
      this.caoFormGroup.controls['govtagency'].setValue(resp.GovtAgency);


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





  showCaoDetailModal(e: any) {

    // this.clearForm(); //clear the form of previous edit data
    // this.modalClicked="editModal"
    this.loading2 = true;
    $('#caodetailmodalShow').click();
    $("#proteamempid").prop("disabled", false); // disabled to avoid duplicate

    this.caoService.getCaoDetail(e).subscribe(resp => {

      // this.editData = resp; //use .data after resp for post method. Now using FormFroup to put data
      // **FormFroup and FormControl is used to pass value to edit form instead of [(ngModel)]
      // this.empid=resp.empid; // to pass to child modal if used
      // this.empid = resp.EmpID; // to pass to child modal if used
      this.cao = resp;

      // return;
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
  saveCao() {

    //   // check internet connection first
    //   var onlineOffline = navigator.onLine;
    //   if (onlineOffline===false) {
    //     alert("no internet connection");
    //     return;
    //   }

    if (this.modalClicked == "editModal") {
      this.updateCao();
    }
    if (this.modalClicked == "addModal") {
      this.addCao();
    }

  }



  addCao() {

    // this is for extra protection. User access is controlled in checkRole(). But sometimes the edit btns
    // in the dttable are late to refresh and user may access other users role by clicking on btns. So extra control is used.
    // if (this.isAdmin==false) {
    //   alert("You need permiddion to edit this form");
    //   return;
    // }

    this.loading2 = true;


    this.caoService.addCao(this.caoFormGroup.value).subscribe(resp => {
      // $("#empeditmodal").modal("hide");
      $("#btnCaoEditCloseModal").click();
      // this.refreshEmployeeDatatable();
      this.loading2 = false;
      // this.refreshEmpDetail.next('somePhone'); //calling  loadEmpDetail() from parent component
      // this.router.navigateByUrl('Employee') //navigate to AngularDatatable
      //this.router.navigateByUrl('Empdetail/2') //navigate to AngularDatatable
      // var a= this.getMaxId();
      // this.router.navigateByUrl('Empdetail/' + a) //navigate to AngularDatatable // not working

      this.refreshCaoDatatable();
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




  updateCao() {

    // **FormFroup and FormControl is used to pass value to save form instead of [(ngModel)]
    this.loading2 = true;

    if (this.caoFormGroup.invalid) {
      this.loading2 = false;
      return;
    }


    // NOT USING now instead disabling EmployeeID control
    // DUPLICATE EMPLOYEEID CHECK
    // NOT USING now in update method(using in add) instead disabling EmployeeID control
    //**************************************************************************************** */


    this.caoService.updateCao(this.caoFormGroup.value).subscribe(resp => {

      // $("#empeditmodal").modal("hide");
      $("#btnCaoEditCloseModal").click();
      // this.refreshEmployeeDatatable();
      // this.refreshEmpDetail.next('somePhone'); //calling  loadEmpDetail() from parent component
      this.refreshCaoDatatable();
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



  deleteCao(listid: any) {

    if (confirm('Are you sure you want to delete this record?')) {
      // Delete it!
    } else {
      // Do nothing!
      return;
    }

    this.caoService.deleteCao(listid).subscribe(resp => {
    this.refreshCaoDatatable();  // to refresh datatable after delete

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
  clearFormErrors() {
    this.formErrors = [{}];
  }




}
