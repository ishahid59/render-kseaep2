// import { Component } from '@angular/core';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../../services/common.service';
import { EmployeeService } from '../../services/employee/employee.service';
import { EmployeeSearchService } from '../../services/employee/employee-search.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';// datepipe used to convert date format to show in html date element
import { NgSelectComponent } from '@ng-select/ng-select';
import { ProjectService } from '../../services/project/project.service';


@Component({
  selector: 'app-emp-resumeprojects-search',
  templateUrl: './emp-resumeprojects-search.component.html',
  styleUrls: ['./emp-resumeprojects-search.component.css']
})


export class EmpResumeprojectsSearchComponent {


  constructor(private http: HttpClient,  private empSearchService: EmployeeSearchService, private empservice: EmployeeService, public datePipe: DatePipe, private router: Router, private commonService: CommonService,private projectService: ProjectService) {
  }




  // dtOptions: DataTables.Settings = {};
  dtOptions: any = {}; // any is used instead of DataTables.Settings else datatable export buttons wont show

  // To refresh datatable with search parameters without using destroy
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective; //used "!" to avoid initialization of variable. Also can use strict:false in tsconfig.json

  // @ViewChild(NgSelectComponent) mySelect!: NgSelectComponent;//used for ngselect dropdown to close on that second click. chatgpt
  // @ViewChild(NgSelectComponent) ngSelectComponent!: NgSelectComponent;

// chatgpt to use handleClearClick(); to clear all NgSelectComponent use the following way 
  @ViewChild('empidSelect') empidSelect!: NgSelectComponent;
  @ViewChild('projectidSelect') projectidSelect!: NgSelectComponent;




  // table data
  // myData: any = ([]); // in angular should ([]) for array
  proTeamData: any = ([]); // in angular should ([]) for array
  empid: any = 0; // to pass to child modal if used


  // srcRegistration: number = 0;
  // srcEmployeeID
  // srcEducation: string = '';
  // srcRegistration: string = '';
  // srcAffiliations: string = '';
  // srcEmployment: string =  '';
  // srcExperience: string =  '';

  srcEmpID: number = 0;
  srcProjectID: number = 0;
  // srcEmployeeID: string = '';
  srcDutiesAndResponsibilities: string = '';
  srcEmpProjectRole: string = '';
  srcSecProjectrole: string = '';
  srcDurationFrom: string = '';
  srcDurationTo: string = '';
  srcMonthsOfExp: string = '';
  srcNotes: string = '';

  loading2: boolean = false;
  formErrors: any = [{}];
  showWrapText: boolean = true; //test
  findid:  any = 0;
  findid2:  any = 0;
  cmbEmp: any = [{}];
  cmbProject: any = [{}];


  //used for ngselect dropdown to close on that second click. chatgpt
  isDropdownOpen = false;
  dropdownOpen = false; // 2nd option
  isFocused = false; // to solve abruptly closing after loosing focus

  builtin_searchvalue:string=''; // highlight search text


  showhidecol(colindex,headertext){
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


       // this code ensures that a column when turned on from chklist will show the highlight texr
       this.commonService.highlightSearch(this.builtin_searchvalue); // built-in search


      //  if (colindex==1) {this.commonService.highlightColumn(colindex,this.srcDutiesAndResponsibilities)}
      //  if (colindex==2) {this.commonService.highlightColumn(colindex,this.srcEmpProjectRole)}
      //  if (colindex==4) {this.commonService.highlightColumn(colindex,this.srcSecProjectrole)}
      //  if (colindex==5) {this.commonService.highlightColumn(colindex,this.srcDurationFrom)}
      //  if (colindex==6) {this.commonService.highlightColumn(colindex,this.srcDurationTo)}
      //  if (colindex==7) {this.commonService.highlightColumn(colindex,this.srcMonthsOfExp)}
      //  if (colindex==8) {this.commonService.highlightColumn(colindex,this.srcNotes)}

    // colindex may change when contrilling col visibility so colheader text is coverted to index
    var newcolindex = this.commonService.getColumnIndexByHeader(headertext);

    if (headertext == 'Duties and Responsibilities') { this.commonService.highlightColumn(newcolindex, this.srcDutiesAndResponsibilities) }
    if (headertext == 'EmpProjectRole') { this.commonService.highlightColumn(newcolindex, this.srcEmpProjectRole) }
    if (headertext == 'SecProjectrole') { this.commonService.highlightColumn(newcolindex, this.srcSecProjectrole) }
    if (headertext == 'DurationFrom') { this.commonService.highlightColumn(newcolindex, this.srcDurationFrom) }
    if (headertext == 'DurationTo') { this.commonService.highlightColumn(newcolindex, this.srcDurationTo) }
    if (headertext == 'MonthsOfExp') { this.commonService.highlightColumn(newcolindex, this.srcMonthsOfExp) }
    if (headertext == 'Notes') { this.commonService.highlightColumn(newcolindex, this.srcNotes) }
   
  }

  // test not using now
  showhideWrapText(){
    // this.showWrapText = false
    // this.load()
    
  }


  // 2025 to use with ngselect
  // using $event to get current id in html and pass to ts file-->
  // https://stackoverflow.com/questions/65868830/ng-select-get-value-by-id -->
  setfindidemp(x: any) {
    // alert(x.ProjectID)
    if (x) {
      // this.findid = x.EmpID; //2025 if x is null then console giving err but with no problem. so condition is used
      this.srcEmpID = x.EmpID;
    }
  }
  setfindidproject(x: any) {
    // alert(x.ProjectID)
    if (x) {
      // this.findid = x.ProjectID; //2025 if x is null then console giving err but with no problem. so condition is used
      this.srcProjectID = x.ProjectID;
    }
  }

  onFocus() {
    this.isFocused = true;
  }


  // when searchable is on in html clicking in ngselect input doesnt close the dropdown
  // So the below 2 options can be used to manually close, but when the input looses 
  // focus the dropdown closing abruptly when clicked so the if (this.isFocused == true) is used 
  //************************************************************************************************** */
  //   toggleDropdown(select: NgSelectComponent) {
  //     if (this.dropdownOpen && this.isFocused == true) {
  //       select.close();
  //     } else {
  //       select.open();
  //     }
  //  this.dropdownOpen = !this.dropdownOpen;
  // }

  toggleDropdown(select: NgSelectComponent) {
    if (this.dropdownOpen) {
      select.close();
    } //else {
    if (this.isFocused == true) {
      select.open();
      // select.open();// second time called because when select losses focus and then clicked dropdown open and closes abruptly
    }
    this.dropdownOpen = !this.dropdownOpen;
    this.isFocused = false;
  }


  resetColumns(){
    
    $( "#disProjectNo" ).prop( "checked", false );
    $( "#disEmployeeID" ).prop( "checked", true );
    $( "#DutiesAndResponsibilities" ).prop( "checked", true );
    $( "#EmpProjectRole" ).prop( "checked", true );
    $( "#SecProjectRole" ).prop( "checked", false );
    $( "#DurationFrom" ).prop( "checked", false );
    $( "#DurationTo" ).prop( "checked", false );
    $( "#MonthsOfExp" ).prop( "checked", false );
    $( "#Notes" ).prop( "checked", false );
    // $( "#Action" ).prop( "checked", false );
  
    const table = $('.dt_emp_resumeprojects_search').DataTable();
    const column0 = table.column(0);
    column0.visible(false);
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
    const column6 = table.column(6);
    column6.visible(false);
    const column7 = table.column(7);
    column7.visible(false);
    const column8 = table.column(8);
    column8.visible(false);
    const column9 = table.column(9);
    column9.visible(false);
 

}





  public ngOnInit(): void {

    // this.fillAllCmb();
    this.fillEmpCmb();// 
    this.fillProjectCmb();
   
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
        // {
        //   text: 'Clear Search',
        //   className: "btnReset",
        //   action: function (e, dt, node, config) {
        //     that.clearSearch();//alert('Button activated');
            
        //   }
        // },

      ],
      
      order: [[1, 'asc']], // 1 col is selected instead of 0 since 1 is hidden


      ajax: (dataTablesParameters: any, callback: any) => {
        that.http.post<any>(
          // 'http://localhost:5000/api/employee/search/angular-datatable',
          // '' + that.commonService.baseUrl + '/api/empresumetext/search/angular-datatable',
          '' + that.commonService.baseUrl + '/api/proteam/proteam-angular-datatable-empresumeprojectssearch',

          // Adding custom parameters: https://stackoverflow.com/questions/49645200/how-can-add-custom-parameters-to-angular-5-datatables
          // using Object.assign to bundle dataTablesParameters and additionalparameters in 1 object so that an additional  
          // parameter can be used for post,last parameter is for header which is passes in request header instead of body
          Object.assign(dataTablesParameters,
            {
              token: '',

              // empid: this.childempid,//this.id, 

              empid: this.srcEmpID, //this.findid,
              projectid: this.srcProjectID, //this.findid2,
              // employeeid: this.srcEmployeeID,
              dutiesandresponsibilities: this.srcDutiesAndResponsibilities,
              empprojectrole: this.srcEmpProjectRole,
              secprojectrole: this.srcSecProjectrole,
              durationfrom: this.srcDurationFrom,
              durationto: this.srcDurationTo,
              monthsofexp: this.srcMonthsOfExp,
              notes: this.srcNotes,

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
          // this.myData = resp.data; //use .data after resp for post method
          this.proTeamData = resp.data; //use .data after resp for post method
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            // data: []
            //https://stackoverflow.com/questions/57849250/angular-datatables-server-side-processing-and-buttons-extension-data-is-empty
            data: resp.data  // set data
          });
          // this.fillAllCmb(); // call fill cmb after datatable data is loaded and shown
          // this.commonService.setButtonStatus(); // disable btn if no permission



            // HIGHLIGHT SEARCH TEXT. place code for movenext page here in dt CALLBACK. captures the movenext  
            this.commonService.highlightSearch(this.builtin_searchvalue); //built-in search

            // this.commonService.highlightColumn(1,this.srcDutiesAndResponsibilities);
            // this.commonService.highlightColumn(2,this.srcEmpProjectRole);
            // this.commonService.highlightColumn(4,this.srcSecProjectrole); //not sure to keep it
            // this.commonService.highlightColumn(5,this.srcDurationFrom);
            // this.commonService.highlightColumn(6,this.srcDurationTo);
            // this.commonService.highlightColumn(7,this.srcMonthsOfExp);
            // this.commonService.highlightColumn(8,this.srcNotes);

            // column index may change when controlling column visibility so colheader text is converted to colindex
            this.commonService.highlightColumn(this.commonService.getColumnIndexByHeader('Duties and Responsibilities'), this.srcDutiesAndResponsibilities) 
            this.commonService.highlightColumn(this.commonService.getColumnIndexByHeader('EmpProjectRole'),this.srcEmpProjectRole);
            this.commonService.highlightColumn(this.commonService.getColumnIndexByHeader('SecProjectrole'), this.srcSecProjectrole) 
            this.commonService.highlightColumn(this.commonService.getColumnIndexByHeader('DurationFrom'), this.srcDurationFrom) 
            this.commonService.highlightColumn(this.commonService.getColumnIndexByHeader('DurationTo'), this.srcDurationTo) 
            this.commonService.highlightColumn(this.commonService.getColumnIndexByHeader('MonthsOfExp'), this.srcMonthsOfExp) 
            this.commonService.highlightColumn(this.commonService.getColumnIndexByHeader('Notes'), this.srcNotes) 

                  
            // Capture built-in search value here. place code to get built-in search value of datatable. Capture search value here
            // $(document).ready(function() {
              var table = $('#dt').DataTable();
              $('#dt').on('search.dt', function () {
                var searchValue = table.search();
                that.builtin_searchvalue = searchValue;
                that.commonService.highlightSearch(searchValue);
              });
              // });

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

        // { data: '', title: "id" }, 
        // { data: 'ProjectID', title: "ProjectID", width: "50px", },
        // { data: 'EmpID', title: "empid", width: "50px","visible": false  },
        // { data: 'disEmployeeID', title: "EmployeeID", width: "80px" },
        {
          render: (data: any, type: any, row: any) =>  {
            // return "<a style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);'  href='/Empdetail/" + row.empid + "'>" + row.firstname + "</a> ";
            return "<a style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >" + row.disProjectNo + "</a> ";
          }, title: 'ProjectNo', width: "120px", "className": "dt-center" , "visible": false,
        },

        {
          render: (data: any, type: any, row: any) =>  {
            // return "<a style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);'  href='/Empdetail/" + row.empid + "'>" + row.firstname + "</a> ";
            return "<a style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >" + row.disEmployeeID + "</a> ";
          }, title: 'EmployeeID', width: "120px"
        },
        
        { data: 'DutiesAndResponsibilities', title: "Duties and Responsibilities", width: "660px", },
        { data: 'disEmpProjectRole', title: "EmpProjectRole", width: "180px" },
        { data: 'disSecProjectRole', title: "SecProjectRole", width: "200px", "visible": false },
        // {
        //   data: "DutiesAndResponsibilities", title: "Duties And Responsibilities", "mRender": function (data: any, type: any, row: any) {
        //       // implement tooltip
        //        return '<span data-toggle="tooltip" title="' + data + '">' +  data + '' + '</span>'
        //   }
        // },

        // { data: 'DurationFrom', title: "DurationFrom", width: "120px" },
        // { data: 'DurationTo', title: "DurationTo", width: "120px" },
         {
          render: (data: any, type: any, row: any) => {
            return this.datePipe.transform(row.DurationFrom, "MM/dd/yyyy");
          }, title: 'DurationFrom', width: "50px", "visible": false  
        },
        { 
          render: (data: any, type: any, row: any) => {
            return this.datePipe.transform(row.DurationTo, "MM/dd/yyyy");
          }, title: 'DurationTo', width: "50px", "visible": false 
        },        
        { data: 'MonthsOfExp', title: "MonthsOfExp", width: "50px","visible": false },
        { data: 'Notes', title: "Notes", width: "80px", "visible": false  },
        // { data: '', title: "Action", width: "100px" },
        // {
        // {
        //   render: (data: any, type: any, row: any) => {
        //     // return "<a class='btn-detail' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Detail</a> | <a class='btn-edit' data-toggle='modal' data-target='#empeditmodal' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Edit</a> | <a class='btn-delete' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Delete</a>";
        //     return "<a class='btn-detail' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Detail</a> | <a class='btn-edit' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Edit</a> | <a class='btn-delete' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Delete</a>";

        //   }, title: 'Action', "className": "dt-center"
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

    this.srcEmpID = 0;
    this.srcProjectID = 0;
    // employeeid: this.srcEmployeeID,
    this.srcDutiesAndResponsibilities = '';
    this.srcEmpProjectRole = '';
    this.srcSecProjectrole = '';
    this.srcDurationFrom = '';
    this.srcDurationTo = '';
    this.srcMonthsOfExp = '';
    this.srcNotes = '';


    $('#dt').DataTable().search('').draw();//clear dt text search input
    this.search();

    //2025 this is uded for ngselect. For claring after search btn clicked so that placeholder shows
    //https://stackoverflow.com/questions/56646397/how-to-clear-ng-select-selection
    // this.ngSelectComponent.handleClearClick();
    // this.ngSelectComponent2.clearModel();
    // this.findid=0;

    this.empidSelect.handleClearClick(); // clears country select
    this.projectidSelect.handleClearClick();    // clears city select
    this.srcEmpID=0;
    this.srcProjectID=0;
  }


  search() {
    
    $('#dt').DataTable().search('').draw();//clear dt text search input

    this.refreshEmployeeDatatable();
  }



  // Fill all combos in one function using forkJoin of rxjx
  fillEmpCmb() {

    this.empSearchService.getCmbEmp().subscribe(resp => {
      this.cmbEmp = resp;
      // console.log(resp);
    },
      err => {
        alert(err.message);
      });

  }


  // Fill all combos in one function using forkJoin of rxjx
  fillProjectCmb() {
    this.projectService.getCmbProject().subscribe(resp => {
      this.cmbProject = resp;
      // console.log(resp);
    },
      err => {
        alert(err.message);
      });
  }


}
