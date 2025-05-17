// import { Component } from '@angular/core';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../../services/common.service';
import { EmployeeService } from '../../services/employee/employee.service';
import { EmployeeSearchService } from '../../services/employee/employee-search.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';// datepipe used to convert date format to show in html date element
// import { ProjectSearchService } from '../../services/project/project-search.service';
import { ProjectService } from '../../services/project/project.service';
import { NgSelectComponent } from '@ng-select/ng-select';



@Component({
  selector: 'app-pro-pdstext-search',
  templateUrl: './pro-pdstext-search.component.html',
  styleUrls: ['./pro-pdstext-search.component.css']
})
export class ProPdstextSearchComponent {


  constructor(private http: HttpClient,  private projectService: ProjectService, private empservice: EmployeeService, public datePipe: DatePipe, private router: Router, private commonService: CommonService) {
  }

  // dtOptions: DataTables.Settings = {};
  dtOptions: any = {}; // any is used instead of DataTables.Settings else datatable export buttons wont show

  // To refresh datatable with search parameters without using destroy
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective; //used "!" to avoid initialization of variable. Also can use strict:false in tsconfig.json

// chatgpt to use handleClearClick(); to clear all NgSelectComponent use the following way 
@ViewChild('projectidSelect') projectidSelect!: NgSelectComponent;


  // table data
  myData: any = ([]); // in angular should ([]) for array
  empid: any = 0; // to pass to child modal if used


  // Registration: number = 0;
  srcProjectID: number =  0;
  srcPdsProjectName: string = '';
  srcPdsLongProjectName: string = '';
  srcPdsProjectLocation: string = '';
  srcOwnerContact: string = '';
  srcClientContact: string = '';
  srcDescription: string =  '';
  srcStartEndDates: string = '';
  srcContractAmount: string =  '';
  srcPdsProjectDescription: string =  '';
  srcNotes: string =  '';
  

  loading2: boolean = false;
  formErrors: any = [{}];
  showWrapText: boolean = true; //test
  cmbProject: any = [{}];


  //used for ngselect dropdown to close on that second click. chatgpt
  isDropdownOpen = false;
  dropdownOpen = false; // 2nd option
  isFocused = false; // to solve abruptly closing after loosing focus
  showallrows: boolean = true; //test

  builtin_searchvalue:string=''; // highlight search text






  // highlightByColumnName(colIdx: number, colHeader: string, term: string,) {
  //   if (!term) return;
  //   $('#dt tbody tr').each(function () {
  //     const colIndex = map[colHeader];

  //     const cell = $('td', this).eq(colIdx);
  //     const originalText = cell.text();
  //     const regex = new RegExp(`(${term})`, 'gi');
  //     const highlighted = originalText.replace(regex, `<span class="highlight">$1</span>`);
  //     cell.html(highlighted);
  //   });
  // }








  showhideAllRows(){
    // this.showWrapText = false
    // this.load()
    this.showallrows=!this.showallrows
    this.refreshEmployeeDatatable();
    
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



  showhidecol(colindex,headertext:string){


    //************************************************************** */
    // CONTROL COLUMN VISIBILITY
    //************************************************************** */
    const table = $('#dt').DataTable();
    const column = table.column(colindex);
    column.visible(!column.visible());
    


    //************************************************************** */
    // CONTROL HIGHLIGHTING SEARCH
    //************************************************************** */

    // built-in search text highlight
    // this code ensures that a column when turned on from chklist will show the highlight texr
    this.commonService.highlightSearch(this.builtin_searchvalue); // built-in search

    // column text highlight
    // column index may change when contrilling column visibility so colheader text is converted to colindex
    var newcolindex = this.commonService.getColumnIndexByHeader(headertext);
    
    if (headertext == 'PdsProjectName') { this.commonService.highlightColumn(newcolindex, this.srcPdsProjectName) }
    if (headertext == 'PdsLongProjectName') { this.commonService.highlightColumn(newcolindex, this.srcPdsLongProjectName) }
    if (headertext == 'PdsProjectLocation') { this.commonService.highlightColumn(newcolindex, this.srcPdsProjectLocation) }
    if (headertext == 'OwnerContact') { this.commonService.highlightColumn(newcolindex, this.srcOwnerContact) }
    if (headertext == 'ClientContact') { this.commonService.highlightColumn(newcolindex, this.srcClientContact) }
    if (headertext == 'StartEndDates') { this.commonService.highlightColumn(newcolindex, this.srcStartEndDates) }
    if (headertext == 'ContractAmount') { this.commonService.highlightColumn(newcolindex, this.srcContractAmount) }
    if (headertext == 'PdsProjectDescription') { this.commonService.highlightColumn(newcolindex, this.srcPdsProjectDescription) }
    if (headertext == 'Notes') { this.commonService.highlightColumn(newcolindex, this.srcNotes) }


  }


//   showhidecol(colindex){
//     // alert()
//     // this.showEmailColumn=!this.showEmailColumn;
//     // $('#dt td:eq[1]').toggle();
//     // $('#dt th:eq(0)').toggle();
//     // $('#dt').find('td, th').eq(0).toggle();
  
//     // $('#dt tr').each(function() {
//     //   $(this).find('td,th').eq(3).toggle(); // includes th if you want to toggle headers too
//     // });
  
  
//   // this code is for Angular jQuery DataTables show/hide cols  from chatgpt  
//   // using DataTables API, not raw jQuery DOM manipulation WORKING
//     const table = $('#dt').DataTable();
//     const column = table.column(colindex);
//     column.visible(!column.visible());


//        // this code ensures that a column when turned on from chklist will show the highlight texr
//        this.commonService.highlightSearch(this.builtin_searchvalue); // built-in search
// // alert(colindex)

//        if (colindex==1) {this.commonService.highlightColumn(colindex,this.srcPdsProjectName)}
//        if (colindex==2) {this.commonService.highlightColumn(colindex,this.srcPdsProjectLocation)}
//        if (colindex==3) {this.commonService.highlightColumn(colindex,this.srcOwnerContact)}
//        if (colindex==4) {this.commonService.highlightColumn(colindex,this.srcClientContact)}
//        if (colindex==5) {this.commonService.highlightColumn(colindex,this.srcStartEndDates)}
//        if (colindex==6) {this.commonService.highlightColumn(colindex,this.srcContractAmount)}
//        if (colindex==7) {this.commonService.highlightColumn(colindex,this.srcPdsProjectDescription)}
//        if (colindex==8) {this.commonService.highlightColumn(colindex,this.srcNotes)}


//   }


  resetColumns(){

    // col visibility reset
    $( "#disProjectNo" ).prop( "checked", true );
    $( "#PdsProjectName" ).prop( "checked", false );
    $( "#PdsLongProjectName" ).prop( "checked", false );
    $( "#PdsProjectLocaion" ).prop( "checked", false );
    $( "#OwnerContact" ).prop( "checked", true );
    $( "#ClientContact" ).prop( "checked", true );
    $( "#StartEndDates" ).prop( "checked", false );
    $( "#ContractAmount" ).prop( "checked", false );
    $( "#PdsProjectDescription" ).prop( "checked", true );
    $( "#Notes" ).prop( "checked", false );
    $( "#LeftJoin" ).prop( "checked", true );


    const table = $('#dt').DataTable();
    // const column1 = table.column(1);
    // column1.visible(true);
    const column0 = table.column(0); //disProjectNo
    column0.visible(true);
    const column1 = table.column(1); //PdsProjectName
    column1.visible(false);
    const column2 = table.column(2); //PdsLongProjectName
    column2.visible(false);
    const column3 = table.column(3);//PdsProjectLocaion
    column3.visible(false);
    const column4 = table.column(4); // OwnerContact
    column4.visible(true);
    const column5 = table.column(5);// ClientContact
    column5.visible(true);
    const column6 = table.column(6); // StartEndDates
    column6.visible(false);
    const column7 = table.column(7);// ContractAmount
    column7.visible(false);
    const column8 = table.column(8);// PdsProjectDescription
    column8.visible(true);
    const column9 = table.column(9);
    column9.visible(false);
    const column10 = table.column(10);
    column10.visible(true);
}



public ngOnInit(): void {

  // this.fillAllCmb();
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


    ajax: (dataTablesParameters: any, callback: any) => {
      that.http.post<any>(
        // 'http://localhost:5000/api/employee/search/angular-datatable',
        '' + that.commonService.baseUrl + '/api/propdstext/search/angular-datatable',

        // Adding custom parameters: https://stackoverflow.com/questions/49645200/how-can-add-custom-parameters-to-angular-5-datatables
        // using Object.assign to bundle dataTablesParameters and additionalparameters in 1 object so that an additional  
        // parameter can be used for post,last parameter is for header which is passes in request header instead of body
        Object.assign(dataTablesParameters,
          {
            token: '',

            projectid: this.srcProjectID,
            pdsprojectname: this.srcPdsProjectName,
            pdslongprojectname: this.srcPdsLongProjectName,
            pdsprojectlocation: this.srcPdsProjectLocation,
            ownercontact: this.srcOwnerContact,
            clientcontact: this.srcClientContact,
            description: this.srcDescription,
            startenddates: this.srcStartEndDates,
            contractAmount: this.srcContractAmount,
            pdsprojectdescription: this.srcPdsProjectDescription,
            notes: this.srcNotes,
            showallrows:this.showallrows,


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

        // HIGHLIGHT SEARCH TEXT. place code for movenext page here in dt CALLBACK. captures the movenext  
        that.commonService.highlightSearch(this.builtin_searchvalue); //built-in search

        // this.commonService.highlightColumn(4,this.srcPdsProjectName);
        // this.commonService.highlightColumn(5,this.srcPdsProjectLocation);
        // this.commonService.highlightColumn(1,this.srcOwnerContact);
        // this.commonService.highlightColumn(2,this.srcClientContact);
        // this.commonService.highlightColumn(5,this.srcStartEndDates);
        // this.commonService.highlightColumn(6,this.srcContractAmount);
        // this.commonService.highlightColumn(3,this.srcPdsProjectDescription);
        // this.commonService.highlightColumn(5,this.srcNotes);

        // column index may change when controlling column visibility so colheader text is converted to colindex
        this.commonService.highlightColumn(this.commonService.getColumnIndexByHeader('PdsProjectName'), this.srcPdsProjectName) 
        this.commonService.highlightColumn(this.commonService.getColumnIndexByHeader('PdsLongProjectName'), this.srcPdsLongProjectName) 
        this.commonService.highlightColumn(this.commonService.getColumnIndexByHeader('PdsProjectLocation'),this.srcPdsProjectLocation);
        this.commonService.highlightColumn(this.commonService.getColumnIndexByHeader('OwnerContact'), this.srcOwnerContact) 
        this.commonService.highlightColumn(this.commonService.getColumnIndexByHeader('ClientContact'), this.srcClientContact) 
        this.commonService.highlightColumn(this.commonService.getColumnIndexByHeader('StartEndDates'), this.srcStartEndDates) 
        this.commonService.highlightColumn(this.commonService.getColumnIndexByHeader('ContractAmount'), this.srcContractAmount) 
        this.commonService.highlightColumn(this.commonService.getColumnIndexByHeader('PdsProjectDescription'), this.srcPdsProjectDescription) 
        this.commonService.highlightColumn(this.commonService.getColumnIndexByHeader('Notes'), this.srcNotes) 




    
// alert(newcolindex)
        
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
      {
        render: (data: any, type: any, row: any) => {
          // return "<a style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);'  href='/Empdetail/" + row.empid + "'>" + row.firstname + "</a> ";
          return "<a style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >" + row.ProjectNo + "</a> ";
        }, title: 'ProjectNo'
      },


      // test  dynamically control wrap text 
      // {
      //   data: 'Education', title: 'Education', name: 'Education',
      //   render: function (data: any, type: any, row: any) {
      //     if (that.showWrapText) { // dynamically control wrap text 
      //       //chatgpt To wrap text in a jQuery DataTables cell and preserve paragraphs (line breaks) 
      //       return data ? data.replace(/\n/g, '<br>') : '';
      //     }
      //     else {
      //       return data
      //     }
      //   }
      // },
      {
        data: 'PdsProjectName', title: 'PdsProjectName', visible:false,
        render: function (data: any, type: any, row: any) {
        //chatgpt To wrap text in a jQuery DataTables cell and preserve paragraphs (line breaks) 
          return data ? data.replace(/\n/g, '<br>') : '';
        },
      },
      {
        data: 'PdsLongProjectName', title: 'PdsLongProjectName', visible:false,
        render: function (data: any, type: any, row: any) {
        //chatgpt To wrap text in a jQuery DataTables cell and preserve paragraphs (line breaks) 
          return data ? data.replace(/\n/g, '<br>') : '';
        },
      },
      {
        data: 'PdsProjectLocation', title: 'PdsProjectLocation', visible:false,
        render: function (data: any, type: any, row: any) {
        //chatgpt To wrap text in a jQuery DataTables cell and preserve paragraphs (line breaks) 
          return data ? data.replace(/\n/g, '<br>') : '';
        },
      },
      {
        data: 'OwnerContact', title: 'OwnerContact',
        render: function (data: any, type: any, row: any) {
        //chatgpt To wrap text in a jQuery DataTables cell and preserve paragraphs (line breaks) 
          return data ? data.replace(/\n/g, '<br>') : '';
        },
      },

      {
        data: 'ClientContact', title: 'ClientContact',
        render: function (data: any, type: any, row: any) {
          return data ? data.replace(/\n/g, '<br>') : '';
        },
      },

      {
        data: 'StartEndDates', title: 'StartEndDates', visible: false,
        render: function (data: any, type: any, row: any) {
          return data ? data.replace(/\n/g, '<br>') : '';
        },
      },        
      {
        data: 'ContractAmount', title: 'ContractAmount', visible: false,
        render: function (data: any, type: any, row: any) {
          return data ? data.replace(/\n/g, '<br>') : '';
        },
      },
      {
        data: 'PdsProjectDescription', title: 'PdsProjectDescription', 
        render: function (data: any, type: any, row: any) {
        //chatgpt To wrap text in a jQuery DataTables cell and preserve paragraphs (line breaks) 
          return data ? data.replace(/\n/g, '<br>') : '';
        },
      },
      {
        data: 'Notes', title: 'Notes', visible: false,
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
    this.router.navigate(['/Projectdetail/' + data.ProjectID]);
  }




  // called form save clicked to detect any new errors on save click.
  clearFormErrors() {
    this.formErrors = [{}];
  }


    // // For Angular-Datatable reload. Following method must be used to reload angular-datatable since ngOnInit() is used to initilize table 
  // https://l-lin.github.io/angular-datatables/#/advanced/custom-range-search
  refreshEmployeeDatatable() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  search() {
    
    $('#dt').DataTable().search('').draw();//clear dt text search input

    this.refreshEmployeeDatatable();
  }

  // Clear Search params
  clearSearch() {

    // this.srcEmpID = 0;
    this.srcProjectID = 0;
    // employeeid: this.srcEmployeeID,
    this.srcPdsProjectName = '';
    this.srcPdsLongProjectName = '';
    this.srcPdsProjectLocation = '';
    this.srcOwnerContact = '';
    this.srcClientContact = '';
    this.srcDescription = '';
    this.srcClientContact = '';
    this.srcStartEndDates = '';
    this.srcContractAmount = '';
    this.srcPdsProjectDescription = '';
    this.srcNotes = '';


    $('#dt').DataTable().search('').draw();//clear dt text search input
    this.search();

    //2025 this is uded for ngselect. For claring after search btn clicked so that placeholder shows
    //https://stackoverflow.com/questions/56646397/how-to-clear-ng-select-selection
    // this.ngSelectComponent.handleClearClick();
    // this.ngSelectComponent2.clearModel();
    // this.findid=0;

    this.projectidSelect.handleClearClick();    // clears city select
    this.srcProjectID=0;
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
