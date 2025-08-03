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
import { ProjectSearchService } from '../../services/project/project-search.service';

import { Observable, forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-emp-resumeprojects-search-select',
  templateUrl: './emp-resumeprojects-search-select.component.html',
  styleUrls: ['./emp-resumeprojects-search-select.component.css']
})
export class EmpResumeprojectsSearchSelectComponent {

  constructor(private http: HttpClient,  private empSearchService: EmployeeSearchService,private projectSearchService: ProjectSearchService,  private empservice: EmployeeService, public datePipe: DatePipe, private router: Router, private commonService: CommonService,private projectService: ProjectService) {
  }






  // dtOptions: DataTables.Settings = {};
  dtOptions: any = {}; // any is used instead of DataTables.Settings else datatable export buttons wont show

  // To refresh datatable with search parameters without using destroy
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective; //used "!" to avoid initialization of variable. Also can use strict:false in tsconfig.json

  // @ViewChild(NgSelectComponent) mySelect!: NgSelectComponent;//used for ngselect dropdown to close on that second click. chatgpt
  // @ViewChild(NgSelectComponent) ngSelectComponent!: NgSelectComponent;

// chatgpt to use handleClearClick(); to clear all NgSelectComponent use the following way 
 // also to use multiple ngselect in one for this style will avoid any conflict between controls
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


  //Added from project search 20250803
  srcPrimaryProjectType: number = 0;
  srcProjectRole: number = 0;
  srcOwnerCategory: number = 0;
  srcOwner: number = 0;
  srcClient: number = 0;
  srcProjectStatus: number = 0;
  srcExcludeIEProjects: number = 0;
  srcExcludeOngoingProjects: number = 0;



  loading2: boolean = false;
  formErrors: any = [{}];
  showWrapText: boolean = true; //test
  findid:  any = 0;
  findid2:  any = 0;

  cmbEmp: any = [{}];
  cmbProject: any = [{}];

  CmbProProjectType: any = ([]);
  CmbProProjectTypeMulti: any = ([]);
  CmbProPRole: any = ([]);
  CmbEmpMain: any = ([]);
  CmbProOCategory: any = ([]);
  CmbComMain: any = ([]);
  CmbCaoMain: any = ([]);
  CmbProStatus: any = ([]);
  CmbEmpProjectRole: any = ([]);
  CmbProposalMain: any = ([]);






  //used for ngselect dropdown to close on that second click. chatgpt
  isDropdownOpen = false;
  dropdownOpen = false; // 2nd option
  isFocused = false; // to solve abruptly closing after loosing focus

  builtin_searchvalue:string=''; // highlight search text


  isChecked:boolean = false;
  // componentLoaded: boolean = false;
  dtPageLength: number = 25;
  showLength:boolean=true;
  btnHidden="btnHidden";

  isDisabledEmpID:boolean=false;
  selectedEmpID: any = null; // used for restoring the cmb value after coming from prosearch form




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


    // const column0 = table.column(0);
    // column0.visible(false);
    // const column1 = table.column(1);
    // column1.visible(true);
    // const column2 = table.column(2);
    // column2.visible(true);
    // const column3 = table.column(3);
    // column3.visible(true);
    // const column4 = table.column(4);
    // column4.visible(false);
    // const column5 = table.column(5);
    // column5.visible(false);
    // const column6 = table.column(6);
    // column6.visible(false);
    // const column7 = table.column(7);
    // column7.visible(false);
    // const column8 = table.column(8);
    // column8.visible(false);
    // const column9 = table.column(9);
    // column9.visible(false);

    // col 0 is chkbox
    // col 1 is ID
    const column2 = table.column(2);
    column2.visible(false);
    const column3 = table.column(3);
    column3.visible(true);
    const column4 = table.column(4);
    column4.visible(true);
    const column5 = table.column(5);
    column5.visible(true);
    const column6 = table.column(6);
    column6.visible(false);
    const column7 = table.column(7);
    column7.visible(false);
    const column8 = table.column(8);
    column8.visible(false);
    const column9 = table.column(9);
    column9.visible(false);
    const column10 = table.column(10);
    column10.visible(false);
    const column11 = table.column(11);
    column11.visible(false);


 }



  // for Bold report resume selected projects
  // https://therichpost.com/angular-9-10-datatable-binding-with-custom-checkbox-multi-selection/
  // check all rows
  checkuncheckall() {


    // $("#dt input[type='checkbox']").on('change', function () {
    //   if ($(this).prop('checked')) {
    //     $(this).parent().parent().css('background-color', 'blue');
    //     $(this).parent().parent().css('color', 'blwhiteue');
    //   }
    // });

    if (this.isChecked == true) {
      $("#dt input[type='checkbox']").each(function () {
        // $(this).removeAttr('checked');
        $(this).prop("checked", false);
        $(this).parent().parent().css('background-color', 'transparent');
        $("#dt th").css('background-color', '#337ab7');
      });
      this.isChecked = false;
    }
    else {
      $("#dt input[type='checkbox']").each(function () {
        // $(this).attr('checked', 'checked');
        $(this).prop("checked", true);
        $(this).parent().parent().css('background-color', 'rgb(255 255 220)');
        $("#dt th").css('background-color', '#337ab7');
      });
      this.isChecked = true;
    }
  }




  // save selected projects for resume
  // ****************************************************************************
  saveProjectsForResume() {

    // this.commonService.selectedEmpID = 2;// must set id when going back to report form because it is lost when search form is open


    // array can also be saved in local storage
    // because if prosearch is opened from reports page in a new tab
    // then from the new tab data cannot be saved in the previous report tab


     // Create array from selected items
    // ****************************************************************************
    let arr: any = [];
    // If all selected value has to pass through ajax one by one row/
    $('#dt input:checked').parent().each(function () {
      arr.push($(this).siblings().map(function () {
        return $(this).text()
      }).get());
    });
    // console.log(arr); // console.log(arr[0][0]);
    


    // remove 1st element which shows header name when select all is selected
    // ****************************************************************************
    if ($('#headercheckbox').prop('checked')) {
      arr.shift(); // remove 1st element which shows header name when select all is selected
    }


    // Generate project ids from arr
    // ************************************************************
    var txt = ''
    for (let i = 0; i < arr.length; i++) {
      txt = txt + "," + arr[i][0]
    }


    // Remove 1st coma and generate projectids
    // ************************************************************

    var projectids = txt.substring(1); // remove first coma


    
  
    // // // Create the array of projectID to be used in the Resume report for selected projects for employee
    // // // Condition is used because the header colname gets included in the array as projectID when All is selected
    
    // if ($('#headercheckbox').prop('checked')) {
    //   for (let i = 1; i < arr.length; i++) {
    //     arr.push(arr[i][0]);
    //   }
    // }
    // else{
    //   for (let i = 0; i < arr.length; i++) {
    //     arr.push(arr[i][0]);
    //   }
    // }



      // CREATE RESUME
      // *************************************************************************************

    if (projectids == '') { // if no project selected or no project exists
      this.commonService.selectedProjectID = null;
    } else {
      this.commonService.selectedProjectID = projectids;
    }

      // Go Back to Resume-Report page with array values after selecting multiple proects 
      this.router.navigate(['Report']);





    //  NOW IN  ngOnDestroy() working
    //   // CLEAR ALL PROPERTIES NEEDED FOR RESUME GENERATE(MUST BE INSIDE setTimeout FOR TIMING)
    //   // *************************************************************************************
    //   setTimeout(() => {

    //     // must clear id's here before opening form
    //     this.commonService.selectedEmpID = null;
    //     this.commonService.selectedProjectID = null;

    //     this.isDisabledEmpID = false; // enable the empcombo which was disabled for selected emp projects for report 
    //     this.empidSelect.handleClearClick();
    //     // this.commonService.selectedEmpID=null;
    //     this.srcEmpID = 0; // to select only the projects of selected epmloyee in report
    //     this.selectedEmpID = null;
    // }, 1);


   
  }


 ngOnDestroy() {

      // CLEAR ALL PROPERTIES NEEDED FOR RESUME GENERATE(MUST BE INSIDE setTimeout FOR TIMING)
      // else when going to another component without createresume button clicked, empid will not clear
      // ********************************************************************************************************
      setTimeout(() => {

        // must clear id's here before opening form
        this.commonService.selectedEmpID = null;
        this.commonService.selectedProjectID = null;

        this.isDisabledEmpID = false; // enable the empcombo which was disabled for selected emp projects for report 
        this.empidSelect.handleClearClick();
        // this.commonService.selectedEmpID=null;
        this.srcEmpID = 0; // to select only the projects of selected epmloyee in report
        this.selectedEmpID = null;
        this.dtPageLength = 25;
    }, 1);
  }



  public ngOnInit(): void {

    // when coming from report resume project selection
    if (this.commonService.selectedEmpID != null && this.commonService.reportname == 'Report_Resume') {
      this.selectedEmpID = this.commonService.selectedEmpID; // make the empcmb selected with the empid
      this.srcEmpID = this.commonService.selectedEmpID; // to select only the projects of selected epmloyee in report
      this.isDisabledEmpID = true;
      this.dtPageLength = -1;
      this.showLength=false; // to hide length cmb
      this.btnHidden="btnHidden2" // hidden button to control the left margin of search when hidden for selrct projeccts for resume
 
      // $("#empidSelectdiv .ng-select-container").css('background-color', '#dfdfdf');
      // $("#empidSelectdiv .ng-select-container").css('color', 'grey');



      // $("#empresumeprojectssearchontainer #dt_length").hide();
      // $(".dataTables_length").attr("hidden","true");

      //  $("#empresumeprojectssearchontainer  ::ng-deep #dt_length").css("visibility","hidden !important")
      //  let element = $('#dt_length');
      //  element.addClass('new-style'); // Add a new style class
      //  element.css("visibility","hidden"); // Apply direct CSS


    }

  
    //************************************************ */

    this.fillAllCmb();
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
      lengthChange: this.showLength,
      searching: true,
      pageLength: this.dtPageLength, // all
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
          // hidden button to control the left margin of search when hidden for selrct projeccts for resume
          text: '',
          className: this.btnHidden,
          action: function (e, dt, node, config) {
            that.clearSearch();//alert('Button activated');
            
          }
        },

      ],
      
      order: [[1, 'asc']], // 1 col is selected instead of 0 since 1 is hidden


      columnDefs: [
        // {
        // "orderable": true,
        // "targets": '_all',
        // },
        {
          "targets": [0], //6// center action column
          "className": "dt-center",//"text-center",
          "orderable": false,
          // "width": "4%"
        },
        
      ],



      ajax: (dataTablesParameters: any, callback: any) => {
        that.http.post<any>(
          // 'http://localhost:5000/api/employee/search/angular-datatable',
          // '' + that.commonService.baseUrl + '/api/empresumetext/search/angular-datatable',
          '' + that.commonService.baseUrl + '/api/proteam/proteam-angular-datatable-empresumeprojectssearchselect',

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

              // added from project search 20250803
              primaryprojecttype: this.srcPrimaryProjectType,
              projectrole: this.srcProjectRole,
              ownercategory: this.srcOwnerCategory,
              owner: this.srcOwner,
              client: this.srcClient,
              projectstatus: this.srcProjectStatus,
              excludeieprojects: this.srcExcludeIEProjects,
              excludeongoingprojects: this.srcExcludeOngoingProjects,


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


        {
          render: (data: any, type: any, row: any) => {
            return "<input type='checkbox' name='websitecheck' class='chkbx' >";
          }
        },   


        { data: 'ID', title: "ID", "className": "dt-center" }, 
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
        // 2025 common Datatable Row Select(highlight) function is not here for multiselect bottom 2 codeblocks are used now 

        // that.commonService.dtRowSelect(row)
        //********************************************************************************** */


        //*********************************************************************************************** */
        // THE BOTTOM 3 CODE BLOCKS ARE WORKING FOR MULTISELECT AND HIGHLIGHT ROWS WHEN CLICKING TD OR CHK
        //*********************************************************************************************** */

        //2024 created to select row background color when checkbox selected.checkall row color is done in checkuncheckall()
        //https://www.youtube.com/watch?v=ImDM9t2Cwsw        
        // $('input[type="checkbox"]:eq(0)', row).unbind('click');
        // $('input[type="checkbox"]:eq(0)', row).bind('change', function () { //in a:eq(0) "a" is used to specify the tag which will be clicked, and  :eq(0) is used to specify the col else whole row click will ire the event
        //   if ($(this).prop('checked')) {
        //     $(this).parent().parent().css('background-color', 'rgb(255 255 220)');
        //   }
        //   else {
        //     $(this).parent().parent().css('background-color', '#fff');
        //   }
        // });

 
        // to check when chkbox is clicked and change row highlight color
        // note chkbox prop has to set here along with highlight color because when "td" click is used chkbox click will not work
        $('input[type="checkbox"]:eq(0)', row).bind('click', function () { //in a:eq(0) "a" is used to specify the tag which will be clicked, and  :eq(0) is used to specify the col else whole row click will ire the event
          // $(this).closest('tr').find('input[type="checkbox"]').prop('checked', true);
          var chk = $(this).closest('tr').find('input[type="checkbox"]');
          var isChecked = $(chk).prop('checked');
          $(chk).prop('checked', !isChecked);

          if ($(chk).prop('checked')) {
            $(chk).parent().parent().css('background-color', 'rgb(255 255 220)');
          }
          else {
            $(chk).parent().parent().css('background-color', '#fff');
          }
        });


        // to check when "td" is clicked and change row highlight color for convienence
        $('td', row).bind('click', function () { //in a:eq(0) "a" is used to specify the tag which will be clicked, and  :eq(0) is used to specify the col else whole row click will ire the event
          // $(this).closest('tr').find('input[type="checkbox"]').prop('checked', true);
          var chk = $(this).closest('tr').find('input[type="checkbox"]'); // td or tr can be used as preference
          var isChecked = $(chk).prop('checked');
          $(chk).prop('checked', !isChecked);
          if ($(chk).prop('checked')) {
            $(chk).parent().parent().css('background-color', 'rgb(255 255 220)');
          }
          else {
            $(chk).parent().parent().css('background-color', '#fff');
          }
        });

        //*************************************************************************************** */
        //*************************************************************************************** */




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

    // this.srcEmpID = 0; // condition for report is used at the bottom
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

    this.projectidSelect.handleClearClick();    // clears city select
    this.srcProjectID=0;

    if (this.commonService.selectedEmpID == null) { // if not in report mode
       this.empidSelect.handleClearClick(); // clears country select
       this.srcEmpID=0;
    }
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







    // Fill all combos in one function using forkJoin of rxjx
    fillAllCmb() {
      // this.loading2=true;
      forkJoin([
      //   this.sub= this.projectSearchService.getCmbProjectType(), //observable 1
      //  this.sub2=  this.projectSearchService.getCmbProPRole(), //observable 2
      //  this.sub3=  this.projectSearchService.getCmbEmpMain(), //observable 3
      //  this.sub4=  this.projectSearchService.getCmbProOCategory(), //observable 4
      //  this.sub5=   this.projectSearchService.getCmbComMain(), //observable 5
      //  this.sub6=  this.projectSearchService.getCmbCaoMain(), //observable 6
      //  this.sub7=  this.projectSearchService.getCmbProStatus(), //observable 7
      //  this.sub8=  this.projectSearchService.getCmbEmpProjectRole(), //observable 8
      //  this.sub9=  this.projectSearchService.getCmbProposalMain(), //observable 9
      this.projectSearchService.getCmbProjectType(), //observable 1
      this.projectSearchService.getCmbProjectTypeMulti(), //observable 1
      this.projectSearchService.getCmbProPRole(), //observable 2
      this.projectSearchService.getCmbEmpMain(), //observable 3
      this.projectSearchService.getCmbProOCategory(), //observable 4
      this.projectSearchService.getCmbComMain(), //observable 5
      this.projectSearchService.getCmbCaoMain(), //observable 6
      this.projectSearchService.getCmbProStatus(), //observable 7
      this.projectSearchService.getCmbEmpProjectRole(), //observable 8
      this.projectSearchService.getCmbProposalMain(), //observable 9
      ]).subscribe(([CmbProProjectType,CmbProProjectTypeMulti,CmbProPRole,CmbEmpMain,CmbProOCategory,CmbComMain,CmbCaoMain,CmbProStatus,CmbEmpProjectRole,CmbProposalMain]) => {
        // When Both are done loading do something
        this.CmbProProjectType = CmbProProjectType;
        this.CmbProProjectTypeMulti = CmbProProjectTypeMulti;
        this.CmbProPRole = CmbProPRole;
        this.CmbEmpMain = CmbEmpMain;
        this.CmbProOCategory = CmbProOCategory;
        this.CmbComMain = CmbComMain;
        this.CmbCaoMain = CmbCaoMain;
        this.CmbProStatus = CmbProStatus;
        this.CmbEmpProjectRole = CmbEmpProjectRole;
        this.CmbProposalMain = CmbProposalMain;
        
        // // this.loading2=false;
        // // fill sec projecttype here so that it can use the data from CmbProProjectType to avoid duplicate call for projecttype
        // this.fillsecprojecttype();

        // // callJSForProSearch(); // already loaded in ngOnInit, but loaded again in fillcombo because multiselect is not loaded sometimes


      }, err => {
        alert(err.message);
        // alert("Problem filling Employee combos");
      });
      // if (!this.errors) {
      //   //route to new page
      // }

    }













}
