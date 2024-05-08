// import { Component } from '@angular/core';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../../services/common.service';
import { EmployeeService } from '../../services/employee/employee.service';
// import { EmpregService } from '../../services/employee/empreg.service';
import { EmpexpsummaryService } from '../../services/employee/empexpsummary.service';

import { DatePipe } from '@angular/common';// datepipe used to convert date format to show in html date element
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, forkJoin, of } from 'rxjs';
import { EmployeeSearchService } from '../../services/employee/employee-search.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-emp-expsummary',
  templateUrl: './emp-expsummary.component.html',
  styleUrls: ['./emp-expsummary.component.css']
})
export class EmpExpsummaryComponent {


  constructor(private http: HttpClient, private authService: AuthService, private empSearchService: EmployeeSearchService, private empService: EmployeeService,private empExpsummaryService: EmpexpsummaryService, public datePipe: DatePipe, private router: Router,public activatedRoute: ActivatedRoute,private commonService: CommonService) {
  }



  @Input() childempid:any;



  // dtOptions: DataTables.Settings = {};
  dtOptions: any = {}; // any is used instead of DataTables.Settings else datatable export buttons wont show

  // To refresh datatable with search parameters without using destroy
 @ViewChild(DataTableDirective, { static: false })
 datatableElement!: DataTableDirective; //used "!" to avoid initialization of variable. Also can use strict:false in tsconfig.json

 empExpSummaryData: any = []; // in angular should ([]) for array
 empexpsummary:any={};
 formErrors: any = [{}];
 loading2: boolean = false;
 componentLoaded = false;

 modalClicked="editModal";

 count:any=0; //test

 isAdmin:boolean=false;

 cmbEmpExpItem: any = ([]);


 empExpSummaryFormGroup = new FormGroup({
  id: new FormControl(0),
  itemname: new FormControl(0, [Validators.required, Validators.min(1)]),
  description: new FormControl(''),
  descriptionplaintext: new FormControl(''),
  notes: new FormControl(''),
  empid: new FormControl(0),
});

// ID  
// ItemName  
// Description
// DescriptionPlainText
// Notes
// ProjectID


// set the getters for validation fields. convenient to use in html for validation
get itemname() {
  return this.empExpSummaryFormGroup.get('itemname');
}






  ngOnInit() {

    // this.loadDatatableEmpDegree();

    // ngOnInit is called only once. So for all next calls Observable is used so that it can always listen
    // https://www.youtube.com/watch?v=b4zpvh_saic&list=PL1BztTYDF-QNrtkvjkT6Wjc8es7QB4Gty&index=65
    if (!this.componentLoaded) {
      this.loadDatatableempExpSummary(); //loadDatatableempReg() has to be called for first time only. Then refreshDatatableempReg() is called everytime
      // this.componentLoaded = false;
      this.componentLoaded = true;//2023 to avoid duplicate datatable on load


    }
  }



// tab clicked in emp detail
expsummarytabClicked(){
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
        if (that.empExpSummaryData.length > 0) {
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
      this.refreshDatatableEmpExpSummary();// refresh instance of angular-datatable
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
  refreshDatatableEmpExpSummary() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });

  }



  loadDatatableempExpSummary() {

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
          '' + that.commonService.baseUrl + '/api/empexpsummary/empexpsummary-angular-datatable',
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
          this.empExpSummaryData = resp.data; //use .data after resp for post method
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            // data: []
            // //https://stackoverflow.com/questions/57849250/angular-datatables-server-side-processing-and-buttons-extension-data-is-empty
            data:  resp.data  // set data
          });
          this.fillAllCmb(); // 2023  moved here in datatable so that so that cmd can be loaded after dttable data


          // 2024 For disabling btns if no permission
          // ***************************************************************************************** */
          // if (!this.commonService.checkEditRoleButton()) {
          //   $(".btn-edit").css({"pointer-events":"none","color":"rgb(155, 155, 155)"});
          // }
          // if (!this.commonService.checkDeleteRoleButton()) {
          //   $(".btn-delete").css({"pointer-events":"none","color":"rgb(155, 155, 155)"});
          // }
          // if (!this.commonService.checkAddRoleButton()) {
          //   $("#empexpsummaryaddbtn").css({"pointer-events":"none","color":"rgb(155, 155, 155)"});
          // }

          this.commonService.setButtonStatus();
          
        });
      },
      "columnDefs": [ {
        "targets": 2,
        "orderable": false
        } ],
        // ID
        // ItemName
        // Description
        // DescriptionPlainText
        // Notes
        // EmpID
            "columns": [
              // { data: "ID", "visible": false },
              { data: "disItemName", width:'100px' },
              // { data: "DescriptionPlainText", width:'300px'  },
              {
                data: "DescriptionPlainText", "mRender": function (data: any, type: any, row: any) {
                  if (data.length > 100) {
                    var trimmedString = data.substring(0, 100);
                    return trimmedString + '...';
                  } else {
                    return data;
                  }
                }, 
              
              }, 
              // { data: "Description", width:'100px' },
              // { data: "Notes", width:'100px' },
              // { "data": "EmpID" },

                {
                render: (data: any, type: any, row: any) => {
                   return "<a class='btn-detail' id='emptraining-btn-detail' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Detail</a> | <a class='btn-edit' id='emptraining-btn-edit'  style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Edit</a> | <a class='btn-delete' id='emptraining-btn-delete' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Delete</a>";
                },  "className": "dt-center", //title: 'Action',width:'250px'
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
        // setTimeout(()=>{
        //   let itemColumn:any = document.querySelector('#prodesc-item');
        //   itemColumn.setAttribute('style', 'width: 20% !important;');
        //   let actionColumn:any = document.querySelector('#prodesc-action');
        //   actionColumn.setAttribute('style', 'width: 14% !important;');
        // }, 200)


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
    this.showEmpExpSummaryDetailModal(data.ID);
  }
  rowEditClickHandler(data: any) {
    // this.showEmpExpSummaryEditModal(data.ID);
    this.checkEditRole(data.ID);
  }
  rowDeleteClickHandler(data: any) {
    // this.deleteEmpExpSummary(data.ID);
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
    this.showEmpExpSummaryEditModal(e); 
  }
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
    this.showEmpExpSummaryAddModal()
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
    this.deleteEmpExpSummary(e);   
   }
}



  // saveEmp common for edit and add. Option to call 2 function from here 
  saveEmpExpSummary() {

    //   // check internet connection first
    //   var onlineOffline = navigator.onLine;
    //   if (onlineOffline===false) {
    //     alert("no internet connection");
    //     return;
    //   }
    if (this.modalClicked == "editModal") {
      this.updateEmpExpSummary();
    }
    if (this.modalClicked == "addModal") {
      this.addEmpExpSummary();
    }
  }


  clearForm(){

    this.empExpSummaryFormGroup.controls['id'].setValue(0);
    this.empExpSummaryFormGroup.controls['empid'].setValue(this.childempid);
    this.empExpSummaryFormGroup.controls['itemname'].setValue(0);
    this.empExpSummaryFormGroup.controls['description'].setValue('');
    this.empExpSummaryFormGroup.controls['descriptionplaintext'].setValue('');
    this.empExpSummaryFormGroup.controls['notes'].setValue('');
  }












  showEmpExpSummaryAddModal() {

    // if (this.isAdmin == false) {
    //   return;
    // }

    if (!this.commonService.checkAddRole()) {
      return;
    }


    this.modalClicked = "addModal"
    $('#btnempExpsummaryEditModalShow').click();
    $("#itemnameempexpsummary").prop("disabled", false); 


    // //Get the maxid
    // //***************************** */
    // let maxid = 0;
    // this.empRegService.getMaxEmpRegID().subscribe(resp => {

    //   maxid = resp[0].maxempregid;

    //**employeeFormGroup control within the subscribe so tha values are set after maxid is retrieved from database  */
    // clear form group since same group is used for edit and add
    // Now formgroup is used instead of data object to pass value
    this.empExpSummaryFormGroup.reset(); // to clear the previous validations
    // Manualy set default values since reset() will will turn values to null: // https://stackoverflow.com/questions/51448764/why-are-formgroup-controls-null-after-formgroup-reset
    // this.employeeFormGroup.controls['empid'].setValue(0);

    // this.empRegFormGroup.controls['id'].setValue(maxid + 1);
    this.empExpSummaryFormGroup.controls['id'].setValue(0);

    this.empExpSummaryFormGroup.controls['empid'].setValue(this.childempid);
    this.empExpSummaryFormGroup.controls['itemname'].setValue(0);
    this.empExpSummaryFormGroup.controls['description'].setValue('');
    this.empExpSummaryFormGroup.controls['descriptionplaintext'].setValue('');
    this.empExpSummaryFormGroup.controls['notes'].setValue('');

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



  showEmpExpSummaryEditModal(e: any) {

    this.clearForm(); //clear the form of previous edit data
    this.modalClicked = "editModal"
    $('#btnempExpsummaryEditModalShow').click(); 
    $("#itemnameempexpsummary").prop("disabled", true); 

    this.loading2 = true;

    this.empExpsummaryService.getEmpExpSummary(e).subscribe(resp => {

      //this.editData = resp; //use .data after resp for post method. Now using FormFroup to put data
      // **FormFroup and FormControl is used to pass value to edit form instead of [(ngModel)]
      // this.empid=resp.empid; // to pass to child modal if used

      // this.empid = resp.EmpID; // to pass to child modal if used

      // this.empRegFormGroup.patchValue(resp); 
      // OR

      this.empExpSummaryFormGroup.controls['id'].setValue(resp.ID);
      this.empExpSummaryFormGroup.controls['empid'].setValue(resp.EmpID);
      this.empExpSummaryFormGroup.controls['itemname'].setValue(resp.ItemName);
      this.empExpSummaryFormGroup.controls['description'].setValue(resp.Description);
      this.empExpSummaryFormGroup.controls['descriptionplaintext'].setValue(resp.DescriptionPlainText);
      this.empExpSummaryFormGroup.controls['notes'].setValue(resp.Notes);


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






  showEmpExpSummaryDetailModal(e:any){
    

    // this.clearForm(); //clear the form of previous edit data
    // this.modalClicked="editModal"

    this.loading2 = true;
    $('#empexpsummarydetailmodalShow').click(); 
    
    this.empExpsummaryService.getEmpExpSummaryDetail(e).subscribe(resp => {

      //this.editData = resp; //use .data after resp for post method. Now using FormFroup to put data
      // **FormFroup and FormControl is used to pass value to edit form instead of [(ngModel)]
      // this.empid=resp.empid; // to pass to child modal if used
  
      // this.empid = resp.EmpID; // to pass to child modal if used
     this.empexpsummary=resp;
    
    
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




    async addEmpExpSummary() {

      // this is for extra protection. User access is controlled in checkRole(). But sometimes the edit btns
      // in the dttable are late to refresh and user may access other users role by clicking on btns. So extra control is used.
      // if (this.isAdmin==false) {
      //   alert("You need permiddion to edit this form");
      //   return;
      // }
  
        this.loading2 = true;
        

    // Client side DUPLICATE EMPLOYEEID CHECK Using async await (Chaining).To prevent going to next request before 
    // completing this one Note: must use async fuction await keyword and usi .toPromise()
    // https://stackoverflow.com/questions/34104638/how-can-i-chain-http-calls-in-angular-2
    //************************************************************************************************************************* */

    try {
      let itemid: any = this.empExpSummaryFormGroup.controls['itemname'].value;
      let empid: any = this.empExpSummaryFormGroup.controls['empid'].value;
      const resp = await this.empExpsummaryService.getDuplicateItemID(itemid, empid).toPromise();
      this.count = resp[0].itemidcount;
    } catch (error: any) {
      // alert("Error in checking DuplicateEmployeeID" + error.message);
      alert(error.message);
      this.loading2 = false;
      $("#btnEmpExpSummaryEditCloseModal").click();
      throw error;// must throw error instesd of return else the following lines in the calling function will execute
    }

    if (this.count > 0) {
      this.loading2 = false;
      alert("Selected Experience Summary Type exists for this Employee.\nPlease select another Experience Summary Type.");
      return;
    }


  
        this.empExpsummaryService.addEmpExpSummary(this.empExpSummaryFormGroup.value).subscribe(resp => {
          // $("#empeditmodal").modal("hide");
          $("#btnEmpExpSummaryEditCloseModal").click();
          // this.refreshEmployeeDatatable();
          this.loading2 = false;
          // this.refreshEmpDetail.next('somePhone'); //calling  loadEmpDetail() from parent component
          // this.router.navigateByUrl('Employee') //navigate to AngularDatatable
          //this.router.navigateByUrl('Empdetail/2') //navigate to AngularDatatable
          // var a= this.getMaxId();
          // this.router.navigateByUrl('Empdetail/' + a) //navigate to AngularDatatable // not working
    
          this.refreshDatatableEmpExpSummary ();
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
    
    
    
    
      updateEmpExpSummary() {
     
      // this is for extra protection. User access is controlled in checkRole(). But sometimes the edit btns
      // in the dttable are late to refresh and user may access other users role by clicking on btns. So extra control is used.
      // if (this.isAdmin==false) {
      //     alert("You need permiddion to edit this form");
      //     return;
      //   }
    
            // **FormFroup and FormControl is used to pass value to save form instead of [(ngModel)]
            this.loading2=true;
    
            if (this.empExpSummaryFormGroup.invalid) {
              this.loading2=false;
              return;
            }
        
           
            this.empExpsummaryService.updateEmpExpSummary(this.empExpSummaryFormGroup.value).subscribe(resp => {
              
              // $("#empeditmodal").modal("hide");
              $("#btnEmpExpSummaryEditCloseModal").click();
              // this.refreshEmployeeDatatable();
              // this.refreshEmpDetail.next('somePhone'); //calling  loadEmpDetail() from parent component
              this.refreshDatatableEmpExpSummary();
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
    
    
  
    deleteEmpExpSummary(empexpsummaryid: any) {
  
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
  
      this.empExpsummaryService.deleteEmpExpSummary(empexpsummaryid).subscribe(resp => {
        // $("#empeditmodal").modal("hide");
        // this.refreshEmployeeDatatable();
        // this.router.navigateByUrl('Employee') //navigate to AngularDatatable
        this.refreshDatatableEmpExpSummary();  // to refresh datatable after delete
  
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
















    // Fill all combos in one function using forkJoin of rxjx
    fillAllCmb() {
      forkJoin([
        this.empSearchService.getCmbEmpExpItem(), //observable 1
      ]).subscribe(([cmbEmpExpItem]) => {
        // When Both are done loading do something
        this.cmbEmpExpItem = cmbEmpExpItem;

      }, err => {
        alert(err.message);
        // alert("Problem filling Employee combos");
      });
      // if (!this.errors) {
      //   //route to new page
      // }
    }
















}
