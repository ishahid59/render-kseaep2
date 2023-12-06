// import { Component } from '@angular/core';

import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../services/common.service';
import { AuthService } from '../services/auth.service';
// import { ProjectService } from '../../services/project/project.service';
// import { ProteamService } from '../../services/project/proteam.service';
import { DatePipe, Location } from '@angular/common';// datepipe used to convert date format to show in html date element
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, forkJoin, of } from 'rxjs';
// import { ProjectSearchService } from '../../services/project/project-search.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})


export class UserComponent {
  constructor(private http: HttpClient, private authService: AuthService, public datePipe: DatePipe, private router: Router, public activatedRoute: ActivatedRoute, private commonService: CommonService) {
  }


  // @Input() childempid:any;
  @Input() childprojectid: any;



  // dtOptions: DataTables.Settings = {};
  dtOptions: any = {}; // any is used instead of DataTables.Settings else datatable export buttons wont show

  // To refresh datatable with search parameters without using destroy
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective; //used "!" to avoid initialization of variable. Also can use strict:false in tsconfig.json

  userData: any = []; // in angular should ([]) for array
  user: any = {};
  formErrors: any = [{}];
  loading2: boolean = false;
  componentLoaded = false;
  modalClicked = "editModal";

  changePasswordClicked:boolean=false;

  //ANGULAR FORMGROUP is used to pass Value to frm control without jquery and better error handling
  //ANGULAR VALIDATORS  https://angular.io/api/forms/Validators
  //*************************************************************************** */
  userFormGroup = new FormGroup({
    // id: new FormControl(0),
    // empprojectrole: new FormControl(0, [Validators.required, Validators.min(1)]),
    // secprojectrole: new FormControl(0),
    // dutiesandresponsibilities: new FormControl(''),
    // durationfrom: new FormControl(''),
    // durationto: new FormControl(''),
    // monthsofexp: new FormControl(''),
    // notes: new FormControl(''),
    // projectid: new FormControl(0),
    // empid: new FormControl(0,[Validators.required, Validators.min(1)]),

    id: new FormControl(0),
    email: new FormControl('',[Validators.required]),
    name: new FormControl('',[Validators.required]),
    password: new FormControl('',[Validators.required]),
    remember_token: new FormControl(''),
    created_at: new FormControl(''),
    updated_at: new FormControl(''),
  });



  // set the getters for validation fields. convenient to use in html for validation
  get email() {
    return this.userFormGroup.get('email');
  }
  get name() {
    return this.userFormGroup.get('name');
  }
  get password() {
    return this.userFormGroup.get('password');
  }
  // get country() {
  //   return this.empDegreeFormGroup.get('country');
  // }


  ngOnInit() {
    // this.loadDatatableProTeam();

    // ngOnInit is called only once. So for all next calls Observable is used so that it can always listen
    // https://www.youtube.com/watch?v=b4zpvh_saic&list=PL1BztTYDF-QNrtkvjkT6Wjc8es7QB4Gty&index=65
    if (!this.componentLoaded) {
      // 2023 now calling from tab clicked
      this.loadDatatableProTeam(); //loadDatatableProTeam() has to be called for first time only. Then refreshDatatableEmpDegree() is called everytime
      this.componentLoaded = false;
    }
    // // following observer code moved from ngOnInit() to ngAfterViewInit() since datatable instance is not created yet to be refreshed
    // this.activatedRoute.paramMap.subscribe((param) => {
    //   this.childempid = param.get('id')
    //   this.refreshDatatableEmpDegree();// refresh instance of angular-datatable
    // })

  }




  /* to remove "no matching records found" even if angular-datatable is not empty */
  // https://github.com/l-lin/angular-datatables/issues/1260
  ngAfterViewInit(): void {
    var that = this;
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.on('draw.dt', function () {
        if (that.userData.length > 0) {
          $('.dataTables_empty').remove();
        }
      });
    });


    // // ngOnInit is called only once. So for all next calls Observable is used so that it can always listen
    // // https://www.youtube.com/watch?v=b4zpvh_saic&list=PL1BztTYDF-QNrtkvjkT6Wjc8es7QB4Gty&index=65
    // // following observer code moved from ngOnInit() to here ngAfterViewInit()
    this.activatedRoute.paramMap.subscribe((param) => {
      this.childprojectid = param.get('id')
      // this.refreshDatatableProTeam();// now calling from Pro-detail// refresh instance of angular-datatable
    })

  }





  // Refresh/reload Angular-Datatable. Following method must be used to reload angular-datatable since ngOnInit() is used to initilize table 
  // https://l-lin.github.io/angular-datatables/#/advanced/custom-range-search
  refreshDatatableUser() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }


  loadDatatableProTeam() {

    var that = this;

    this.dtOptions = {
      pagingType: 'full_numbers',
      processing: true,
      serverSide: true,// server side processing
      searching: true,
      lengthChange: true,
      // lengthMenu: [ 10, 35, 50, 75, 100 ],
      // dom: 'Blfrtip', //'Bfrtip', use l before f to show length with bottons
      // // //"any" is used in "dtOptions" instead of DataTables.Settings else datatable export buttons wont show
      // buttons: [
      //     'lengthChange','copy', 'csv', 'excel', 'pdf', 'print'
      // ],

      ajax: (dataTablesParameters: any, callback: any) => {
        this.http.post<any>(
          // 'http://localhost:5000/api/empdegree/empdegree-angular-datatable/' + 145 + '',
          // 'http://localhost:5000/api/empdegree/empdegree-angular-datatable',
          '' + that.commonService.baseUrl + '/api/users/user-angular-datatable',
          Object.assign(dataTablesParameters,
            {
              // token: '',
              // projectid: this.childprojectid,//this.id, 
            }),
          {
            // ** Header is now coming from Auth.Inceptor file
            // headers: {
            // Authorization: "Bearer " + localStorage.getItem("token"),
            // Accept: "application/json" //the token is a variable which holds the token
            // }
          },
        ).subscribe(resp => {
          this.userData = resp.data; //use .data after resp for post method
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            // data: []
            // //https://stackoverflow.com/questions/57849250/angular-datatables-server-side-processing-and-buttons-extension-data-is-empty
            data: resp.data  // set data
          });
          // this.fillAllCmb();
        });
      },

      columnDefs: [
        // {
        // "orderable": true,
        // "targets": '_all',
        // },
        {
          "targets": 4, // center action column
          "className": "text-center",
          "orderable": false,
          // "width": "4%"
        },
      ],

      id: new FormControl(0),
      email: new FormControl(''),
      name: new FormControl(''),
      password: new FormControl(''),
      remember_token: new FormControl(''),
      created_at: new FormControl(''),
      updated_at: new FormControl(''),

      columns: [

        // { data: '', title: "id" }, 
        { data: 'email', title: "Email", width: "150px" },
        { data: 'name', title: "Name", width: "150px" },
        // { data: 'password', title: "Password", width: "50px" },
        // { data: 'remember_token', title: "remember_token", width: "150px" },        
        // {
        //   data: "password", "mRender": function (data: any, type: any, row: any) {
        //     if (data.length > 60) {
        //       var trimmedString = data.substring(0, 60);
        //       return trimmedString + '...';
        //     } else {
        //       return data;
        //     }
        //   }, width: "550px" 
        // },

        // {
        //   data: "remember_token", "mRender": function (data: any, type: any, row: any) {
        //     if (data.length > 60) {
        //       var trimmedString = data.substring(0, 60);
        //       return trimmedString + '...';
        //     } else {
        //       return data;
        //     }
        //   }, width: "550px" 
        // },




        // { data: 'created_at', title: "created_at", width: "90px" },
        // { data: 'updated_at', title: "updated_at", width: "90px" },
        {
          render: (data: any, type: any, row: any) => {
            return this.datePipe.transform(row.created_at, "MM/dd/yyyy");
          }, title: 'created_at', width: "50px" 
        },
        { 
          render: (data: any, type: any, row: any) => {
            return this.datePipe.transform(row.updated_at, "MM/dd/yyyy");
          }, title: 'updated_at', width: "50px" 
        },  
        {
          render: (data: any, type: any, row: any) => {
            return "<a class='btn-detail' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Detail</a> | <a class='btn-edit' data-toggle='modal' data-target='#empeditmodal' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Edit</a> | <a class='btn-delete' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Delete</a>";
          }, title: '&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp; &nbsp;Action&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp; &nbsp;'
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
        // const eltdetail = $('td', row).find('a.btn-detail');
        // if (eltdetail) {
        //   eltdetail.unbind('click');
        //   eltdetail.bind('click', () => {
        //     this.rowDetailClickHandler(data);
        //   });
        // }
        const eltdetail = $('td', row).find('a.btn-detail');
        if (eltdetail) {
          eltdetail.unbind('click');
          eltdetail.bind('click', () => {
            this.rowChangePasswordClickHandler(data);
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




  // Action column handlers connecting to angular methods directly from within jquatu table
  rowFirstNameClickHandler(data:any) {
    // this.router.navigate(['/Empdetail/' + data.EmpID]);
  }

  // rowDetailClickHandler(data: any) {
  //   // alert("Detail Handler: "+data.firstname+"");
  //   // this.router.navigate(['/Empdetail/' + data.ID]); //TODO
  //   this.showUserDetailModal(data.id);
  // }

   rowChangePasswordClickHandler(data: any) {
    // alert("Detail Handler: "+data.firstname+"");
    // this.router.navigate(['/Empdetail/' + data.ID]); //TODO
    this.changePasswordClicked=true
    this.showUserEditModal(data.id);
  }


  rowEditClickHandler(data: any) {
    // alert("Edit Handler: "+data.firstname+"");
    // this.showUserEditModal(data.ID) // for edit pass only data instead of data.empid
    this.showUserEditModal(data.id) // for edit pass only data instead of data.empid
  }


  rowDeleteClickHandler(data: any) {
    // alert("Delete Handler: "+data.firstname+"");
    // this.deleteUser(data.ID);
    this.deleteUser(data.id);
  }





  clearForm(){
    this.userFormGroup.controls['id'].setValue(0);
    this.userFormGroup.controls['email'].setValue('');
    this.userFormGroup.controls['name'].setValue('');
    this.userFormGroup.controls['password'].setValue('');
    this.userFormGroup.controls['remember_token'].setValue('');
    this.userFormGroup.controls['created_at'].setValue('');
    this.userFormGroup.controls['updated_at'].setValue(null);

  }
  clearSearch(){
    this.clearForm();
  }

  showUserAddModal() {

    // alert("addModal");
    this.modalClicked = "addModal";
    // $('#btnProTeamEditModalShow').click(); 

    // alert(this.childempid);
    //Get the maxid
    //***************************** */

    let maxid = 0;
    this.authService.getMaxUserID().subscribe(resp => {

      maxid = resp[0].maxuserid;

      // alert(maxid);

      //**employeeFormGroup control within the subscribe so tha values are set after maxid is retrieved from database  */
      // clear form group since same group is used for edit and add
      // Now formgroup is used instead of data object to pass value
      this.userFormGroup.reset(); // to clear the previous validations
      // Manualy set default values since reset() will will turn values to null: // https://stackoverflow.com/questions/51448764/why-are-formgroup-controls-null-after-formgroup-reset
      // this.employeeFormGroup.controls['empid'].setValue(0);

      this.userFormGroup.controls['id'].setValue(0);
      this.userFormGroup.controls['email'].setValue('');
      this.userFormGroup.controls['name'].setValue('');
      this.userFormGroup.controls['password'].setValue('');
      this.userFormGroup.controls['remember_token'].setValue('');
      this.userFormGroup.controls['created_at'].setValue('');
      this.userFormGroup.controls['updated_at'].setValue(null);
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


  showUserEditModal(e:any) {

    this.clearForm(); //clear the form of previous edit data
    // this.clearFormErrors();
    this.modalClicked="editModal"
    this.loading2=true;

    $('#btnUserEditModalShow').click(); 
  
    this.authService.getUser(e).subscribe(resp => {

      //this.editData = resp; //use .data after resp for post method. Now using FormFroup to put data
      // **FormFroup and FormControl is used to pass value to edit form instead of [(ngModel)]
      // this.empid=resp.empid; // to pass to child modal if used

      // this.empid = resp.EmpID; // to pass to child modal if used
     
      // this.empDegreeFormGroup.patchValue(resp); 
      // OR
// alert(resp.email);
      this.userFormGroup.controls['id'].setValue(resp.id);
      this.userFormGroup.controls['email'].setValue(resp.email);
      this.userFormGroup.controls['name'].setValue(resp.name);
      this.userFormGroup.controls['password'].setValue(resp.password);
      if (this.changePasswordClicked) {
        this.userFormGroup.controls['password'].setValue('');
      }
      this.userFormGroup.controls['remember_token'].setValue(resp.remember_token);
      this.userFormGroup.controls['created_at'].setValue(resp.created_at);
      this.userFormGroup.controls['updated_at'].setValue(resp.updated_at);

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




  // saveEmp common for edit and add. Option to call 2 function from here 
  saveUser() {

    //   // check internet connection first
    //   var onlineOffline = navigator.onLine;
    //   if (onlineOffline===false) {
    //     alert("no internet connection");
    //     return;
    //   }
    if (this.modalClicked == "editModal") {
      this.updateUser();
    }
    if (this.modalClicked == "addModal") {
      this.addUser();
    }
  }




  addUser() {

    this.loading2 = true;

    // // *** 2023 Note If date is cleared the it always has a value of '' which tries to save 0000-00-00 00:00:00 in mysql server resulting err;
    // // 2023 SO handle it in front end and save null when value is '' dont have to do antthing in backend
    // if (this.proTeamFormGroup.controls['durationfrom'].value === '') {//0000-00-00 00:00:00
    //   this.proTeamFormGroup.controls['durationfrom'].setValue(null);
    // }
    // if (this.proTeamFormGroup.controls['durationto'].value === '') {//0000-00-00 00:00:00
    //   this.proTeamFormGroup.controls['durationto'].setValue(null);
    // }

    this.authService.addUser(this.userFormGroup.value).subscribe(resp => {
      // $("#empeditmodal").modal("hide");
      $("#btnUserEditCloseModal").click();
      // this.refreshEmployeeDatatable();
      this.loading2 = false;
     
      // this.refreshEmpDetail.next('somePhone'); //calling  loadEmpDetail() from parent component
      // this.router.navigateByUrl('Employee') //navigate to AngularDatatable
      //this.router.navigateByUrl('Empdetail/2') //navigate to AngularDatatable
      // var a= this.getMaxId();
      // this.router.navigateByUrl('Empdetail/' + a) //navigate to AngularDatatable // not working

      this.refreshDatatableUser();
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
  
  
  
  
  updateUser() {

    // **FormFroup and FormControl is used to pass value to save form instead of [(ngModel)]
    this.loading2 = true;

    if (this.userFormGroup.invalid) {
      this.loading2 = false;
      return;
    }

    // Handle date. If cleared in html the datepicker returns empty string "" and saves as '0000-00-00' in database 
    // which gives error while reading in form . So convert the date to "null" before saving empty string
    // if (this.employeeFormGroup.controls['hiredate'].value === '') {
    //   this.employeeFormGroup.controls['hiredate'].setValue(null);
    // }

    // // *** 2023 Note If date is cleared the it always has a value of '' which tries to save 0000-00-00 00:00:00 in mysql server resulting err;
    // // 2023 SO handle it in front end and save null when value is '' dont have to do antthing in backend
    // if (this.proTeamFormGroup.controls['durationfrom'].value === '') {//0000-00-00 00:00:00
    //   this.proTeamFormGroup.controls['durationfrom'].setValue(null);
    // }
    // if (this.proTeamFormGroup.controls['durationto'].value === '') {//0000-00-00 00:00:00
    //   this.proTeamFormGroup.controls['durationto'].setValue(null);
    // }


    this.authService.updateUser(this.userFormGroup.value).subscribe(resp => {

      // $("#empeditmodal").modal("hide");
      $("#btnUserEditCloseModal").click();
      // this.refreshEmployeeDatatable();
      // this.refreshEmpDetail.next('somePhone'); //calling  loadEmpDetail() from parent component
      this.refreshDatatableUser();
      this.loading2 = false;
      this.changePasswordClicked=false;
   
    },
      err => {
        // console.log(error.error.errors[0].param); //working
        // console.log(error.error.errors[0].msg); //working
        this.loading2 = false;
        this.changePasswordClicked=false;

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




  updateUserPassword() {

    // **FormFroup and FormControl is used to pass value to save form instead of [(ngModel)]
    this.loading2 = true;

    if (this.userFormGroup.invalid) {
      this.loading2 = false;
      return;
    }
    this.authService.updateUserPassword(this.userFormGroup.value).subscribe(resp => {

      // $("#empeditmodal").modal("hide");
      $("#btnUserEditCloseModal").click();
      this.refreshDatatableUser();
      this.loading2 = false;
      this.changePasswordClicked=false;
    },
      err => {
        this.loading2 = false;
        this.changePasswordClicked=false;

        // Form backend Validation errors
        if (err.status === 422 || err.status === 400) {
          this.formErrors = err.error.errors;// alert(err.error.errors[0].msg);
        }
        else {
          alert(err.message);
        }

      });
  }




  deleteUser(userid: any) {
    alert(userid);
    if (confirm('Are you sure you want to delete this record?')) {
      // Delete it!
    } else {
      // Do nothing!
      return;
    }
     
    this.authService.deleteUser(userid).subscribe(resp => {
      // $("#empeditmodal").modal("hide");
      // this.refreshEmployeeDatatable();
      // this.router.navigateByUrl('Employee') //navigate to AngularDatatable
      this.refreshDatatableUser();  // to refresh datatable after delete

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
