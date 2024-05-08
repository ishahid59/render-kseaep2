// import { Component } from '@angular/core';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../../services/common.service';
import { EmployeeService } from '../../services/employee/employee.service';
import { EmpmembershipService } from '../../services/employee/empmembership.service';
import { DatePipe } from '@angular/common';// datepipe used to convert date format to show in html date element
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, forkJoin, of } from 'rxjs';
import { EmployeeSearchService } from '../../services/employee/employee-search.service';
import { AuthService } from '../../services/auth.service';
 
@Component({
  selector: 'app-emp-membership',
  templateUrl: './emp-membership.component.html',
  styleUrls: ['./emp-membership.component.css']
})
export class EmpMembershipComponent {


  constructor(private http: HttpClient, private authService: AuthService, private empSearchService: EmployeeSearchService, private empService: EmployeeService,private empMembershipService: EmpmembershipService, public datePipe: DatePipe, private router: Router,public activatedRoute: ActivatedRoute,private commonService: CommonService) {
  }



  @Input() childempid:any;


  // dtOptions: DataTables.Settings = {};
  dtOptions: any = {}; // any is used instead of DataTables.Settings else datatable export buttons wont show

  // To refresh datatable with search parameters without using destroy
 @ViewChild(DataTableDirective, { static: false })
 datatableElement!: DataTableDirective; //used "!" to avoid initialization of variable. Also can use strict:false in tsconfig.json

 empMembershipData: any = []; // in angular should ([]) for array
 empmembership:any={};
 formErrors: any = [{}];
 loading2: boolean = false;
 componentLoaded = false;

 modalClicked="editModal";

 isAdmin:boolean=false;




  // ID
  // OrgName
  // AffiliationType
  // AffiliationDate
  // ExpirationDate
  // Notes
  // EmpID


  empmembershipFormGroup = new FormGroup({
    id: new FormControl(0),
    empid: new FormControl(0),
    // orgname: new FormControl('', [Validators.required, Validators.min(1)]),
    orgname: new FormControl('', [Validators.required]),

    affiliationtype: new FormControl(''),
    affiliationdate: new FormControl(''),
    expirationdate: new FormControl(''),
    notes: new FormControl(''),    
  });


  // set the getters for validation fields. convenient to use in html for validation
  get orgname() {
    return this.empmembershipFormGroup.get('orgname');
  }


  ngOnInit() {

    // this.loadDatatableEmpDegree();

    // ngOnInit is called only once. So for all next calls Observable is used so that it can always listen
    // https://www.youtube.com/watch?v=b4zpvh_saic&list=PL1BztTYDF-QNrtkvjkT6Wjc8es7QB4Gty&index=65
    if (!this.componentLoaded) {
      this.loadDatatableempMembership(); //loadDatatableempReg() has to be called for first time only. Then refreshDatatableempReg() is called everytime
      // this.componentLoaded = false;
      this.componentLoaded = true;//2023 to avoid duplicate datatable on load

    }
  }



// tab clicked in emp detail
trainingtabClicked(){
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
        if (that.empMembershipData.length > 0) {
          $('.dataTables_empty').remove();
        }
      });
    });
 

    // ngOnInit is called only once. So for all next calls Observable is used so that it can always listen
    // https://www.youtube.com/watch?v=b4zpvh_saic&list=PL1BztTYDF-QNrtkvjkT6Wjc8es7QB4Gty&index=65
    // following observer code moved from ngOnInit() to here ngAfterViewInit()
    this.activatedRoute.paramMap.subscribe((param) => {
      this.childempid = param.get('id')
      if (!this.componentLoaded) { //2023 to avoid duplicate datatable on load
      this.refreshDatatableEmpMembership();// refresh instance of angular-datatable
      }
      this.componentLoaded = false; //2023 to avoid duplicate datatable on load

      // **2023For checking role everytime employee is changed
      // ********************************************************
      // now user_role value is checked in app.component and user_role value is saved in common.services
      // this.checkRole();
      
    })


  }


  // Refresh/reload Angular-Datatable. Following method must be used to reload angular-datatable since ngOnInit() is used to initilize table 
  // https://l-lin.github.io/angular-datatables/#/advanced/custom-range-search
  refreshDatatableEmpMembership() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }



  loadDatatableempMembership() {

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
          '' + that.commonService.baseUrl + '/api/empmembership/empmembership-angular-datatable',
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
          this.empMembershipData = resp.data; //use .data after resp for post method
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            // data: []
            // //https://stackoverflow.com/questions/57849250/angular-datatables-server-side-processing-and-buttons-extension-data-is-empty
            data:  resp.data  // set data
          });
          // this.fillAllCmb(); // 2023  moved here in datatable so that so that cmd can be loaded after dttable data
          this.commonService.setButtonStatus(); // disable btn if no permission

        });
      },
      "columnDefs": [ {
        "targets": 3,
        "orderable": false
        } ],
        // ID
        // OrgName
        // AffiliationType
        // AffiliationDate
        // ExpirationDate
        // Notes
        // EmpID
            "columns": [
              // { data: "ID", "visible": false },
              { data: "OrgName", width:'300px' },
              { data: "AffiliationType", width:'100px'  },
              // { data: "AffiliationDate", width:'100px'  },
              {
                render: (data: any, type: any, row: any) => {
                  return this.datePipe.transform(row.AffiliationDate, "MM/dd/yyyy");
                }, width: "100px" 
              },  
              // { data: "ExpirationDate", width:'100px'  },
              // { data: "Notes", width:'100px'  },
              // { "data": "EmpID" },
 
                {
                render: (data: any, type: any, row: any) => {
                   return "<a class='btn-detail' id='empmembership-btn-detail' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Detail</a> | <a class='btn-edit' id='empmembership-btn-edit'  style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Edit</a> | <a class='btn-delete' id='empmembership-btn-delete' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Delete</a>";
                }, "className": "dt-center", //title: 'Action',width:'250px'
              },

            ], // end columns

        // ** Calling angular method from within datatable. Routerlink is more smoth than a tag since it swith between components 
        rowCallback: (row: Node, data: any[] | Object, index: number) => {
          const self = this;

          // Datatable ROW SELECT(HIGHLIGHT) CODE now calling from commonService
          //********************************************************************************** */
          that.commonService.dtRowSelect(row)
          //********************************************************************************** */


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

    // CHECKING role IS DONE FROM SERVER WHEN BUTTON CLICKED.LOCALSTORAGE IS NOT SAFE
  // IT IS COMPLICATED TO ENABLE/DISABLE BUTTONS OR USING isAdmin variable globally for datatable and detail page
  // ************************************************************************************************************* 
  rowDetailClickHandler(data: any) {
    // this.router.navigate(['/Empdetail/' + data.ID]); //TODO
      this.showEmpMembershipDetailModal(data.ID);
      
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

  // alert(this.isAdmin);
  // this.authService.checkRole(this.childempid, 'Employee Main').subscribe(resp => {
  //   if (resp === null || resp.EditData == 0) { //if table uaccess_control have no record gor this empid it returns null so null is checked
  //     alert("Need permission.");
  //   }
  //   else {
  //     this.showEmpRegEditModal(e);
  //   }
  // },
  //   err => {
  //     alert(err.message);
  //   });


  // this.checkRole();
  // if (this.isAdmin === false) {
  // if (this.user_role === 'guest') {
  // now user_role value is checked in app.component and user_role value is saved in common.services
  
  // if (this.commonService.user_role === 'guest') {
  //   alert("Need permission.");
  // }
  // else {
  //   this.showEmpRegEditModal(e);
  // }

  if (this.commonService.checkEditRole()) {
    this.showEmpMembershipEditModal(e);    }
}

checkAddRole() {
  // if (this.isAdmin === false) {
  // if (this.user_role === 'guest' || this.user_role === 'user') {
  //   if (this.commonService.user_role === 'guest' || this.commonService.user_role === 'user') {
  //   alert("Need permission.");
  // }
  // else {
  //   this.showEmpRegAddModal()
  // }

  if (this.commonService.checkAddRole()) {
    this.showEmpMembershipAddModal()
  }
}

checkDeleteRole(e: any) {
  // if (this.isAdmin === false) {
  // if (this.user_role === 'guest' || this.user_role === 'user') {
  // if (this.commonService.user_role === 'guest' || this.commonService.user_role === 'user') {
  //   alert("Need permission.");
  // }
  // else {
  //   this.deleteEmpReg(e);
  // }
  if (this.commonService.checkDeleteRole()) {
    this.deleteEmpMembership(e);   
   }
}

  // saveEmp common for edit and add. Option to call 2 function from here 
  saveEmpMembership() {

    //   // check internet connection first
    //   var onlineOffline = navigator.onLine;
    //   if (onlineOffline===false) {
    //     alert("no internet connection");
    //     return;
    //   }
    if (this.modalClicked == "editModal") {
      this.updateEmpMembership();
    }
    if (this.modalClicked == "addModal") {
      this.addEmpMembership();
    }
  } 


  clearForm(){
    this.empmembershipFormGroup.controls['id'].setValue(0);
    this.empmembershipFormGroup.controls['empid'].setValue(this.childempid);
    this.empmembershipFormGroup.controls['orgname'].setValue('');
    this.empmembershipFormGroup.controls['affiliationtype'].setValue('');
    this.empmembershipFormGroup.controls['affiliationdate'].setValue('');
    this.empmembershipFormGroup.controls['expirationdate'].setValue('');
    this.empmembershipFormGroup.controls['notes'].setValue('');

  }




  showEmpMembershipAddModal() {

    // if (this.isAdmin == false) {
    //   return;
    // }

    if (!this.commonService.checkAddRole()) {
      return;
    }


    this.modalClicked = "addModal"
    $('#btnEmpMembershipModalShow').click();

    // //Get the maxid
    // //***************************** */
    // let maxid = 0;
    // this.empRegService.getMaxEmpRegID().subscribe(resp => {

    //   maxid = resp[0].maxempregid;

    //**employeeFormGroup control within the subscribe so tha values are set after maxid is retrieved from database  */
    // clear form group since same group is used for edit and add
    // Now formgroup is used instead of data object to pass value
    this.empmembershipFormGroup.reset(); // to clear the previous validations
    // Manualy set default values since reset() will will turn values to null: // https://stackoverflow.com/questions/51448764/why-are-formgroup-controls-null-after-formgroup-reset
    // this.employeeFormGroup.controls['empid'].setValue(0);

    // this.empRegFormGroup.controls['id'].setValue(maxid + 1);
    this.empmembershipFormGroup.controls['id'].setValue(0);
    this.empmembershipFormGroup.controls['empid'].setValue(this.childempid);
    this.empmembershipFormGroup.controls['orgname'].setValue('');
    this.empmembershipFormGroup.controls['affiliationtype'].setValue('');
    this.empmembershipFormGroup.controls['affiliationdate'].setValue('');
    this.empmembershipFormGroup.controls['expirationdate'].setValue('');
    this.empmembershipFormGroup.controls['notes'].setValue('');

    this.loading2 = false;

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



  showEmpMembershipEditModal(e: any) {

    this.clearForm(); //clear the form of previous edit data
    this.modalClicked = "editModal"
    $('#btnEmpMembershipModalShow').click(); 

    this.loading2 = true;

    this.empMembershipService.getEmpMembership(e).subscribe(resp => {

      //this.editData = resp; //use .data after resp for post method. Now using FormFroup to put data
      // **FormFroup and FormControl is used to pass value to edit form instead of [(ngModel)]
      // this.empid=resp.empid; // to pass to child modal if used

      // this.empid = resp.EmpID; // to pass to child modal if used

      // this.empRegFormGroup.patchValue(resp); 
      // OR

      this.empmembershipFormGroup.controls['id'].setValue(resp.ID);
      this.empmembershipFormGroup.controls['empid'].setValue(resp.EmpID);
      this.empmembershipFormGroup.controls['orgname'].setValue(resp.OrgName);
      this.empmembershipFormGroup.controls['affiliationtype'].setValue(resp.AffiliationType);
      // this.empmembershipFormGroup.controls['affiliationdate'].setValue(resp.AffiliationDate);
      // this.empmembershipFormGroup.controls['expirationdate'].setValue(resp.ExpirationDate);
      this.empmembershipFormGroup.controls['affiliationdate'].setValue(this.datePipe.transform(resp.AffiliationDate, "yyyy-MM-dd"));
      this.empmembershipFormGroup.controls['expirationdate'].setValue(this.datePipe.transform(resp.ExpirationDate, "yyyy-MM-dd"));

      this.empmembershipFormGroup.controls['notes'].setValue(resp.Notes);


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






  showEmpMembershipDetailModal(e: any) {
    
    // this.clearForm(); //clear the form of previous edit data
    // this.modalClicked="editModal"
    this.loading2 = true;
    $('#empmembershipdetailmodalShow').click();

    this.empMembershipService.getEmpMembershipDetail(e).subscribe(resp => {

      //this.editData = resp; //use .data after resp for post method. Now using FormFroup to put data
      // **FormFroup and FormControl is used to pass value to edit form instead of [(ngModel)]
      // this.empid=resp.empid; // to pass to child modal if used

      // this.empid = resp.EmpID; // to pass to child modal if used
      this.empmembership = resp;


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



  }




    addEmpMembership() {

      // this is for extra protection. User access is controlled in checkRole(). But sometimes the edit btns
      // in the dttable are late to refresh and user may access other users role by clicking on btns. So extra control is used.
      // if (this.isAdmin==false) {
      //   alert("You need permiddion to edit this form");
      //   return;
      // }
  
        this.loading2 = true;
        
      // *** 2023 Note If date is cleared the it always has a value of '' which tries to save 0000-00-00 00:00:00 in mysql server resulting err;
      // 2023 SO handle it in front end and save null when value is '' dont have to do antthing in backend
      if (this.empmembershipFormGroup.controls['affiliationdate'].value === '') {//0000-00-00 00:00:00
        this.empmembershipFormGroup.controls['affiliationdate'].setValue(null);
      }
      if (this.empmembershipFormGroup.controls['expirationdate'].value === '') {//0000-00-00 00:00:00
        this.empmembershipFormGroup.controls['expirationdate'].setValue(null);
      }
  
  
      // DATE COMPARE CHECK
      //************************************* */
      let regissuedate: any = this.empmembershipFormGroup.controls['affiliationdate'].value;
      let regexpdate: any = this.empmembershipFormGroup.controls['expirationdate'].value;
      if (regissuedate > regexpdate) {
        this.loading2 = false;
        alert("Expiry date must be greater than Issue date.");
        return;
      }
  
  
        this.empMembershipService.addEmpMembership(this.empmembershipFormGroup.value).subscribe(resp => {
          // $("#empeditmodal").modal("hide");
          $("#btnEmpMembershipEditCloseModal").click();
          // this.refreshEmployeeDatatable();
          this.loading2 = false;
          // this.refreshEmpDetail.next('somePhone'); //calling  loadEmpDetail() from parent component
          // this.router.navigateByUrl('Employee') //navigate to AngularDatatable
          //this.router.navigateByUrl('Empdetail/2') //navigate to AngularDatatable
          // var a= this.getMaxId();
          // this.router.navigateByUrl('Empdetail/' + a) //navigate to AngularDatatable // not working
    
          this.refreshDatatableEmpMembership ();
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
    
    
    
    
      updateEmpMembership() {
     
      // this is for extra protection. User access is controlled in checkRole(). But sometimes the edit btns
      // in the dttable are late to refresh and user may access other users role by clicking on btns. So extra control is used.
      // if (this.isAdmin==false) {
      //     alert("You need permiddion to edit this form");
      //     return;
      //   }
    
            // **FormFroup and FormControl is used to pass value to save form instead of [(ngModel)]
            this.loading2=true;
    
            if (this.empmembershipFormGroup.invalid) {
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
            
            if (this.empmembershipFormGroup.controls['affiliationdate'].value === '') {//0000-00-00 00:00:00
              this.empmembershipFormGroup.controls['affiliationdate'].setValue(null);
            }
            if (this.empmembershipFormGroup.controls['expirationdate'].value === '') {//0000-00-00 00:00:00
              this.empmembershipFormGroup.controls['expirationdate'].setValue(null);
            }
  
  
            // DATE COMPARE CHECK
            //************************************* */
            let regissuedate: any = this.empmembershipFormGroup.controls['affiliationdate'].value;
            let regexpdate: any = this.empmembershipFormGroup.controls['expirationdate'].value;
            if (regissuedate > regexpdate) {
              this.loading2 = false;
              alert("Expiry date must be greater than Issue date.");
              return;
            }

  
            
            
            this.empMembershipService.updateEmpMembership(this.empmembershipFormGroup.value).subscribe(resp => {
              
              // $("#empeditmodal").modal("hide");
              $("#btnEmpMembershipEditCloseModal").click();
              // this.refreshEmployeeDatatable();
              // this.refreshEmpDetail.next('somePhone'); //calling  loadEmpDetail() from parent component
              this.refreshDatatableEmpMembership();
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
    
    
  
    deleteEmpMembership(empmembershipid: any) {
  
      // this is for extra protection. User access is controlled in checkRole(). But sometimes the edit btns
      // in the dttable are late to refresh and user may access other users role by clicking on btns. So extra control is used.
      // if (this.isAdmin==false) {
      //   alert("You need permiddion to edit this form");
      //   return;
      // }
  
      if (confirm('Are you sure you want to delete this record?')) {
        // Delete it!
      } else {
        // Do nothing!
        return;
      }
  
      this.empMembershipService.deleteEmpMembership(empmembershipid).subscribe(resp => {
        // $("#empeditmodal").modal("hide");
        // this.refreshEmployeeDatatable();
        // this.router.navigateByUrl('Employee') //navigate to AngularDatatable
        this.refreshDatatableEmpMembership();  // to refresh datatable after delete
  
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
