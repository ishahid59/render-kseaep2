// import { Component } from '@angular/core';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../../services/common.service';
import { EmployeeService } from '../../services/employee/employee.service';
import { EmpregService } from '../../services/employee/empreg.service';
import { DatePipe } from '@angular/common';// datepipe used to convert date format to show in html date element
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, forkJoin, of } from 'rxjs';
import { EmployeeSearchService } from '../../services/employee/employee-search.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-emp-reg',
  templateUrl: './emp-reg.component.html',
  styleUrls: ['./emp-reg.component.css']
})
export class EmpRegComponent {

  constructor(private http: HttpClient, private authService: AuthService, private empSearchService: EmployeeSearchService, private empService: EmployeeService,private empRegService: EmpregService, public datePipe: DatePipe, private router: Router,public activatedRoute: ActivatedRoute,private commonService: CommonService) {
  }



  @Input() childempid:any;

  // dtOptions: DataTables.Settings = {};
   dtOptions: any = {}; // any is used instead of DataTables.Settings else datatable export buttons wont show

   // To refresh datatable with search parameters without using destroy
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective; //used "!" to avoid initialization of variable. Also can use strict:false in tsconfig.json

  empRegData: any = []; // in angular should ([]) for array
  empreg:any={};
  formErrors: any = [{}];
  loading2: boolean = false;
  componentLoaded = false;

  modalClicked="editModal";
 
  isAdmin:boolean=false;

  cmbEmpReg: any = ([]);
  cmbState: any = ([]);
  cmbCountry: any = ([]);


  //ANGULAR FORMGROUP is used to pass Value to frm control without jquery and better error handling
  //ANGULAR VALIDATORS  https://angular.io/api/forms/Validators
  //*************************************************************************** */
  empRegFormGroup = new FormGroup({

    id: new FormControl(0),
    empid: new FormControl(0),
    registration: new FormControl(0, [Validators.required, Validators.min(1)]),
    regstate: new FormControl(0, [Validators.required, Validators.min(1)]), 
    country: new FormControl(0),
    registrationno: new FormControl(''),
    regyear: new FormControl('' ,[Validators.required, Validators.minLength(4), Validators.maxLength(4)]),
    regissuedate: new FormControl(''),
    regexpdate: new FormControl(''),
    notes: new FormControl(''),

  });


  // set the getters for validation fields. convenient to use in html for validation
  get registration() {
    return this.empRegFormGroup.get('registration');
  }
  get regstate() {
    return this.empRegFormGroup.get('regstate');
  }
  get regyear() {
    return this.empRegFormGroup.get('regyear');
  }



  ngOnInit() {

    // this.loadDatatableEmpDegree();

    // ngOnInit is called only once. So for all next calls Observable is used so that it can always listen
    // https://www.youtube.com/watch?v=b4zpvh_saic&list=PL1BztTYDF-QNrtkvjkT6Wjc8es7QB4Gty&index=65
    if (!this.componentLoaded) {
      this.loadDatatableempReg(); //loadDatatableempReg() has to be called for first time only. Then refreshDatatableempReg() is called everytime
      this.componentLoaded = false;
    }


    // // following observer code moved from ngOnInit() to ngAfterViewInit() since datatable instance is not created yet to be refreshed
      // this.activatedRoute.paramMap.subscribe((param) => {
      //   this.childempid = param.get('id')
      //   this.refreshDatatableempReg();// refresh instance of angular-datatable
      // })

      //this.fillAllCmb(); // 2023  moved to datatable so that so that cmd can be loaded after dttable data
      // this.fillCmbempReg();
      // this.fillCmbState();
      // this.fillCmbCountry();

  }

 

// tab clicked in emp detail
regtabClicked(){
  // alert();
  // only fill cmb when tab clicked to make faster
  // this.loadDatatableempReg();
  // this.fillAllCmb();
}




  /* to remove "no matching records found" even if angular-datatable is not empty */
  // https://github.com/l-lin/angular-datatables/issues/1260
  ngAfterViewInit(): void {

    var that = this;
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.on('draw.dt', function () {
        if (that.empRegData.length > 0) {
          $('.dataTables_empty').remove();
        }
      });
    });
 

    // // ngOnInit is called only once. So for all next calls Observable is used so that it can always listen
    // // https://www.youtube.com/watch?v=b4zpvh_saic&list=PL1BztTYDF-QNrtkvjkT6Wjc8es7QB4Gty&index=65
    // // following observer code moved from ngOnInit() to here ngAfterViewInit()
    this.activatedRoute.paramMap.subscribe((param) => {
      this.childempid = param.get('id')
      this.refreshDatatableEmpReg();// refresh instance of angular-datatable
    })


    // // CHECK PERMISSION USING ROLE and disable btns when required(not secured in localstorage since user can edit)
    // // ******************************************************************************************
    // this.authService.checkRole(this.childempid, 'Employee Main').subscribe(resp => {
    //   this.loading2 = false;
    //   // alert(resp.EditData);
    //   if (resp === null || resp.EditData == 0) { //if table uaccess_control have no record gor this empid it returns null so null is checked
    //     this.isAdmin = false
    //     $("#empregaddbtn").attr("disabled", "disabled"); // add btn 

    //     // a link buttons are disabled in datatable with css 'pointer-events: none;' using condition
    //     // alert("Need permission to edit this form. ");
    //     return;
    //   }
    //   else {
    //     this.isAdmin = true;
    //     // this.showEmpRegEditModal(e)
    //   }
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
    // // ******************************************************************************************







  }


  // Refresh/reload Angular-Datatable. Following method must be used to reload angular-datatable since ngOnInit() is used to initilize table 
  // https://l-lin.github.io/angular-datatables/#/advanced/custom-range-search
  refreshDatatableEmpReg() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });


  }



  loadDatatableempReg() {
    
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
          '' + that.commonService.baseUrl + '/api/empreg/empreg-angular-datatable',
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
          this.empRegData = resp.data; //use .data after resp for post method
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            // data: []
            // //https://stackoverflow.com/questions/57849250/angular-datatables-server-side-processing-and-buttons-extension-data-is-empty
            data:  resp.data  // set data
          });
          this.fillAllCmb(); // 2023  moved here in datatable so that so that cmd can be loaded after dttable data
        });
      },
      "columnDefs": [ {
        "targets": 7,
        "orderable": false
        } ],


            "columns": [
              // { data: "ID", "visible": false },
              {
                data: "disRegistration", width:'130px' 
                // "render": function (data, type, row) {
                // return (
                //     "<a onclick=$('#reghiddenid').val("+row.ID +"); id='empregview' style='cursor:pointer'>"+ data +"</a>"
                //     );
                //    }
              },
              { data: "disRegState", "defaultContent": "",width:'90px' },
              { data: "disCountry", "defaultContent": "",width:'90px' },
              { data: "RegistrationNo" ,width:'120px' },
              { data: "RegYear", width:'120px' },
              // { "data": "RegIssueDate" },
              // { "data": "RegExpDate" },

              // https://datatables.net/plug-ins/dataRender/datetime
              // https://datatables.net/forums/discussion/25196/render-date-and-retain-order-functionality-ajax-object
              // {
              //   "data": "RegIssueDate", "render": function (data, type, row) {
              //     if (data == null) { // to replace "Invalid Date" with "", happens when date field is NULL
              //       return "";
              //     }
              //     if (data == '1900-01-01 00:00:00') { // to replace "default Date"(put by html5 datepicker) with ""
              //       return "";
              //     }

              //     else {
              //       return (self.$moment(data).format("MM/DD/YYYY"));
              //     }
              //   }
              // },

              {
                render: (data: any, type: any, row: any) => {
                  return this.datePipe.transform(row.RegIssueDate, "MM/dd/yyyy");
                }, width: "80px" 
              },  

              // {
              //   "data": "RegExpDate", "render": function (data, type, row) {
              //     if (data == null) { // to replace "Invalid Date" with "", happens when date field is NULL
              //       return "";
              //     }
              //     if (data == '1900-01-01 00:00:00') { // to replace "default Date"(put by html5 datepicker) with ""
              //       return "";
              //     }
              //     else {
              //       return (self.$moment(data).format("MM/DD/YYYY"));
              //     }
              //   }
              // },

              {
                render: (data: any, type: any, row: any) => {
                  return this.datePipe.transform(row.RegExpDate, "MM/dd/yyyy");
                },  width: "80px" 
              },  
              // { data: "EmpID", "visible": false },
              // {
              //   render: (data: any, type: any, row: any) => {
              //     return "<a class='btn-detail' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Detail</a> ";
              //   }, title: 'Action', width: '80px',class:'dt-center'
              // },
              {
                render: (data: any, type: any, row: any) => {
                  // return "<a class='btn-detail' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Detail</a> | <a class='btn-edit' data-toggle='modal' data-target='#empregeditmodal' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Edit</a> | <a class='btn-delete' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Delete</a>";
                  // 2023 removed the edit data-target='#empregeditmodal' to stop modal auto open.
                  // now opening manualy in showEmpRegEditModal() if user is authorized
                 
                //  if (this.isAdmin==false) {
                //   return "<a class='btn-detail' id='btn-detail' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Detail</a> | <a class='btn-edit'  style='pointer-events:none;cursor: pointer;text-decoration:underline;color:#a0a0a0;' >Edit</a> | <a class='btn-delete' style='pointer-events:none;cursor: pointer;text-decoration:underline;color:#a0a0a0;' >Delete</a>";
                //  }
                //  else{
                //   return "<a class='btn-detail' id='btn-detail' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Detail</a> | <a class='btn-edit'  style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Edit</a> | <a class='btn-delete' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Delete</a>";
                //  }
                 return "<a class='btn-detail' id='btn-detail' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Detail</a> | <a class='btn-edit'  style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Edit</a> | <a class='btn-delete' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Delete</a>";


                }, //title: 'Action',width:'250px'
              },

            ], // end columns

        // ** Calling angular method from within datatable. Routerlink is more smoth than a tag since it swith between components 
        // https://stackoverflow.com/questions/47529333/render-column-in-data-table-with-routerlink
        // https://l-lin.github.io/angular-datatables/#/advanced/row-click-event
        // https://datatables.net/reference/option/rowCallback
        // buttons in same column //https://datatables.net/forums/discussion/56914/rowcallback-mode-responsive
        rowCallback: (row: Node, data: any[] | Object, index: number) => {
          const self = this;

        // // Fix for col width: https://stackoverflow.com/questions/54612232/how-to-set-the-width-of-an-individual-column
        // setTimeout(() => {
        //   let itemColumn: any = document.querySelector('#proteamemployeeid');
        //   itemColumn.setAttribute('style', 'width: 15% !important;');
        // }, 100)

        // // Firstname col
        // jQuery('a:eq(0)', row).unbind('click');
        // jQuery('a:eq(0)', row).bind('click', () => { //in a:eq(0) "a" is used to specify the tag which will be clicked, and  :eq(0) is used to specify the col else whole row click will ire the event
        //   self.rowFirstNameClickHandler(data);
        // });
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


  

    };


  }


  
// // Action column handlers connecting to angular methods directly from within jquatu table
// rowFirstNameClickHandler(data:any) {
//   this.router.navigate(['/Empdetail/' + data.EmpID]);
// }

  // CHECKING role IS DONE FROM SERVER WHEN BUTTON CLICKED.LOCALSTORAGE IS NOT SAFE
  // IT IS COMPLICATED TO ENABLE/DISABLE BUTTONS OR USING isAdmin variable globally for datatable and detail page
  // ************************************************************************************************************* 
  rowDetailClickHandler(data: any) {
    // this.router.navigate(['/Empdetail/' + data.ID]); //TODO
    this.showEmpRegDetailModal(data.ID);
  }
  rowEditClickHandler(data: any) {
    // this.showEmpRegEditModal(data.ID);
    this.checkEditRole(data.ID);
  }
  rowDeleteClickHandler(data: any) {
    // this.deleteEmpReg(data.ID);
    this.checkDeleteRole(data.ID);
  }




// CHECKING role IS DONE FROM SERVER WHEN BUTTON CLICKED.LOCALSTORAGE IS NOT SAFE
// IT IS COMPLICATED TO ENABLE/DISABLE BUTTONS OR USING isAdmin variable globally for datatable and detail page
// ************************************************************************************************************* 
checkEditRole(e: any) {
    this.authService.checkRole(this.childempid, 'Employee Main').subscribe(resp => {
      if (resp === null || resp.EditData == 0) { //if table uaccess_control have no record gor this empid it returns null so null is checked
        alert("Need permission.");
      }
      else {
        this.showEmpRegEditModal(e);
      }
    },
      err => {
        alert(err.message);
      });
  }

  checkAddRole() {
    this.authService.checkRole(this.childempid, 'Employee Main').subscribe(resp => {
      if (resp === null || resp.EditData == 0) { //if table uaccess_control have no record gor this empid it returns null so null is checked
        alert("Need permission.");
      }
      else {
        this.showEmpRegAddModal()
      }
    },
      err => {
        alert(err.message);
      });
  }

  checkDeleteRole(e: any) {
    this.authService.checkRole(this.childempid, 'Employee Main').subscribe(resp => {
      if (resp === null || resp.EditData == 0) { //if table uaccess_control have no record gor this empid it returns null so null is checked
        alert("Need permission.");
      }
      else {
        this.deleteEmpReg(e);
      }
    },
      err => {
        this.formErrors = err.error.errors;
      });
  }










  // saveEmp common for edit and add. Option to call 2 function from here 
  saveEmpReg() {

    //   // check internet connection first
    //   var onlineOffline = navigator.onLine;
    //   if (onlineOffline===false) {
    //     alert("no internet connection");
    //     return;
    //   }
    if (this.modalClicked == "editModal") {
      this.updateEmpReg();
    }
    if (this.modalClicked == "addModal") {
      this.addEmpReg();
    }
  }






  clearForm(){
    this.empRegFormGroup.controls['id'].setValue(0);
    this.empRegFormGroup.controls['empid'].setValue(this.childempid);
    this.empRegFormGroup.controls['registration'].setValue(0);
    this.empRegFormGroup.controls['registrationno'].setValue('');
    this.empRegFormGroup.controls['regstate'].setValue(0);
    this.empRegFormGroup.controls['country'].setValue(0);
    this.empRegFormGroup.controls['regyear'].setValue('');
    this.empRegFormGroup.controls['regissuedate'].setValue('');
    this.empRegFormGroup.controls['regexpdate'].setValue('');
    this.empRegFormGroup.controls['notes'].setValue('');
  }



 showEmpRegAddModal() {

    if (this.isAdmin == false) {
      return;
    }

    this.modalClicked = "addModal"
    $('#btnEmpRegModalShow').click(); 

    //Get the maxid
    //***************************** */
    let maxid = 0;
    this.empRegService.getMaxEmpRegID().subscribe(resp => {
      
      maxid = resp[0].maxempregid;

      //**employeeFormGroup control within the subscribe so tha values are set after maxid is retrieved from database  */
      // clear form group since same group is used for edit and add
      // Now formgroup is used instead of data object to pass value
      this.empRegFormGroup.reset(); // to clear the previous validations
      // Manualy set default values since reset() will will turn values to null: // https://stackoverflow.com/questions/51448764/why-are-formgroup-controls-null-after-formgroup-reset
      // this.employeeFormGroup.controls['empid'].setValue(0);

      this.empRegFormGroup.controls['id'].setValue(maxid + 1);
      this.empRegFormGroup.controls['empid'].setValue(this.childempid);
      this.empRegFormGroup.controls['registration'].setValue(0);
      this.empRegFormGroup.controls['registrationno'].setValue('');
      this.empRegFormGroup.controls['regstate'].setValue(0);
      this.empRegFormGroup.controls['country'].setValue(0);
      this.empRegFormGroup.controls['regyear'].setValue('');
      this.empRegFormGroup.controls['regissuedate'].setValue(null);
      this.empRegFormGroup.controls['regexpdate'].setValue(null);
      this.empRegFormGroup.controls['notes'].setValue('');

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




  showEmpRegEditModal(e: any) {

    this.clearForm(); //clear the form of previous edit data
    this.modalClicked = "editModal"
    $('#btnEmpRegModalShow').click(); 

    this.loading2 = true;

    this.empRegService.getEmpReg(e).subscribe(resp => {

      //this.editData = resp; //use .data after resp for post method. Now using FormFroup to put data
      // **FormFroup and FormControl is used to pass value to edit form instead of [(ngModel)]
      // this.empid=resp.empid; // to pass to child modal if used

      // this.empid = resp.EmpID; // to pass to child modal if used

      // this.empRegFormGroup.patchValue(resp); 
      // OR

      this.empRegFormGroup.controls['id'].setValue(resp.ID);
      this.empRegFormGroup.controls['empid'].setValue(resp.EmpID);
      this.empRegFormGroup.controls['registration'].setValue(resp.Registration);
      this.empRegFormGroup.controls['registrationno'].setValue(resp.RegistrationNo);
      this.empRegFormGroup.controls['regstate'].setValue(resp.RegState);
      this.empRegFormGroup.controls['country'].setValue(resp.Country);
      this.empRegFormGroup.controls['regyear'].setValue(resp.RegYear);
      this.empRegFormGroup.controls['regissuedate'].setValue(this.datePipe.transform(resp.RegIssueDate, "yyyy-MM-dd"));
      this.empRegFormGroup.controls['regexpdate'].setValue(this.datePipe.transform(resp.RegExpDate, "yyyy-MM-dd"));
      this.empRegFormGroup.controls['notes'].setValue(resp.Notes);

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













  showEmpRegDetailModal(e:any){
    

    // this.clearForm(); //clear the form of previous edit data
    // this.modalClicked="editModal"
    this.loading2=true;
    $('#empregdetailmodalShow').click(); 
    
    this.empRegService.getEmpRegDetail(e).subscribe(resp => {

      //this.editData = resp; //use .data after resp for post method. Now using FormFroup to put data
      // **FormFroup and FormControl is used to pass value to edit form instead of [(ngModel)]
      // this.empid=resp.empid; // to pass to child modal if used
  
      // this.empid = resp.EmpID; // to pass to child modal if used
     this.empreg=resp;
    
    
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

    }









    // Fill all combos in one function using forkJoin of rxjx
    fillAllCmb() {
      forkJoin([
        this.empSearchService.getCmbEmpRegistration(), //observable 1
        this.empSearchService.getCmbState(), //observable 2
        this.empSearchService.getCmbCountry() //observable 2
      ]).subscribe(([cmbEmpReg, cmbState, cmbCountry]) => {
        // When Both are done loading do something
        this.cmbEmpReg = cmbEmpReg;
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





    addEmpReg() {

      this.loading2 = true;
      
    // *** 2023 Note If date is cleared the it always has a value of '' which tries to save 0000-00-00 00:00:00 in mysql server resulting err;
    // 2023 SO handle it in front end and save null when value is '' dont have to do antthing in backend
    if (this.empRegFormGroup.controls['regissuedate'].value === '') {//0000-00-00 00:00:00
      this.empRegFormGroup.controls['regissuedate'].setValue(null);
    }
    if (this.empRegFormGroup.controls['regexpdate'].value === '') {//0000-00-00 00:00:00
      this.empRegFormGroup.controls['regexpdate'].setValue(null);
    }

      this.empRegService.addEmpReg(this.empRegFormGroup.value).subscribe(resp => {
        // $("#empeditmodal").modal("hide");
        $("#btnEmpRegEditCloseModal").click();
        // this.refreshEmployeeDatatable();
        this.loading2 = false;
        // this.refreshEmpDetail.next('somePhone'); //calling  loadEmpDetail() from parent component
        // this.router.navigateByUrl('Employee') //navigate to AngularDatatable
        //this.router.navigateByUrl('Empdetail/2') //navigate to AngularDatatable
        // var a= this.getMaxId();
        // this.router.navigateByUrl('Empdetail/' + a) //navigate to AngularDatatable // not working
  
        this.refreshDatatableEmpReg ();
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
  
  
  
  
    updateEmpReg() {
  
          // **FormFroup and FormControl is used to pass value to save form instead of [(ngModel)]
          this.loading2=true;
  
          if (this.empRegFormGroup.invalid) {
            this.loading2=false;
            return;
          }
      
          // Handle date. If cleared in html the datepicker returns empty string "" and saves as '0000-00-00' in database 
          // which gives error while reading in form . So convert the date to "null" before saving empty string
          // if (this.employeeFormGroup.controls['hiredate'].value === '') {
          //   this.employeeFormGroup.controls['hiredate'].setValue(null);
          // }

          // *** 2023 Note If date is cleared the it always has a value of '' which tries to save 0000-00-00 00:00:00 in mysql server resulting err;
          // 2023 SO handle it in front end and save null when value is '' dont have to do antthing in backend
          // alert(this.empRegFormGroup.controls['regissuedate'].value);
          // return;
          
          if (this.empRegFormGroup.controls['regissuedate'].value === '') {//0000-00-00 00:00:00
            this.empRegFormGroup.controls['regissuedate'].setValue(null);
          }
          if (this.empRegFormGroup.controls['regexpdate'].value === '') {//0000-00-00 00:00:00
            this.empRegFormGroup.controls['regexpdate'].setValue(null);
          }

          
          this.empRegService.updateEmpReg(this.empRegFormGroup.value).subscribe(resp => {
            
            // $("#empeditmodal").modal("hide");
            $("#btnEmpRegEditCloseModal").click();
            // this.refreshEmployeeDatatable();
            // this.refreshEmpDetail.next('somePhone'); //calling  loadEmpDetail() from parent component
            this.refreshDatatableEmpReg();
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
  
  

  deleteEmpReg(empregid: any) {

    if (confirm('Are you sure you want to delete this record?')) {
      // Delete it!
    } else {
      // Do nothing!
      return;
    }

    this.empRegService.deleteEmpReg(empregid).subscribe(resp => {
      // $("#empeditmodal").modal("hide");
      // this.refreshEmployeeDatatable();
      // this.router.navigateByUrl('Employee') //navigate to AngularDatatable
      this.refreshDatatableEmpReg();  // to refresh datatable after delete

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












  // called form save clicked to detect any new errors on save click.
  clearFormErrors(){
    this.formErrors=[{}];
  }

}
