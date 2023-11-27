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


@Component({
  selector: 'app-emp-reg',
  templateUrl: './emp-reg.component.html',
  styleUrls: ['./emp-reg.component.css']
})
export class EmpRegComponent {

  constructor(private http: HttpClient, private empService: EmployeeService,private empRegService: EmpregService, public datePipe: DatePipe, private router: Router,public activatedRoute: ActivatedRoute,private commonService: CommonService) {
  }



  @Input() childempid:any;

  // dtOptions: DataTables.Settings = {};
   dtOptions: any = {}; // any is used instead of DataTables.Settings else datatable export buttons wont show

   // To refresh datatable with search parameters without using destroy
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective; //used "!" to avoid initialization of variable. Also can use strict:false in tsconfig.json

  empRegData: any = []; // in angular should ([]) for array
  formErrors: any = [{}];
  loading2: boolean = false;
  componentLoaded = false;

  modalClicked="editModal";
 

  // cmbEmpReg: any = ([]);
  // cmbState: any = ([]);
  // cmbCountry: any = ([]);


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
      this.loadDatatableEmpDegree(); //loadDatatableEmpDegree() has to be called for first time only. Then refreshDatatableEmpDegree() is called everytime
      this.componentLoaded = false;
    }


    // // following observer code moved from ngOnInit() to ngAfterViewInit() since datatable instance is not created yet to be refreshed
      // this.activatedRoute.paramMap.subscribe((param) => {
      //   this.childempid = param.get('id')
      //   this.refreshDatatableEmpDegree();// refresh instance of angular-datatable
      // })

      //this.fillAllCmb(); // 2023  moved to datatable so that so that cmd can be loaded after dttable data
      // this.fillCmbEmpDegree();
      // this.fillCmbState();
      // this.fillCmbCountry();

  }



// tab clicked in emp detail
regtabClicked(){
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

  }


  // Refresh/reload Angular-Datatable. Following method must be used to reload angular-datatable since ngOnInit() is used to initilize table 
  // https://l-lin.github.io/angular-datatables/#/advanced/custom-range-search
  refreshDatatableEmpReg() {
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
                data: "disRegistration",
                // "render": function (data, type, row) {
                // return (
                //     "<a onclick=$('#reghiddenid').val("+row.ID +"); id='empregview' style='cursor:pointer'>"+ data +"</a>"
                //     );
                //    }
              },
              { data: "disRegState", "defaultContent": "",},
              { data: "disCountry", "defaultContent": "",},
              { data: "RegistrationNo" ,},
              { data: "RegYear", },
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
                }, title: 'Issue Date', width: "50px" 
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
                }, title: 'Expiry Date', width: "50px" 
              },  
              // { data: "EmpID", "visible": false },
              {
                render: (data: any, type: any, row: any) => {
                  return "<a class='btn-detail' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Detail</a> ";
                }, title: 'Action', width: '80px',class:'dt-center'
              },


            ] // end columns


    };
  }




  showEmpRegAddModal() {

//     // alert("addModal");
//     this.modalClicked = "addModal"




// // alert(this.childempid);
//     //Get the maxid
//     //***************************** */
//     let maxid = 0;
//     this.empDegreeService.getMaxEmpDegreeID().subscribe(resp => {
      
//       maxid = resp[0].maxempdegreeid;

//       // alert(maxid);

//       //**employeeFormGroup control within the subscribe so tha values are set after maxid is retrieved from database  */
//       // clear form group since same group is used for edit and add
//       // Now formgroup is used instead of data object to pass value
//       this.empDegreeFormGroup.reset(); // to clear the previous validations
//       // Manualy set default values since reset() will will turn values to null: // https://stackoverflow.com/questions/51448764/why-are-formgroup-controls-null-after-formgroup-reset
//       // this.employeeFormGroup.controls['empid'].setValue(0);

//       this.empDegreeFormGroup.controls['id'].setValue(maxid + 1);
//       this.empDegreeFormGroup.controls['empid'].setValue(this.childempid);
//       this.empDegreeFormGroup.controls['degree'].setValue(0);
//       this.empDegreeFormGroup.controls['degreefield'].setValue('');
//       this.empDegreeFormGroup.controls['institution'].setValue('');
//       this.empDegreeFormGroup.controls['degstate'].setValue(0);
//       this.empDegreeFormGroup.controls['country'].setValue(0);
//       this.empDegreeFormGroup.controls['yeardegreeearned'].setValue('');
//       this.empDegreeFormGroup.controls['notes'].setValue('');
//     },

//       err => {
//         // For Validation errors
//         if (err.status === 422 || err.status === 400) {
//           // alert(err.error.errors[0].msg);
//           this.formErrors = err.error.errors;
//         }
//         else {
//           alert(err.message);
//         }
//       });

    }


    // Fill all combos in one function using forkJoin of rxjx
    fillAllCmb() {
      // forkJoin([
      //   this.empDegreeService.getCmbEmpDegree(), //observable 1
      //   this.empDegreeService.getCmbState(), //observable 2
      //   this.empDegreeService.getCmbCountry() //observable 2
      // ]).subscribe(([cmbEmpDegreeDegree, cmbEmpState, cmbEmpCountry]) => {
      //   // When Both are done loading do something
      //   this.cmbEmpDegree = cmbEmpDegreeDegree;
      //   this.cmbState = cmbEmpState;
      //   this.cmbCountry = cmbEmpCountry;
      // }, err => {
      //   alert(err.message);
      //   // alert("Problem filling Employee combos");
      // });
      // // if (!this.errors) {
      // //   //route to new page
      // // }
    }



}
