// import { Component } from '@angular/core';


import { Component, Input, OnDestroy, OnInit, ViewChild , OnChanges, SimpleChanges} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../services/common.service';
import { AuthService } from '../services/auth.service';
import { DatePipe, Location } from '@angular/common';// datepipe used to convert date format to show in html date element
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, forkJoin, of } from 'rxjs';
import { ListItemsService } from '../services/list-items.service';


@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.css']
})
export class ListItemsComponent {

  constructor(private http: HttpClient, private listItemsService: ListItemsService, private commonService: CommonService,private router: Router ) {
  }


 // dtOptions: DataTables.Settings = {};
 dtOptions: any = {}; // any is used instead of DataTables.Settings else datatable export buttons wont show

  // To refresh datatable with search parameters without using destroy
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective; //used "!" to avoid initialization of variable. Also can use strict:false in tsconfig.json



 listItemsData: any = []; // in angular should ([]) for array
 formErrors: any = [{}];
 loading2: boolean = false;
 componentLoaded = false;
 modalClicked = "editModal";
 dislisttablename:any=this.commonService.dislisttablename;
 listtablename:any=this.commonService.listtablename;

  //ANGULAR FORMGROUP is used to pass Value to frm control without jquery and better error handling
  //ANGULAR VALIDATORS  https://angular.io/api/forms/Validators
  //*************************************************************************** */
  listItemsFormGroup = new FormGroup({
    listid: new FormControl(0),
    str1: new FormControl('',[Validators.required]),
    // str2: new FormControl('',[Validators.required]),
    str2: new FormControl(''),

    // created_at: new FormControl(''),
    // updated_at: new FormControl(''),
  });



  // set the getters for validation fields. convenient to use in html for validation
  // get listid() {
  //   return this.listItemsFormGroup.get('listid');
  // }
  get str1() {
    return this.listItemsFormGroup.get('str1');
  }
  // get str2() {
  //   return this.listItemsFormGroup.get('str2');
  // }



  // hidden btn to refresh for a new list table caled from app component
  refreshDatatableListItems(){
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
      this.dislisttablename=this.commonService.dislisttablename; //header text h5
    });
  }

  backToListItemsHome(){
    this.router.navigate(['/ListItemsHome/']);
  }

  ngOnInit() {

    // alert(this.listtablename)
    // this.loadDatatableUser();

    // this hapens when loged in as admin and page is refreshed. In this case the user_role is not yet stored
    // in the common services so to avoid error diverted to Home page
    // Also when a non admin user types the url for user(enter/page refreshed) will be diverted to homepage
    if (this.commonService.user_role=='') {
      this.router.navigate(['/Home/']);
      return;
    } 

    // ngOnInit is called only once. So for all next calls Observable is used so that it can always listen
    // https://www.youtube.com/watch?v=b4zpvh_saic&list=PL1BztTYDF-QNrtkvjkT6Wjc8es7QB4Gty&index=65
    if (!this.componentLoaded) {
      // 2023 now calling from tab clicked
      this.loadDatatableListItems(); //loadDatatableUser() has to be called for first time only. Then refreshDatatableEmpDegree() is called everytime
      this.componentLoaded = false;
    }
    // // following observer code moved from ngOnInit() to ngAfterViewInit() since datatable instance is not created yet to be refreshed
    // this.activatedRoute.paramMap.subscribe((param) => {
    //   this.childempid = param.get('id')
    //   this.refreshDatatableEmpDegree();// refresh instance of angular-datatable
    // })

    // this.fillEmpCmb();//2023

  }



  loadDatatableListItems() {

    if (this.commonService.listtablename=='') {
          this.router.navigate(['/Home/']);

      return;
    }
    var that = this;

 
    this.dtOptions = {
      pagingType: 'full_numbers',
      processing: true,
      serverSide: true,// server side processing
      searching: true,
      lengthChange: true,
      lengthMenu: [ 15, 35, 50, 75, 100 ],
      // dom: 'Blfrtip', //'Bfrtip', use l before f to show length with bottons
      // // //"any" is used in "dtOptions" instead of DataTables.Settings else datatable export buttons wont show
      // buttons: [
      //     'lengthChange','copy', 'csv', 'excel', 'pdf', 'print'
      // ],

      ajax: (dataTablesParameters: any, callback: any) => {
        this.http.post<any>(
          // 'http://localhost:5000/api/empdegree/empdegree-angular-datatable/' + 145 + '',
          // 'http://localhost:5000/api/empdegree/empdegree-angular-datatable',
          '' + that.commonService.baseUrl + '/api/empcombo/listitems-angular-datatable',
          Object.assign(dataTablesParameters,
            {
              // token: '',
              // projectid: this.childprojectid,//this.id, 
              listtablename: this.commonService.listtablename,//'list_empregistration',//
            }),
          {
            // ** Header is now coming from Auth.Inceptor file
            // headers: {
            // Authorization: "Bearer " + localStorage.getItem("token"),
            // Accept: "application/json" //the token is a variable which holds the token
            // }
          },
        ).subscribe(resp => {
          this.listItemsData = resp.data; //use .data after resp for post method
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            // data: []
            // //https://stackoverflow.com/questions/57849250/angular-datatables-server-side-processing-and-buttons-extension-data-is-empty
            data: resp.data  // set data
          });
          // this.fillAllCmb();
          this.commonService.setButtonStatus(); // disable btn if no permission

        });
      },

      columnDefs: [
        // {
        // "orderable": true,
        // "targets": '_all',
        // },
        {
          // "targets": 4, // center action column
          "targets": 3, // center action column
          "className": "text-center",
          "orderable": false,
          // "width": "4%"
        },
      ],

      columns: [

        { data: 'ListID', title: "ListID", width: "20px" },
        { data: 'Str1', title: "Str1", width: "260px" },
        { data: 'Str2', title: "Str2", width: "200px" },
        {
          render: (data: any, type: any, row: any) => {
            // return "<a class='btn-detail' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Change Password</a> | <a class='btn-edit' data-toggle='modal' data-target='#empeditmodal' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Edit</a> | <a class='btn-delete' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Delete</a>";
            return "<a class='btn-edit' data-toggle='modal' data-target='#empeditmodal' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Edit</a> | <a class='btn-delete' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Delete</a>";

          }, title: '&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;Action&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;'
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


        // const eltdetail = $('td', row).find('a.btn-detail');
        // if (eltdetail) {
        //   eltdetail.unbind('click');
        //   eltdetail.bind('click', () => {
        //     this.rowChangePasswordClickHandler(data);
        //   });
        // }
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


    this.showUserEditModal(data.id) // for edit pass only data instead of data.empid

  }

  // rowDetailClickHandler(data: any) {
  //   // alert("Detail Handler: "+data.firstname+"");
  //   // this.router.navigate(['/Empdetail/' + data.ID]); //TODO
  //   this.showUserDetailModal(data.id);
  // }

  //  rowChangePasswordClickHandler(data: any) {
  //   // alert("Detail Handler: "+data.firstname+"");
  //   // this.router.navigate(['/Empdetail/' + data.ID]); //TODO

  //   this.showUserChangePasswordEditModal(data.id);
  // }


  rowEditClickHandler(data: any) {
    // alert("Edit Handler: "+data.firstname+"");
    // this.showUserEditModal(data.ID) // for edit pass only data instead of data.empid


    // this.showUserEditModal(data.id) // for edit pass only data instead of data.empid
    this.checkEditRole(data.ListID);


  }


  rowDeleteClickHandler(data: any) {
    // alert("Delete Handler: "+data.firstname+"");
    // this.deleteUser(data.ID);


    // this.deleteUser(data.id);
    this.checkDeleteRole(data.ListID);
  }





  checkEditRole(e: any) {
    if (this.commonService.checkEditRole()) {
      this.showUserEditModal(e)
    }
  }

  checkDeleteRole(e: any) {
    if (this.commonService.checkDeleteRole()) {
      this.deleteUser(e);   
     }
  }



  clearForm(){
    this.listItemsFormGroup.controls['listid'].setValue(0);
    this.listItemsFormGroup.controls['str1'].setValue('');
    this.listItemsFormGroup.controls['str2'].setValue('');
  }

  clearSearch(){
    this.clearForm();
    $('#dt').DataTable().search('').draw();//clear dt text search input
    // this.search(); // refresh table
  }







  showUserAddModal() {

    if (!this.commonService.checkAddRole()) {
      return;
    }

    this.modalClicked = "addModal";
    $("#listid").prop("disabled", true);
    // $("#user_email").prop("disabled", false); 

    // alert(this.childempid);
    // Get the maxid
    //***************************** */

    let maxid = 0;
    this.listItemsService.getMaxListItemsID(this.commonService.listtablename).subscribe(resp => {

      maxid = resp[0].maxlistitemsid;

      //**employeeFormGroup control within the subscribe so tha values are set after maxid is retrieved from database  */
      // clear form group since same group is used for edit and add
      // Now formgroup is used instead of data object to pass value
      this.listItemsFormGroup.reset(); // to clear the previous validations
      // Manualy set default values since reset() will will turn values to null: // https://stackoverflow.com/questions/51448764/why-are-formgroup-controls-null-after-formgroup-reset
      // this.employeeFormGroup.controls['empid'].setValue(0);

      this.listItemsFormGroup.controls['listid'].setValue(maxid + 1);
      this.listItemsFormGroup.controls['str1'].setValue('');
      this.listItemsFormGroup.controls['str2'].setValue('');
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

    // alert(e);
    // return;
    this.clearForm(); //clear the form of previous edit data
    // this.clearFormErrors();
    this.modalClicked="editModal"
    this.loading2=true;

    $('#btnUserEditModalShow').click(); 
    $("#listid").prop("disabled", true);
    // $("#userempid").attr("disabled", "disabled"); // disabled to avoid duplicate
    // $("#user_email").attr("disabled", "disabled"); // disabled to avoid duplicate

  
    this.listItemsService.getListItems(this.commonService.listtablename,e).subscribe(resp => {

      //this.editData = resp; //use .data after resp for post method. Now using FormFroup to put data
      // **FormFroup and FormControl is used to pass value to edit form instead of [(ngModel)]
      // this.empid=resp.empid; // to pass to child modal if used

      // this.empid = resp.EmpID; // to pass to child modal if used
     
      // this.empDegreeFormGroup.patchValue(resp); 
      // OR

      this.listItemsFormGroup.controls['listid'].setValue(resp.ListID);
      this.listItemsFormGroup.controls['str1'].setValue(resp.Str1);
      this.listItemsFormGroup.controls['str2'].setValue(resp.Str2);

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

    // this is for extra protection. User access is controlled in checkRole(). But sometimes the edit btns
    // in the dttable are late to refresh and user may access other users role by clicking on btns. So extra control is used.
    // if (this.isAdmin==false) {
    //   alert("You need permiddion to edit this form");
    //   return;
    // }

      this.loading2 = true;
      


      this.listItemsService.addListItems(this.listItemsFormGroup.value,this.commonService.listtablename).subscribe(resp => {
        // $("#empeditmodal").modal("hide");
        $("#btnListItemsEditCloseModal").click();
        // this.refreshEmployeeDatatable();
        this.loading2 = false;
        // this.refreshEmpDetail.next('somePhone'); //calling  loadEmpDetail() from parent component
        // this.router.navigateByUrl('Employee') //navigate to AngularDatatable
        //this.router.navigateByUrl('Empdetail/2') //navigate to AngularDatatable
        // var a= this.getMaxId();
        // this.router.navigateByUrl('Empdetail/' + a) //navigate to AngularDatatable // not working
  
        this.refreshDatatableListItems();
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
  
      if (this.listtablename == "list_profilecodesf330" || this.listtablename == "list_profilecodesf254" || this.listtablename == "list_state" && this.listItemsFormGroup.controls['str2'].value == '') {
        alert("Str2 is a required field for this table")
        this.loading2 = false;
        return;
      }

      if (this.listItemsFormGroup.invalid) {
        this.loading2 = false;
        return;
      }
      

        
      if (confirm('Are you sure you want to edit this record?')) {
        // Edit it!
      } else {
        // Do nothing!
        this.loading2 = false;
        $("#btnListItemsEditCloseModal").click();
        return;
      }
    
      // NOT USING now instead disabling EmployeeID control
      // DUPLICATE EMPLOYEEID CHECK
      // NOT USING now in update method(using in add) instead disabling EmployeeID control
      //**************************************************************************************** */
     
  
  
      this.listItemsService.updateListItems(this.listItemsFormGroup.value,this.commonService.listtablename).subscribe(resp => {
             
        // $("#empeditmodal").modal("hide");
        $("#btnListItemsEditCloseModal").click();
        // this.refreshEmployeeDatatable();
        // this.refreshEmpDetail.next('somePhone'); //calling  loadEmpDetail() from parent component
        this.refreshDatatableListItems();
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
  
  
  
    deleteUser(listid: any) {
  
      if (confirm('Are you sure you want to delete this record?')) {
        // Delete it!
      } else {
        // Do nothing!
        return;
      }
       
      this.listItemsService.deleteListItems(listid,this.commonService.listtablename).subscribe(resp => {
        // $("#empeditmodal").modal("hide");
        // this.refreshEmployeeDatatable();
        // this.router.navigateByUrl('Employee') //navigate to AngularDatatable
        this.refreshDatatableListItems();  // to refresh datatable after delete
  
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
