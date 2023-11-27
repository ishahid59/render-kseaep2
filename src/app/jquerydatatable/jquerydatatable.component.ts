import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../services/common.service';
import { EmployeeService } from '../services/employee/employee.service';
import { FormBuilder, FormGroup, FormControl,Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-jquerydatatable',
  templateUrl: './jquerydatatable.component.html',
  styleUrls: ['./jquerydatatable.component.css']
})
export class JquerydatatableComponent {

  constructor(private http: HttpClient, private empservice: EmployeeService,public authService: AuthService,private commonService: CommonService) {
  }



  // table data
  myData: any = ([]); // in angular should ([]) for array

  // editData from database 
  editData: any = {
    empid: 0,
    firstname: "",
    lastname: "",
    jobtitle: 0,
    registration: 0
  };

  // Search params
  searchFirstname: string = "";
  searchLastname: string = "";
  searchJobtitle: number = 0;
  searchRegistration: number = 0;


  // https://www.youtube.com/watch?v=Wr5urqswiko&list=PLQcBFrxTul9IQFF7fJz7jgdRYJz1OCbll&index=6
  employeeFormGroup = new FormGroup({
    empid: new FormControl(0),
    firstname: new FormControl('',[Validators.required]),
    lastname: new FormControl('',[Validators.required]),
    jobtitle: new FormControl(0),
    registration: new FormControl(0),
  });



  // Jquery can be written directly angular method without writing in ngAfterContentInit() without $(document).ready(function ()
  testJquery() {
    $("#myh1").toggle(350);
  }


  // Load Jquery datatabletable after this hook
  public ngAfterContentInit() {
    this.loadJqueryDatatable()
  }


  viewemp(e: any) {
    alert("view emp with id: " + e.empid);
    // console.log(e);
  }

  showempeditmodal(e: any) {
    // // alert("edit emp with id: "+ e.empid);
    // this.http.get<any>(
    //   'http://localhost:5000/api/employee/' + e.empid + '',
    //   {
    //     headers: {
    //       Authorization: "Bearer " + localStorage.getItem("token"),
    //       Accept: "application/json" //the token is a variable which holds the token
    //     }
    //   },
    // )
    this.empservice.getEmployee(e).subscribe(resp => {
      console.log(resp);
      this.editData = resp; //use .data after resp for post method
    },
      error => {
        console.log(error.message);
        // this.errors = error
      });
    // if (!this.errors) {
    //   //route to new page
    // }
  }



  updateEmp() {
    this.empservice.updateEmployee(this.employeeFormGroup.value).subscribe(resp => {
      // $("#empeditmodal").modal("hide");
      $("#btnEditCloseModal").click();
      var table = $('#jquerydatatable').DataTable();
      table.ajax.reload();
    },
      error => {
        console.log(error.message);
        // this.errors = error
      });

    // if (!this.errors) {
    //   //route to new page
    // }
  }




  openAddModal(){
 
     this.editData.empid= 0;
     this.editData.firstname= '';
     this.editData.lastname= '';
     this.editData.jobtitle= 0;
     this.editData.registration= 0;
  
     // clear form group since same group is used for edit and add
     this.employeeFormGroup.reset();
  } 
  





  addEmp(){
    this.empservice.addEmployee(this.employeeFormGroup.value).subscribe(resp => {
      // $("#empeditmodal").modal("hide");
      $("#btnAddCloseModal").click();
      var table = $('#jquerydatatable').DataTable();
      table.ajax.reload();
    },
      error => {
        console.log(error.message);
        // this.errors = error
      });

    // if (!this.errors) {
    //   //route to new page
    // }
}


  deleteEmp(e: any) {
    this.empservice.deleteEmployee(e).subscribe(resp => {
      // $("#empeditmodal").modal("hide");
      var table = $('#jquerydatatable').DataTable();
      table.ajax.reload();
    },
      error => {
        console.log(error.message);
        // this.errors = error
      });

    // if (!this.errors) {
    //   //route to new page
    // }
  }




  // Search jquery Datatable 
  searchJqueryTable() {
    var table = $('#jquerydatatable').DataTable();
    // table.destroy();
    table.ajax.reload();
    // this.loadtable();
  }





  // load jquery Datatable
  loadJqueryDatatable() {

    var that = this; // to pass params in datatable

    // $(document).ready(function () {
    $('#jquerydatatable').DataTable({
      processing: true,
      serverSide: true,
      // searching:false,
      dom: 'B1frtip',
      pageLength: 10,
      // dom: 'Bfrtip',
      ajax: {

        // url: 'http://localhost:5000/api/employee/search/angular-Jquery-datatable',
        url: '' + that.commonService.baseUrl + '/api/employee/search/angular-Jquery-datatable',
        
        dataType: "JSON",
        type: "post",
        // **Note must use this function format to send params in order to use "table.ajax.reload();" for search without calling table.destroy(); first
        // data: {
        // "firstname":  $('#myinput3').val(),
        // "firstname":this.searchFirstname,
        // "lastname": "",
        // "jobtitle": 0,
        // "registration": 0,        
        data: function (d: any) {
          d.firstname = that.searchFirstname;//$("#myinput3").val();
          d.lastname = that.searchLastname;
          d.jobtitle = that.searchJobtitle;
          d.registration = that.searchRegistration;
          // this.loading = false;
        },
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          Accept: "application/json" //the token is a variable which holds the token
        }
      },

      columns: [
        { data: "empid" },
        { data: "firstname" },
        { data: "lastname" },
        { data: "jobtitle" },
        { data: "registration" },
        {
          data: "empid",
          title: "Edit",
          // render: function(data, type, row) {
          //   return (
          //     "<a style='cursor:pointer' onclick=$('#hiddenid').val(" +
          //     row.empid +
          //     ") ; id='empedit'>Edit</a> |   <a style='cursor:pointer' onclick=$('#hiddenid').val(" +
          //     row.empid +
          //     ") id='empdelete'>Delete</a>"
          //   );
          // }


          // https://datatables.net/forums/discussion/63497/how-to-call-a-function-on-column-render
          // https://stackoverflow.com/questions/18758997/call-angular-function-with-jquery
          // external custom.js file is used for onclick='getEditData("+data+")'
          render: (data, type, row) => {
            return "<a  id='dtview'  style='cursor: pointer'>View</a> | <a  id='dtedit' data-toggle='modal' data-target='#empeditmodal'  style='cursor: pointer'>Edit</a> | <a  id='dtdelete'  style='cursor: pointer'>Delete</a>";
            // return  "<a id='test3' onclick='DoAction()' style='cursor: pointer'>Edit</a>";
          }
        }
      ],

      // ***using rowCallback in jquery datatable to use Angular function. Click events are written here instead of render 
      // No other solution is found except external js file in which angular variables & functions cannot be called
      // https://stackoverflow.com/questions/38022763/angular-datatable-click-row-event
      // https://stackoverflow.com/questions/56797751/trying-to-add-row-click-event-in-angular-datatables-but-its-not-working

      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;
        // Unbind first in order to avoid any duplicate handler
        // (see https://github.com/l-lin/angular-datatables/issues/87)
        $('#dtview', row).unbind('click');
        $('#dtview', row).bind('click', () => {
          self.viewemp(data);
        }),
          $('#dtedit', row).unbind('click');
        $('#dtedit', row).bind('click', () => {
          self.showempeditmodal(data);
        }),
          $('#dtdelete', row).unbind('click');
        $('#dtdelete', row).bind('click', () => {
          self.deleteEmp(data);
        });

        return row;
      },
    });
    // });
  }










}
