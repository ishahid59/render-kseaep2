import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../../services/common.service';
import { EmployeeService } from '../../services/employee/employee.service';
import { EmployeeSearchService } from '../../services/employee/employee-search.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';// datepipe used to convert date format to show in html date element



@Component({
  selector: 'app-emp-resumetext-search',
  templateUrl: './emp-resumetext-search.component.html',
  styleUrls: ['./emp-resumetext-search.component.css']
})
export class EmpResumetextSearchComponent {



  constructor(private http: HttpClient,  private empSearchService: EmployeeSearchService, private empservice: EmployeeService, public datePipe: DatePipe, private router: Router, private commonService: CommonService) {
  }

  // dtOptions: DataTables.Settings = {};
  dtOptions: any = {}; // any is used instead of DataTables.Settings else datatable export buttons wont show

  // To refresh datatable with search parameters without using destroy
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective; //used "!" to avoid initialization of variable. Also can use strict:false in tsconfig.json


  // table data
  myData: any = ([]); // in angular should ([]) for array
  empid: any = 0; // to pass to child modal if used


  // srcJobTitle: number = 0;
  // srcDepartment: number = 0;
  // srcEmpDegree: number = 0;
  // srcRegistration: number = 0;
  // srcEmpTraining: number = 0;
  // // col1 end
  // srcDisciplineSF254: number = 0;
  // srcDisciplineSF330: number = 0;
  // srcOwner: number = 0;
  // srcClient: number = 0;
  // srcProOCategory: number = 0;
  // // col2 end 
  // srcProjectType: number = 0;
  // srcEmpProjectRole: number = 0;
  // srcEmployeeStatus: number = 0;
  // //experience
  // srcComID: number = 0;
  // // col3 end 

  srcEmployeeID: string =  '';
  srcEducation: string = '';
  srcRegistration: string = '';
  srcAffiliations: string = '';
  srcEmployment: string =  '';
  srcExperience: string =  '';

  loading2: boolean = false;
  formErrors: any = [{}];
  showWrapText: boolean = true


  showhidecol(colindex){
    // alert()
    // this.showEmailColumn=!this.showEmailColumn;
    // $('#dt td:eq[1]').toggle();
    // $('#dt th:eq(0)').toggle();
    // $('#dt').find('td, th').eq(0).toggle();
  
    // $('#dt tr').each(function() {
    //   $(this).find('td,th').eq(3).toggle(); // includes th if you want to toggle headers too
    // });
  
  
  // this code is for Angular jQuery DataTables show/hide cols  from chatgpt  
  // using DataTables API, not raw jQuery DOM manipulation WORKING
    const table = $('#dt').DataTable();
    const column = table.column(colindex);
    column.visible(!column.visible());
  
  
  }


  resetColumns(){

    // col visibility reset
    $( "#EmployeeID" ).prop( "checked", true );
    $( "#Education" ).prop( "checked", true );
    $( "#Registration" ).prop( "checked", true );
    $( "#Affiliations" ).prop( "checked", true );
    $( "#Employment" ).prop( "checked", false );
    $( "#Experience" ).prop( "checked", false );

    const table = $('#dt').DataTable();
    // const column1 = table.column(1);
    // column1.visible(true);
    const column0 = table.column(0);
    column0.visible(true);
    const column1 = table.column(1);
    column1.visible(true);
    const column2 = table.column(2);
    column2.visible(true);
    const column3 = table.column(3);
    column3.visible(true);
    const column4 = table.column(4);
    column4.visible(false);
    const column5 = table.column(5);
    column5.visible(false);

}









  public ngOnInit(): void {

    // this.fillAllCmb();

   
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
      searching: true,
      pageLength: 25,
      // lengthMenu: [ 10, 35, 50, 75, 100 ],
      lengthMenu: [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
      dom: 'Blfrtip',//'Blfrtip', //'Bfrtip', use l before f to show length with bottons
      // //"any" is used in "dtOptions" instead of DataTables.Settings else datatable export buttons wont show
      buttons: [
        // // 'copy', 'csv', 'excel', 'pdf', 'print'
        // // 'excel', 'csv', 'pdf', 'print',
        // 'excel',

        {
          extend: 'excelHtml5',
          text: 'Excel Export',
 
        },

        {
          text: "Columns",          
        //  text: '<span class="btn glyphicon glyphicon-refresh">Columns</span>',
          // style:["color:red !important","background-color:blue !important"],
          className: "btnColumns",
          action: function (e, dt, node, config) {
            $('#btnEmpResumeTextColumnsModalShow').click();
          }
          
        },
        {
          text: 'Reset Columns',
          className: "btnReset",
          action: function (e, dt, node, config) {
            // that.clearSearch();//alert('Button activated');
            that.resetColumns();//alert('Button activated');
            
          }
        },
        {
          text: 'Clear Search',
          className: "btnReset",
          action: function (e, dt, node, config) {
            that.clearSearch();//alert('Button activated');
            
          }
        },

      ],


      ajax: (dataTablesParameters: any, callback: any) => {
        that.http.post<any>(
          // 'http://localhost:5000/api/employee/search/angular-datatable',
          '' + that.commonService.baseUrl + '/api/empresumetext/search/angular-datatable',

          // Adding custom parameters: https://stackoverflow.com/questions/49645200/how-can-add-custom-parameters-to-angular-5-datatables
          // using Object.assign to bundle dataTablesParameters and additionalparameters in 1 object so that an additional  
          // parameter can be used for post,last parameter is for header which is passes in request header instead of body
          Object.assign(dataTablesParameters,
            {
              token: '',
              // // firstname: this.searchFirstname,
              // lastname: this.searchLastname,
              // jobtitle: this.searchJobtitle,
              // registration: this.searchRegistration,
              // firstname: 'Khaled',

              // jobtitle: this.srcJobTitle,
              // // jobtitle:  $('#srcJobTitle').val(),
              // department: this.srcDepartment,
              // empdegree: this.srcEmpDegree,
              // registration: this.srcRegistration,
              // emptraining: this.srcEmpTraining,

              // disciplinesf254: this.srcDisciplineSF254,
              // disciplinesf330: this.srcDisciplineSF330,
              // owner: this.srcOwner,
              // client: this.srcClient,
              // proocategory: this.srcProOCategory,

              // projecttype: this.srcProjectType,
              // empprojectrole: this.srcEmpProjectRole,
              // employeestatus: this.srcEmployeeStatus,
              //  //experience
              // comid: this.srcComID,

              employeeid: this.srcEmployeeID,
              education: this.srcEducation,
              registration: this.srcRegistration,
              affiliations: this.srcAffiliations,
              employment: this.srcEmployment,
              experience: this.srcExperience,

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
          // this.fillAllCmb(); // call fill cmb after datatable data is loaded and shown
          // console.log(resp.data);
        });
      },

      // columnDefs: [
      //   // {
      //   // "orderable": true,
      //   // "targets": '_all',
      //   // },
      //   // {
      //   //   "targets": 5, // center action column
      //   //   "className": "dt-center",//"text-center",
      //   //   "orderable": false,
      //   //   // "width": "4%"
      //   // },
      //   // {
      //   //   // hiredate is creating sorting problem so "orderable": false,
      //   //   "targets": 4,
      //   //   "orderable": true,
      //   // },

      // ],


      //from chatgpt wrap text in a jQuery DataTables cell and preserve paragraphs (line breaks) (e.g., from <p> tags or \n)
      // columnDefs: [
      //   {
      //   targets: 1, // Replace with your column index
      //   render: function(data: any, type: any, row: any) {
      //     // if (data) {
      //       // return data.replace(/\n/g, '<br>');
      //       return data ? data.replace(/\n/g, '<br>') : '';
      //     // }
      //   }
      // },
      // {
      //   targets: 2, // Replace with your column index
      //   render: function(data: any, type: any, row: any) {
      //     if (data) {
      //       return data.replace(/\n/g, '<br>');
      //     }
      //   }
      // }
    
    
    // ],

      // // datatable columns nedded to export excel data. But visibility turned off so that data does not repeat. 
      // // As a result <thead> in html will not show. So <thead> is used twice to show headers in table 
      // columns: [
      //   { data: 'empid', title: "empid",visible:false }, 
      //   { data: 'firstname', title: 'firstname',visible:false }, 
      //   { data: 'lastname', title: 'lastname',visible:false  }, 
      //   { data: 'jobtitle', title: 'jobtitle', width: '210px',visible:false  }, 
      //   { data: 'registration', title: 'registration',visible:false  }, 
      //   { data: 'hiredate', title: 'hiredate', width: '100px',visible:false }, // date format converted in html since ang dttable gets data in html
      //   { data: null, title: 'Edit', width: '160px', "orderable": false,visible:false  }
      // ],




      // columns: [
      //   // { data: 'empid', title: "empid" }, 
      //   {
      //     render: (data: any, type: any, row: any) => {
      //       // return "<a style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);'  href='/Empdetail/" + row.empid + "'>" + row.firstname + "</a> ";
      //       return "<a style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >" + row.firstname + "</a> ";
      //     }, title: 'Firstname'
      //   },
      //   { data: 'lastname', title: 'Lastname' },
      //   { data: 'jobtitle', title: 'Jobtitle', width: '210px' },
      //   { data: 'registration', title: 'Registration' },
      //   // { data: 'hiredate', title: 'Hiredate' },
      //   {
      //     render: (data: any, type: any, row: any) => {
      //       return that.datePipe.transform(row.hiredate, "MM/dd/yyyy");
      //     }, title: 'Hiredate'
      //   },
      //   {
      //     render: (data: any, type: any, row: any) => {
      //       return "<a class='btn-detail' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Detail</a> | <a class='btn-edit' data-toggle='modal' data-target='#empeditmodal' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Edit</a> | <a class='btn-delete' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Delete</a>";
      //     }, title: 'Action', width: '160px'
      //   },
      // ],



      columns: [
        {
          render: (data: any, type: any, row: any) => {
            // return "<a style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);'  href='/Empdetail/" + row.empid + "'>" + row.firstname + "</a> ";
            return "<a style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >" + row.EmployeeID + "</a> ";
          }, title: 'EmployeeID'
        },

        // { data: 'Education', title: 'Education',name:'Education'},
        // { data: 'Registration', title: 'Registration'},
        // { data: 'Affiliations', title: 'Affiliations', },
        // { data: 'Employment', title: 'Employment', visible: false},
        // { data: 'Experience', title: 'Experience', visible: false },


        {
          data: 'Education', title: 'Education', name: 'Education',
          render: function (data: any, type: any, row: any) {
            if (that.showWrapText) { // dynamically control wrap text 
              //chatgpt To wrap text in a jQuery DataTables cell and preserve paragraphs (line breaks) 
              return data ? data.replace(/\n/g, '<br>') : '';
            }
            else {
              return data
            }
          }
        },

        {
          data: 'Registration', title: 'Registration',
          render: function (data: any, type: any, row: any) {
            return data ? data.replace(/\n/g, '<br>') : '';
          },
        },
        {
          data: 'Affiliations', title: 'Affiliations',
          render: function (data: any, type: any, row: any) {
            return data ? data.replace(/\n/g, '<br>') : '';
          },
        },        
        {
          data: 'Employment', title: 'Employment', visible: false,
          render: function (data: any, type: any, row: any) {
            return data ? data.replace(/\n/g, '<br>') : '';
          },
        },
        {
          data: 'Experience', title: 'Experience', visible: false,
          render: function (data: any, type: any, row: any) {
            return data ? data.replace(/\n/g, '<br>') : '';
          },
        },



        // { data: 'HireDate', title: 'Hiredate' },
        // {
        //   render: (data: any, type: any, row: any) => {
        //     return this.datePipe.transform(row.HireDate, "MM/dd/yyyy");
        //   }, title: 'HireDate'
        // },
        // {
        //   render: (data: any, type: any, row: any) => {
        //     return "<a class='btn-detail' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Detail</a> ";
        //   }, title: 'Action', width: '100px', visible:false 
        // },

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
        // const eltdetail = $('td', row).find('a.btn-detail');
        // if (eltdetail) {
        //   eltdetail.unbind('click');
        //   eltdetail.bind('click', () => {
        //     this.rowDetailClickHandler(data);
        //   });
        // }
        // const eltedit = $('td', row).find('a.btn-edit');
        // if (eltedit) {
        //   eltedit.unbind('click');
        //   eltedit.bind('click', () => {
        //     this.rowEditClickHandler(data);
        //   });
        // }
        // const eltdelete = $('td', row).find('a.btn-delete');
        // if (eltdelete) {
        //   eltdelete.unbind('click');
        //   eltdelete.bind('click', () => {
        //     this.rowDeleteClickHandler(data);
        //   });
        // }
        return row;
      },

    }; // end dtOptions


  } // end onInit()



  // Action column handlers connecting to angular methods directly from within jquatu table
  rowFirstNameClickHandler(data: any) {
    this.router.navigate(['/Empdetail/' + data.EmpID]);
  }


  // // For Angular-Datatable reload. Following method must be used to reload angular-datatable since ngOnInit() is used to initilize table 
  // https://l-lin.github.io/angular-datatables/#/advanced/custom-range-search
  refreshEmployeeDatatable() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }


  // called form save clicked to detect any new errors on save click.
  clearFormErrors() {
    this.formErrors = [{}];
  }








  // Clear Search params
  clearSearch() {
    // this.searchFirstname = "";
    // this.searchLastname = "";
    // this.searchJobtitle = 0;
    // this.searchRegistration = 0;


    // // alert();
    // this.srcJobTitle = 0;
    // this.srcDepartment = 0;
    // this.srcEmpDegree = 0;
    // this.srcRegistration = 0;
    // this.srcEmpTraining = 0;
    // // col1 end
    // this.srcDisciplineSF254 = 0;
    // this.srcDisciplineSF330 = 0;
    // this.srcOwner = 0;
    // this.srcClient = 0;
    // this.srcProOCategory = 0;
    // // col2 end 
    // this.srcProjectType = 0;
    // this.srcEmpProjectRole = 0;
    // this.srcEmployeeStatus = 0;
    // //experience
    // this.srcComID = 0;
    // // col3 end 


    this.srcEducation = '';
    this.srcRegistration = '';
    this.srcAffiliations = '';
    this.srcExperience =  '';



    $('#dt').DataTable().search('').draw();//clear dt text search input
    this.search();

  }


  search() {
    
    $('#dt').DataTable().search('').draw();//clear dt text search input

    this.refreshEmployeeDatatable();
  }






}
