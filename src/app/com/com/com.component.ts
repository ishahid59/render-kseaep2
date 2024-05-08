// import { Component } from '@angular/core';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../../services/common.service';
import { EmployeeService } from '../../services/employee/employee.service';
import { ComService } from '../../services/com/com.service';
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
// import { EmpEditModalComponent } from '../emp-edit-modal/emp-edit-modal.component';
import { ComEditModalComponent } from '../com-edit-modal/com-edit-modal.component';

@Component({
  selector: 'app-com',
  templateUrl: './com.component.html',
  styleUrls: ['./com.component.css']
})


export class ComComponent {


  constructor(private http: HttpClient, private comService: ComService, private empSearchService: EmployeeSearchService,public datePipe: DatePipe,private router: Router,private commonService: CommonService) {
  }


 

  // dtOptions: DataTables.Settings = {};
  dtOptions: any = {}; // any is used instead of DataTables.Settings else datatable export buttons wont show

  // To refresh datatable with search parameters without using destroy
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective; //used "!" to avoid initialization of variable. Also can use strict:false in tsconfig.json


  // table data
  myData: any = ([]); // in angular should ([]) for array
  com: any = {};  
  comid: any = 0; // to pass to child modal if used
  
  cmbState: any = ([]);
  cmbCountry: any = ([]);
  cmbOffiCecategory: any = ([]);
  cmbTypeOfOwnership: any = ([]);

  formErrors: any = [{}];
  loading2: boolean = false;
  componentLoaded = false;
  modalClicked = "editModal";

// AddressLine1
// AddressLine2
// City
// ComID
// CompanyName
// Country
// DunsNo
// IECompany
// OfficeCategory
// ParentCompany
// ParentCompanyName
// State
// TotalPersonnel
// TypeOfOwnership
// YearEstablished
// ZipCode

  //ANGULAR FORMGROUP is used to pass Value to frm control without jquery and better error handling
  //ANGULAR VALIDATORS  https://angular.io/api/forms/Validators
  //*************************************************************************** */
  comFormGroup = new FormGroup({
    comid: new FormControl(0),
    companyname: new FormControl('', [Validators.required]),
    addressline1: new FormControl(''),
    addressline2: new FormControl(''),
    city: new FormControl(''),
    state: new FormControl(0),
    zipcode: new FormControl(''),
    country: new FormControl(0),
    officecategory: new FormControl(0),
    typeofownership: new FormControl(0),
    yearestablished: new FormControl(''),
    totalpersonnel: new FormControl(0),
    parentcompanyname: new FormControl(''),
    dunsno: new FormControl(''),
    parentcompany: new FormControl(0),
    iecompany: new FormControl(0),
});


  // set the getters for validation fields. convenient to use in html for validation
  get companyname() {
    return this.comFormGroup.get('companyname');
  }
 

 // // For Angular-Datatable reload. Following method must be used to reload angular-datatable since ngOnInit() is used to initilize table 
  // https://l-lin.github.io/angular-datatables/#/advanced/custom-range-search
  refreshComDatatable() {
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
        if (that.myData.length > 0) {
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
      lengthMenu: [ [15, 25, 50, -1], [15, 25, 50, "All"] ],
      dom: 'Blfrtip',//'Blfrtip', //'Bfrtip', use l before f to show length with bottons
      // //"any" is used in "dtOptions" instead of DataTables.Settings else datatable export buttons wont show
      buttons: [
        // 'copy', 'csv', 'excel', 'pdf', 'print'
        'excel', 'csv', 'pdf', 'print',

      ],
      

      ajax: (dataTablesParameters: any, callback: any) => {
        this.http.post<any>(
          // 'http://localhost:5000/api/employee/search/angular-datatable',
          '' + that.commonService.baseUrl + '/api/com/angular-datatable',

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
          this.myData = resp.data; //use .data after resp for post method

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

        // AddressLine1
        // AddressLine2
        // City
        // ComID
        // CompanyName
        // Country
        // DunsNo
        // IECompany
        // OfficeCategory
        // ParentCompany
        // ParentCompanyName
        // State
        // TotalPersonnel
        // TypeOfOwnership
        // YearEstablished
        // ZipCode

           // { data: "ComID", title: "ComID", visible: false },
           {
            render: (data: any, type: any, row: any) => {
              // return "<a style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);'  href='/Empdetail/" + row.empid + "'>" + row.firstname + "</a> ";
              return "<a style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >" + row.CompanyName + "</a> ";
            }, title: 'Name',width:"250px"
          },
          { data: "State" ,width:"80px"},  //   width: "80px"// visible: false,
          { data: "Country" ,width:"80px" },  //   width: "80px"// visible: false,
          // { data: "IECompany" },  //   width: "80px"// visible: false,
  
          // { data: "AddressLine1", visible: false },  //   width: "80px"// visible: false,
          // { data: "AddressLine2", visible: false },  //   width: "80px"// visible: false,
          // { data: "City", visible: false },  //   width: "80px"// visible: false,
          // { data: "DunsNo", visible: false },  //   width: "80px"// visible: false,
          // { data: "OfficeCategory", visible: false },  //   width: "80px"// visible: false,
          // { data: "ParentCompany", visible: false },  //   width: "80px"// visible: false,
          // { data: "ParentCompanyName", visible: false },  //   width: "80px"// visible: false,
          // { data: "TotalPersonnel", visible: false },  //   width: "80px"// visible: false,
          // { data: "TypeOfOwnership", visible: false },  //   width: "80px"// visible: false,
          // { data: "YearEstablished", visible: false },  //   width: "80px"// visible: false,
          // { data: "ZipCode", visible: false },  //   width: "80px"// visible: false,

        {
          render: function (data: any, type: any, row: any) {
            if (row.IECompany === 1) {
              return "<span style='color:#ad3636'>IE Company</span>";
            }
            else {
              return "KSE Company";;
            }
          }
        },

 
          {
            render: (data: any, type: any, row: any) => {
              // return "<a class='btn-detail' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Detail</a> ";
              return "<a class='btn-detail' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Detail</a> | <a class='btn-edit' data-toggle='modal' data-target='#empeditmodal' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Edit</a> | <a class='btn-delete' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Delete</a>";
            }, title: 'Action', class:'dt-center'
          },

      ],


      // ** Calling angular method from within datatable. Routerlink is more smoth than a tag since it swith between components 
      // https://stackoverflow.com/questions/47529333/render-column-in-data-table-with-routerlink
      // https://l-lin.github.io/angular-datatables/#/advanced/row-click-event
      // https://datatables.net/reference/option/rowCallback
      // buttons in same column //https://datatables.net/forums/discussion/56914/rowcallback-mode-responsive
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;

        // Datatable ROW SELECT(HIGHLIGHT) CODE now calling from commonService
        //********************************************************************************** */
        that.commonService.dtRowSelect(row)
        //********************************************************************************** */


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
rowFirstNameClickHandler(data:any) {

  // this.router.navigate(['/Comdetail/' + data.ComID]);
  this.showComDetailModal(data.ComID);


    
    // TO INITIALIZE MULTISELECT NEEDS PAGE REFRESH TO RUN JAVASCRIPT CODE IN Index.html
    //***************************************************************************************** */
    // Option-1
    // setTimeout(() => {
    //   location.reload()
    // }, 0);

    // Option 2 smooth, takes time but no jumping
    //***************************************************************************************** */
    // window.location.href = '/Projectdetail/' + data.ProjectID;
}


rowDetailClickHandler(data:any) {
  // alert("Detail Handler: "+data.firstname+"");
  // this.router.navigate(['/Empdetail/' + data.EmpID]);
  // this.router.navigate(['/Comdetail/' + data.ComID]);
  this.showComDetailModal(data.ComID);
}

rowEditClickHandler(data:any) {
  // alert("Edit Handler: "+data.firstname+"");
  // this.showEmpEditModal(data) // for edit pass only data instead of data.empid
  if (this.commonService.checkEditRole()) {
    this.showComEditModal(data.ComID)
  }
}



rowDeleteClickHandler(data:any) {
  // alert("Delete Handler: "+data.firstname+"");
  // this.deleteEmp(data);
  if (this.commonService.checkDeleteRole()) {
    this.deleteCom(data.ComID);
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
    this.comFormGroup.controls['comid'].setValue(0);//(this.childprojectid);
    this.comFormGroup.controls['companyname'].setValue('');
    this.comFormGroup.controls['addressline1'].setValue('');
    this.comFormGroup.controls['addressline2'].setValue('');
    this.comFormGroup.controls['city'].setValue('');
    this.comFormGroup.controls['state'].setValue(0);
    this.comFormGroup.controls['zipcode'].setValue('');
    this.comFormGroup.controls['country'].setValue(0);
    this.comFormGroup.controls['officecategory'].setValue(0);
    this.comFormGroup.controls['typeofownership'].setValue(0);
    this.comFormGroup.controls['yearestablished'].setValue('');
    this.comFormGroup.controls['totalpersonnel'].setValue(0);
    this.comFormGroup.controls['parentcompanyname'].setValue('');
    this.comFormGroup.controls['dunsno'].setValue('');
    this.comFormGroup.controls['parentcompany'].setValue(0);
    this.comFormGroup.controls['iecompany'].setValue(0);
  }



  showComAddModal() {

    // if (this.commonService.user_role === 'guest' || this.commonService.user_role === 'user' ) {
    //   alert("Need permission.");
    //   return;
    // }

    if (!this.commonService.checkAddRole()) {
      return;
    }

    this.modalClicked = "addModal";
    // $('#btnProTeamEditModalShow').click(); 
    $('#btnComEditModalShow').click();
    // $("#comidedit").prop("disabled", false); // disabled to avoid duplicate



    // Now maxid is generated in backend
    // Get the maxid
    //***************************** */
    // let maxid = 0;
    // this.proDescriptionService.getMaxProDescriptionID().subscribe(resp => {

    // maxid = resp[0].maxprodescriptionid;

    //**employeeFormGroup control within the subscribe so tha values are set after maxid is retrieved from database  */
    // clear form group since same group is used for edit and add
    // Now formgroup is used instead of data object to pass value
    this.comFormGroup.reset(); // to clear the previous validations
    // Manualy set default values since reset() will will turn values to null: // https://stackoverflow.com/questions/51448764/why-are-formgroup-controls-null-after-formgroup-reset
    // this.employeeFormGroup.controls['empid'].setValue(0);

    // this.proDescriptionFormGroup.controls['id'].setValue(maxid + 1);
    this.comFormGroup.controls['comid'].setValue(0);//(this.childprojectid);
    this.comFormGroup.controls['companyname'].setValue('');
    this.comFormGroup.controls['addressline1'].setValue('');
    this.comFormGroup.controls['addressline2'].setValue('');
    this.comFormGroup.controls['city'].setValue('');
    this.comFormGroup.controls['state'].setValue(0);
    this.comFormGroup.controls['zipcode'].setValue('');
    this.comFormGroup.controls['country'].setValue(0);
    this.comFormGroup.controls['officecategory'].setValue(0);
    this.comFormGroup.controls['typeofownership'].setValue(0);
    this.comFormGroup.controls['yearestablished'].setValue('');
    this.comFormGroup.controls['totalpersonnel'].setValue(0);
    this.comFormGroup.controls['parentcompanyname'].setValue('');
    this.comFormGroup.controls['dunsno'].setValue('');
    this.comFormGroup.controls['parentcompany'].setValue(0);
    this.comFormGroup.controls['iecompany'].setValue(0);

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



  showComEditModal(e: any) {

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
    $('#btnComEditModalShow').click();
    // $("#comidedit").prop("disabled", true); // disabled to avoid duplicate


    // $('#btnProDacEditModalShow').click(); 
    this.comService.getCom(e).subscribe(resp => {

      // this.editData = resp; //use .data after resp for post method. Now using FormFroup to put data
      // **FormFroup and FormControl is used to pass value to edit form instead of [(ngModel)]
      // this.empid=resp.empid; // to pass to child modal if used
      // this.empid = resp.EmpID; // to pass to child modal if used

      // this.empDegreeFormGroup.patchValue(resp); 
      // OR

      // this.proDacFormGroup.controls['id'].setValue(maxid + 1);
      this.comFormGroup.controls['comid'].setValue(resp.ComID);//(this.childprojectid);
      this.comFormGroup.controls['companyname'].setValue(resp.CompanyName);
      this.comFormGroup.controls['addressline1'].setValue(resp.AddressLine1);
      this.comFormGroup.controls['addressline2'].setValue(resp.AddressLine2);
      this.comFormGroup.controls['city'].setValue(resp.City);
      this.comFormGroup.controls['state'].setValue(resp.State);
      this.comFormGroup.controls['zipcode'].setValue(resp.ZipCode);
      this.comFormGroup.controls['country'].setValue(resp.Country);
      this.comFormGroup.controls['officecategory'].setValue(resp.OfficeCategory);
      this.comFormGroup.controls['typeofownership'].setValue(resp.TypeOfOwnership);
      this.comFormGroup.controls['yearestablished'].setValue(resp.YearEstablished);
      this.comFormGroup.controls['totalpersonnel'].setValue(resp.TotalPersonnel);
      this.comFormGroup.controls['parentcompanyname'].setValue(resp.ParentCompanyName);
      this.comFormGroup.controls['dunsno'].setValue(resp.DunsNo);
      this.comFormGroup.controls['parentcompany'].setValue(resp.ParentCompany);
      this.comFormGroup.controls['iecompany'].setValue(resp.IECompany);

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





  showComDetailModal(e: any) {

    // this.clearForm(); //clear the form of previous edit data
    // this.modalClicked="editModal"
    this.loading2 = true;
    $('#comdetailmodalShow').click();
    $("#proteamempid").prop("disabled", false); // disabled to avoid duplicate

    this.comService.getComdetail(e).subscribe(resp => {

      // this.editData = resp; //use .data after resp for post method. Now using FormFroup to put data
      // **FormFroup and FormControl is used to pass value to edit form instead of [(ngModel)]
      // this.empid=resp.empid; // to pass to child modal if used
      // this.empid = resp.EmpID; // to pass to child modal if used
      this.com = resp;

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
  saveCom() {

    //   // check internet connection first
    //   var onlineOffline = navigator.onLine;
    //   if (onlineOffline===false) {
    //     alert("no internet connection");
    //     return;
    //   }

    if (this.modalClicked == "editModal") {
      this.updateCom();
    }
    if (this.modalClicked == "addModal") {
      this.addCom();
    }

  }



  addCom() {

    // this is for extra protection. User access is controlled in checkRole(). But sometimes the edit btns
    // in the dttable are late to refresh and user may access other users role by clicking on btns. So extra control is used.
    // if (this.isAdmin==false) {
    //   alert("You need permiddion to edit this form");
    //   return;
    // }

    this.loading2 = true;


    this.comService.addCom(this.comFormGroup.value).subscribe(resp => {
      // $("#empeditmodal").modal("hide");
      $("#btnComEditCloseModal").click();
      // this.refreshEmployeeDatatable();
      this.loading2 = false;
      // this.refreshEmpDetail.next('somePhone'); //calling  loadEmpDetail() from parent component
      // this.router.navigateByUrl('Employee') //navigate to AngularDatatable
      //this.router.navigateByUrl('Empdetail/2') //navigate to AngularDatatable
      // var a= this.getMaxId();
      // this.router.navigateByUrl('Empdetail/' + a) //navigate to AngularDatatable // not working

      this.refreshComDatatable();
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




  updateCom() {

    // **FormFroup and FormControl is used to pass value to save form instead of [(ngModel)]
    this.loading2 = true;

    if (this.comFormGroup.invalid) {
      this.loading2 = false;
      return;
    }


    // NOT USING now instead disabling EmployeeID control
    // DUPLICATE EMPLOYEEID CHECK
    // NOT USING now in update method(using in add) instead disabling EmployeeID control
    //**************************************************************************************** */


    this.comService.updateCom(this.comFormGroup.value).subscribe(resp => {

      // $("#empeditmodal").modal("hide");
      $("#btnComEditCloseModal").click();
      // this.refreshEmployeeDatatable();
      // this.refreshEmpDetail.next('somePhone'); //calling  loadEmpDetail() from parent component
      this.refreshComDatatable();
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



  deleteCom(listid: any) {

    if (confirm('Are you sure you want to delete this record?')) {
      // Delete it!
    } else {
      // Do nothing!
      return;
    }

    this.comService.deleteCom(listid).subscribe(resp => {
    this.refreshComDatatable();  // to refresh datatable after delete

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
      this.empSearchService.getCmbCountry(), //observable 2
      this.comService.getCmbOfficeCategory(), //observable 2
      this.comService.getCmbTypeOfOwnership() //observable 2
    ]).subscribe(([cmbState, cmbCountry, cmbOffiCecategory,cmbTypeOfOwnership ]) => {
      // When Both are done loading do something
      this.cmbState = cmbState;
      this.cmbCountry = cmbCountry;
      this.cmbOffiCecategory = cmbOffiCecategory;
      this.cmbTypeOfOwnership = cmbTypeOfOwnership;
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
