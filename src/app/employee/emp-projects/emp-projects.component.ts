// import { Component } from '@angular/core';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../../services/common.service';
// import { EmployeeService } from '../../services/employee/employee.service';
import { ProjectService } from '../../services/project/project.service';
import { ProteamService } from '../../services/project/proteam.service';
import { DatePipe, Location } from '@angular/common';// datepipe used to convert date format to show in html date element
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, forkJoin, of } from 'rxjs';
import { ProjectSearchService } from '../../services/project/project-search.service';
import * as moment from 'moment';
import tinymce from 'tinymce';
import { style } from '@angular/animations';

@Component({
  selector: 'app-emp-projects',
  templateUrl: './emp-projects.component.html',
  styleUrls: ['./emp-projects.component.css']
})
export class EmpProjectsComponent {
  constructor(private http: HttpClient,private projectSearchService: ProjectSearchService, private projectService: ProjectService, private proTeamService: ProteamService, public datePipe: DatePipe, private router: Router, public activatedRoute: ActivatedRoute, private commonService: CommonService) {
  }


  editorConfig = {
    //chatGPT TinyMCE needs to know where its plugins are stored locally (inside node_modules/tinymce/).
    // so add following 2 lines
    base_url: '/tinymce', // 👈 tells TinyMCE where to load resources
    suffix: '.min',       // 👈 uses tinymce.min.js and plugin.min.js
  
    height: 300,
    menubar: false,
    plugins: 'link image code lists textcolor contextmenu',
    toolbar: 'undo redo | bold italic | forecolor backcolor | alignleft aligncenter alignright | bullist numlist outdent indent | link image | code',
    content_style: 'body{font-family:Helvetica,Arial,sans-serif; font-size:14px;color: #2a2a2a}',
    contextmenu: 'copy paste',// for right click copy
    branding: false //to remove the logo
    }; 

    editorConfig2 = {
      //chatGPT TinyMCE needs to know where its plugins are stored locally (inside node_modules/tinymce/).
      // so add following 2 lines
      base_url: '/tinymce', // 👈 tells TinyMCE where to load resources
      suffix: '.min',       // 👈 uses tinymce.min.js and plugin.min.js
      editable_root :false,

      height: 300,
      menubar: false,
      plugins: 'link image code lists textcolor contextmenu',
      toolbar: false, //'undo redo | bold italic | forecolor backcolor | alignleft aligncenter alignright | bullist numlist outdent indent | link image | code',
      content_style: 'body{font-family:Helvetica,Arial,sans-serif;color:#2a2a2a; font-size:14px;cursor:default;background-color:#f4f4f4}',
      contextmenu: 'copy paste',// for right click copy
      branding: false //to remove the logo
      }; 

  @Input() childempid:any;
  // @Input() childprojectid: any;



  // dtOptions: DataTables.Settings = {};
  dtOptions: any = {}; // any is used instead of DataTables.Settings else datatable export buttons wont show

  // To refresh datatable with search parameters without using destroy
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective; //used "!" to avoid initialization of variable. Also can use strict:false in tsconfig.json

  proTeamData: any = []; // in angular should ([]) for array
  proteam:any={};
  formErrors: any = [{}];
  loading2: boolean = false;
  componentLoaded = false;
test:boolean=true;
  modalClicked = "editModal";

  count:any=0; //test

  
  //  cmbEmpDegree: any = ([]);
  //  cmbState: any = ([]);
  //  cmbCountry: any = ([]);
  CmbEmpProjectRole: any = ([]);
  CmbEmpMain: any = ([]);


  //ANGULAR FORMGROUP is used to pass Value to frm control without jquery and better error handling
  //ANGULAR VALIDATORS  https://angular.io/api/forms/Validators
  //*************************************************************************** */
  proTeamFormGroup = new FormGroup({
    id: new FormControl(0),
    empprojectrole: new FormControl(0, [Validators.required, Validators.min(1)]),
    secprojectrole: new FormControl(0),
    dutiesandresponsibilities: new FormControl(''),
    durationfrom: new FormControl(''),
    durationto: new FormControl(''),
    monthsofexp: new FormControl(''),
    notes: new FormControl(''),
    projectid: new FormControl(0),
    empid: new FormControl(0,[Validators.required, Validators.min(1)]),
  });

    // DurationFrom
    // DurationTo
    // DutiesAndResponsibilities
    // EmpID
    // EmpProjectRole
    // ID
    // MonthsOfExp
    // Notes
    // ProjectID
    // SecProjectRole
 

  // set the getters for validation fields. convenient to use in html for validation
  get empprojectrole() {
    return this.proTeamFormGroup.get('empprojectrole');
  }
  get empid() {
    return this.proTeamFormGroup.get('empid');
  }
  // get country() {
  //   return this.empDegreeFormGroup.get('country');
  // }



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
    // const table = $('#dt').DataTable();
    const table = $('.dt_emp_projects').DataTable();
    const column = table.column(colindex);
    column.visible(!column.visible());
      
  }



  resetColumns(){
    $( "#disProjectNo" ).prop( "checked", true );
    $( "#disEmployeeID" ).prop( "checked", false );
    $( "#DutiesAndResponsibilities" ).prop( "checked", true );
    $( "#EmpProjectRole" ).prop( "checked", false );
    $( "#SecProjectRole" ).prop( "checked", false );
    $( "#DurationFrom" ).prop( "checked", false );
    $( "#DurationTo" ).prop( "checked", false );
    $( "#MonthsOfExp" ).prop( "checked", false );
    $( "#Notes" ).prop( "checked", false );
    $( "#Action" ).prop( "checked", true );
  
    const table = $('.dt_emp_projects').DataTable();
    const column1 = table.column(0);
    column1.visible(true);
    const column2 = table.column(1);
    column2.visible(false);
    const column3 = table.column(2);
    column3.visible(true);
    const column4 = table.column(3);
    column4.visible(false);
    const column5 = table.column(4);
    column5.visible(false);
    const column6 = table.column(5);
    column6.visible(false);
    const column7 = table.column(6);
    column7.visible(false);
    const column8 = table.column(7);
    column8.visible(false);
    const column9 = table.column(8);
    column9.visible(false);
    const column10 = table.column(9);
    column10.visible(true);
  }



  ngOnInit() {
    // this.loadDatatableProTeam();

    // ngOnInit is called only once. So for all next calls Observable is used so that it can always listen
    // https://www.youtube.com/watch?v=b4zpvh_saic&list=PL1BztTYDF-QNrtkvjkT6Wjc8es7QB4Gty&index=65
    if (!this.componentLoaded) {
      // 2023 now calling from tab clicked
      this.loadDatatableProTeam(); //loadDatatableProTeam() has to be called for first time only. Then refreshDatatableEmpDegree() is called everytime
      // this.componentLoaded = false;
      this.componentLoaded = true; //2023 to avoid duplicate datatable on load

    }
 

    // // following observer code moved from ngOnInit() to ngAfterViewInit() since datatable instance is not created yet to be refreshed
    // this.activatedRoute.paramMap.subscribe((param) => {
    //   this.childempid = param.get('id')
    //   this.refreshDatatableEmpDegree();// refresh instance of angular-datatable
    // })

    // this.fillAllCmb();
    // this.fillAllCmb2();
    // this.fillCmbEmpDegree();
    // this.fillCmbState();
    // this.fillCmbCountry();
  }



// tab clicked in emp detail
proteamtabClicked(){
  // alert();
  // only fill cmb when tab clicked to make faster
  // this.loadDatatableProTeam();
  // this.fillAllCmb();
}
 











  /* to remove "no matching records found" even if angular-datatable is not empty */
  // https://github.com/l-lin/angular-datatables/issues/1260
  ngAfterViewInit(): void {
    var that = this;
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.on('draw.dt', function () {
        if (that.proTeamData.length > 0) {
          $('.dataTables_empty').remove();
        }
      });
    });
 
    
    // // ngOnInit is called only once. So for all next calls Observable is used so that it can always listen
    // // https://www.youtube.com/watch?v=b4zpvh_saic&list=PL1BztTYDF-QNrtkvjkT6Wjc8es7QB4Gty&index=65
    // // following observer code moved from ngOnInit() to here ngAfterViewInit()
    this.activatedRoute.paramMap.subscribe((param) => {
      // this.childprojectid = param.get('id')
      this.childempid = param.get('id')

      
      if (!this.componentLoaded) { //2023 to avoid duplicate datatable on load
      this.refreshDatatableProTeam();// now calling from Pro-detail// refresh instance of angular-datatable
      }
            this.componentLoaded = false; //2023 to avoid duplicate datatable on load

    })

  }





  // Refresh/reload Angular-Datatable. Following method must be used to reload angular-datatable since ngOnInit() is used to initilize table 
  // https://l-lin.github.io/angular-datatables/#/advanced/custom-range-search
  refreshDatatableProTeam() {
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
      searching: false,
      lengthChange: false,
      pageLength: 35,
      // lengthMenu: [ 10, 35, 50, 75, 100 ],
      // dom: 'Blfrtip', //'Bfrtip', use l before f to show length with bottons
      // // //"any" is used in "dtOptions" instead of DataTables.Settings else datatable export buttons wont show
      // buttons: [
      //     'lengthChange','copy', 'csv', 'excel', 'pdf', 'print'
      // ],


      // lengthMenu: [[15, 25, 50, -1], [15, 25, 50, "All"]],
      dom: 'Blfrtip',//'Blfrtip', //'Bfrtip', use l before f to show length with bottons
      // "any" is used in "dtOptions" instead of DataTables.Settings else datatable export buttons wont show
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
             $('#btnEmpProjectsColumnsModalShow').click();// table_emp_projects
           }
         },
         {
           text: 'Reset Columns',
           className: "btnReset",
           action: function (e, dt, node, config) {
             // that.clearSearch();//alert('Button activated');
             that.resetColumns();//alert('Button activated');
           }
         }

        // {
        //   text: 'Clear Search',
        //   className: "btnEmpProjects", // hidden for styling margin top of excel btn
        //   action: function (e, dt, node, config) {
        //     // that.clearSearch();//alert('Button activated');
        //     // that.showProTeamAddModal();//alert('Button activated');
        //   }
        // },

      ],
      

      ajax: (dataTablesParameters: any, callback: any) => {
        this.http.post<any>(
          // 'http://localhost:5000/api/empdegree/empdegree-angular-datatable/' + 145 + '',
          // 'http://localhost:5000/api/empdegree/empdegree-angular-datatable',
          '' + that.commonService.baseUrl + '/api/proteam/proteam-angular-datatable-newempprojects',
          Object.assign(dataTablesParameters,
            {
              // token: '',
              // projectid: this.childprojectid,//this.id, 
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
          this.proTeamData = resp.data; //use .data after resp for post method
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            // data: []
            // //https://stackoverflow.com/questions/57849250/angular-datatables-server-side-processing-and-buttons-extension-data-is-empty
            data:  resp.data  // set data
          });
          this.fillAllCmb();
          this.commonService.setButtonStatus(); // disable btn if no permission

        });
      },
 
      columnDefs: [
        // {
        // "orderable": true,
        // "targets": '_all',
        // },
        {
          "targets": 9, // center action column
          "className": "text-center",
          "orderable": false, // sort false for action column
          // "width": "4%"
        },
      ],



      columns: [

        // { data: '', title: "id" }, 
        // { data: 'ProjectID', title: "ProjectID", width: "50px", },
        // { data: 'EmpID', title: "empid", width: "50px","visible": false  },
        // { data: 'disEmployeeID', title: "EmployeeID", width: "80px" },
        {
          render: (data: any, type: any, row: any) =>  {
            // return "<a style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);'  href='/Empdetail/" + row.empid + "'>" + row.firstname + "</a> ";
            return "<a style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >" + row.disProjectNo + "</a> ";
          }, title: 'ProjectNo', width: "120px", "className": "dt-center" ,
        },

        {
          render: (data: any, type: any, row: any) =>  {
            // return "<a style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);'  href='/Empdetail/" + row.empid + "'>" + row.firstname + "</a> ";
            return "<a style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >" + row.disEmployeeID + "</a> ";
          }, title: 'EmployeeID', width: "120px","visible": false
        },
        
        { data: 'DutiesAndResponsibilities', title: "Duties and Responsibilities", width: "660px", },
        { data: 'disEmpProjectRole', title: "EmpProjectRole", width: "180px", "visible": false },
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
        {
          render: (data: any, type: any, row: any) => {
            // return "<a class='btn-detail' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Detail</a> | <a class='btn-edit' data-toggle='modal' data-target='#empeditmodal' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Edit</a> | <a class='btn-delete' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Delete</a>";
            return "<a class='btn-detail' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Detail</a> | <a class='btn-edit' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Edit</a> | <a class='btn-delete' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Delete</a>";

          }, title: 'Action', "className": "dt-center"
        },
      ],
 


      // columns: [
      //   { "data": "ProjectID", "visible": false },
      //   { "data": "EmpID", "visible": false },
      //   // to limit the string. https://stackoverflow.com/questions/31809932/datatable-cell-string-truncate
      //   {
      //     "data": "disEmployeeID", "mRender": function (data, type, row) {
      //       if (data.length > 70) {
      //         var trimmedString = data.substring(0, 70);
      //         // trimmedString + '...';
      //         return "<a onclick=$('#proteamhiddenempid').val(" + row.EmpID + "); id='proteamempdetailpage' style='cursor:pointer;color: #006fae'>" + trimmedString + '...' + "</a>"
      //       } else {
      //         return "<a onclick=$('#proteamhiddenempid').val(" + row.EmpID + "); id='proteamempdetailpage' style='cursor:pointer;color: #006fae'>" + data + "</a>";
      //       }
      //     }
      //   },


      //   // {
      //   // "data": "ProjectID", "render": function (data, type, row) {
      //   // return (
      //   //     "<a onclick=$('#reghiddenid').val("+row.ID +");$('#reghiddenopendetailpage').click(); style='cursor:pointer'>"+ data +"</a>"
      //   //     );
      //   //    }
      //   // }, 
      //   {
      //     "data": "disEmpProjectRole", "mRender": function (data) {
      //       if (data.length > 70) {
      //         var trimmedString = data.substring(0, 70);
      //         return trimmedString + '...';
      //       } else {
      //         return data;
      //       }
      //     }
      //   },
      //   {
      //     "data": "disSecProjectRole", "mRender": function (data) {
      //       if (data.length > 70) {
      //         var trimmedString = data.substring(0, 70);
      //         return trimmedString + '...';
      //       } else {
      //         return data;
      //       }
      //     }
      //   },
      //   { "data": "DutiesAndResponsibilities", "visible": false },

      //   // https://datatables.net/plug-ins/dataRender/datetime
      //   // https://datatables.net/forums/discussion/25196/render-date-and-retain-order-functionality-ajax-object
      //   {
      //     "data": "DurationFrom", "render": function (data, type, row) {
      //       if (data == null) { // to replace "Invalid Date" with "", happens when date field is NULL
      //         return "";
      //       }
      //       if (data == '1900-01-01 00:00:00') { // to replace "default Date"(put by html5 datepicker) with ""
      //         return "";
      //       }

      //       else {
      //         return (self.$moment(data).format("MM/DD/YYYY"));
      //       }
      //     }
      //   },

      //   {
      //     "data": "DurationTo", "render": function (data, type, row) {
      //       if (data == null) { // to replace "Invalid Date" with "", happens when date field is NULL
      //         return "";
      //       }
      //       if (data == '1900-01-01 00:00:00') { // to replace "default Date"(put by html5 datepicker) with ""
      //         return "";
      //       }
      //       else {
      //         return (self.$moment(data).format("MM/DD/YYYY"));
      //       }
      //     }
      //   },

      //   { "data": "MonthsOfExp" },
      //   { "data": "Notes", "visible": false },
      //   // { "data": "EmpID", "visible": false  },
      //   {
      //     "data": "ID", "render": function (data, type, row) {
      //       // ** with inline jquery no need to call function from outside vue(masterpage)
      //       return (
      //         "<a onclick=$('#proteamhiddenid').val(" + row.ID + "); id='proteamview' style='cursor:pointer'>View</a> | <a onclick=$('#proteamhiddenid').val(" + row.ID + ");  id='proteamedit' style='cursor:pointer'>Edit</a> | <a onclick=$('#proteamhiddenid').val(" + row.ID + ");  id='proteamdelete' style='cursor:pointer'>Delete</a>"
      //       );
      //     },
      //   } // end col ID


      // ] // end columns




      // ** Calling angular method from within datatable. Routerlink is more smoth than a tag since it swith between components 
      // https://stackoverflow.com/questions/47529333/render-column-in-data-table-with-routerlink
      // https://l-lin.github.io/angular-datatables/#/advanced/row-click-event
      // https://datatables.net/reference/option/rowCallback
      // buttons in same column //https://datatables.net/forums/discussion/56914/rowcallback-mode-responsive
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;


        // Datatable ROW SELECT(HIGHLIGHT) CODE now calling from commonService
        //********************************************************************************** */
        // $('td', row).bind('click', function () { //in a:eq(0) "a" is used to specify the tag which will be clicked, and  :eq(0) is used to specify the col else whole row click will ire the event
        //   $("#dt td").each(function () {
        //     $(this).parent().css('background-color', 'transparent');
        //   });
        //   $(this).parent().css('background-color', 'rgb(255 255 220)');
        // });

        that.commonService.dtRowSelect(row)
        //********************************************************************************** */



        // // Fix for col width: https://stackoverflow.com/questions/54612232/how-to-set-the-width-of-an-individual-column
        // setTimeout(() => {
        //   let itemColumn: any = document.querySelector('#proteamemployeeid');
        //   itemColumn.setAttribute('style', 'width: 15% !important;');
        // }, 100)

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




// Action column handlers connecting to angular methods directly from within jquatu table
rowFirstNameClickHandler(data:any) {
  // this.router.navigate(['/Empdetail/' + data.EmpID]);
  this.router.navigate(['/Projectdetail/' + data.ProjectID]);
}
rowDetailClickHandler(data:any) {
  // alert("Detail Handler: "+data.firstname+"");
  // this.router.navigate(['/Empdetail/' + data.ID]); //TODO

   this.showProTeamDetailModal(data.ID);

}
rowEditClickHandler(data:any) {
  // alert("Edit Handler: "+data.firstname+"");
    // this.showProTeamEditModal(data.ID) // for edit pass only data instead of data.empid
    // if (this.commonService.user_role === 'guest') { 
    //   alert("Need permission.");
    // }
    // else{
    //   this.showProTeamEditModal(data.ID)
    // }


    // ****TODO We will use common service to check role
    // We may also use data from uassecc_control table for detail role check for all module individually
    if (this.commonService.checkEditRole()) {
      this.showProTeamEditModal(data.ID)
    }

}
rowDeleteClickHandler(data:any) {
  // alert("Delete Handler: "+data.firstname+"");
  // this.deleteProTeam(data.ID);
  // if (this.commonService.user_role === 'guest' || this.commonService.user_role === 'user' ) {
  //   alert("Need permission.");
  // }
  // else {
  //   this.deleteProTeam(data.ID);
  // }

  if (this.commonService.checkDeleteRole()) {
    this.deleteProTeam(data.ID);
  }
}







  // showEmpDegreeChildModalAdd() {

  //   alert("showEmpDegreeChildModalAdd");

  // }




  clearForm(){
    this.proTeamFormGroup.controls['id'].setValue(0);
    this.proTeamFormGroup.controls['empid'].setValue(0);
    this.proTeamFormGroup.controls['projectid'].setValue(0);//(this.childprojectid);
    this.proTeamFormGroup.controls['empprojectrole'].setValue(0);
    this.proTeamFormGroup.controls['secprojectrole'].setValue(0);
    this.proTeamFormGroup.controls['dutiesandresponsibilities'].setValue('');
    this.proTeamFormGroup.controls['durationfrom'].setValue(null);
    this.proTeamFormGroup.controls['durationto'].setValue(null);
    this.proTeamFormGroup.controls['monthsofexp'].setValue('');
    this.proTeamFormGroup.controls['notes'].setValue('');

  }




  showProTeamAddModal() {


    // if (this.commonService.user_role === 'guest' || this.commonService.user_role === 'user' ) {
    //   alert("Need permission.");
    //   return;
    // }

    if (!this.commonService.checkAddRole()){
          return;
    }
   


    // alert("addModal");
    this.modalClicked = "addModal";
    // $('#btnProTeamEditModalShow').click();
    $('#btnEmpProjectsEditModalShow').click();
    $("#proteamempid").prop("disabled", false); 
    $("#monthsofexpproteam").prop("disabled", true); // field autogenerated


    // alert(this.childempid);


    // Now maxid is generated in backend
    // Get the maxid
    //***************************** */

    // let maxid = 0;
    // this.proTeamService.getMaxProTeamID().subscribe(resp => {

    //   maxid = resp[0].maxproteamid;

      // alert(maxid);

      //**employeeFormGroup control within the subscribe so tha values are set after maxid is retrieved from database  */
      // clear form group since same group is used for edit and add
      // Now formgroup is used instead of data object to pass value
      this.proTeamFormGroup.reset(); // to clear the previous validations
      // Manualy set default values since reset() will will turn values to null: // https://stackoverflow.com/questions/51448764/why-are-formgroup-controls-null-after-formgroup-reset
      // this.employeeFormGroup.controls['empid'].setValue(0);

      // this.proTeamFormGroup.controls['id'].setValue(maxid + 1);
      this.proTeamFormGroup.controls['id'].setValue(0);

      this.proTeamFormGroup.controls['empid'].setValue(0);
      this.proTeamFormGroup.controls['projectid'].setValue(0);//(this.childprojectid);
      this.proTeamFormGroup.controls['empprojectrole'].setValue(0);
      this.proTeamFormGroup.controls['secprojectrole'].setValue(0);
      this.proTeamFormGroup.controls['dutiesandresponsibilities'].setValue('');
      this.proTeamFormGroup.controls['durationfrom'].setValue(null);
      this.proTeamFormGroup.controls['durationto'].setValue(null);
      this.proTeamFormGroup.controls['monthsofexp'].setValue('');
      this.proTeamFormGroup.controls['notes'].setValue('');

 
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


    //     //Timeout is used to run following code after maxid is returned from database
    //     //************************************************************************************** */
    //     // let that=this;
    //     // setTimeout(function () {

    //       //  this.editData.empid= 0;
    //       //  this.editData.firstname= '';
    //       //  this.editData.lastname= '';
    //       //  this.editData.jobtitle= 0;
    //       //  this.editData.registration= 0; 

    //     // // clear form group since same group is used for edit and add
    //     // // Now formgroup is used instead of data object to pass value
    //     // that.employeeFormGroup.reset(); // to clear the previous validations
    //     // // Manualy set default values since reset() will will turn values to null: // https://stackoverflow.com/questions/51448764/why-are-formgroup-controls-null-after-formgroup-reset
    //     // // this.employeeFormGroup.controls['empid'].setValue(0);
    //     // that.employeeFormGroup.controls['empid'].setValue(maxid+1);
    //     // that.employeeFormGroup.controls['employeeid'].setValue('');//added 2023
    //     // that.employeeFormGroup.controls['firstname'].setValue('');
    //     // that.employeeFormGroup.controls['lastname'].setValue('');
    //     // that.employeeFormGroup.controls['middlei'].setValue('');//added 2023  
    //     // that.employeeFormGroup.controls['jobtitle'].setValue(0);
    //     // that.employeeFormGroup.controls['registration'].setValue(0);
    //     // that.employeeFormGroup.controls['hiredate'].setValue(null);  // should use null instead of ''
    //     // that.employeeFormGroup.controls['employee_consultant'].setValue(0);

    //     // }, 1000)


  }




  showProTeamEditModal(e:any) {

    this.clearForm(); //clear the form of previous edit data
    this.modalClicked="editModal"
    this.loading2=true;
    // $('#btnProTeamEditModalShow').click(); 
    $('#btnEmpProjectsEditModalShow').click(); 
    $("#proteamempid").attr("disabled", "disabled"); // disabled to avoid duplicate
    $("#monthsofexpproteam").prop("disabled", true); // field autogenerated


    this.proTeamService.getProTeam(e).subscribe(resp => {


      //this.editData = resp; //use .data after resp for post method. Now using FormFroup to put data
      // **FormFroup and FormControl is used to pass value to edit form instead of [(ngModel)]
      // this.empid=resp.empid; // to pass to child modal if used

      // this.empid = resp.EmpID; // to pass to child modal if used
     
      // this.empDegreeFormGroup.patchValue(resp); 
      // OR

      this.proTeamFormGroup.controls['id'].setValue(resp.ID);
      this.proTeamFormGroup.controls['empid'].setValue(resp.EmpID);
      this.proTeamFormGroup.controls['projectid'].setValue(resp.ProjectID);//(this.childprojectid);
      this.proTeamFormGroup.controls['empprojectrole'].setValue(resp.EmpProjectRole);
      this.proTeamFormGroup.controls['secprojectrole'].setValue(resp.SecProjectRole);
      this.proTeamFormGroup.controls['dutiesandresponsibilities'].setValue(resp.DutiesAndResponsibilities);
      // this.proTeamFormGroup.controls['durationfrom'].setValue(resp.DurationFrom);
      // this.proTeamFormGroup.controls['durationto'].setValue(resp.DurationTo);
      this.proTeamFormGroup.controls['monthsofexp'].setValue(resp.MonthsOfExp);
      this.proTeamFormGroup.controls['notes'].setValue(resp.Notes);

      // change date format using datepipe, else will not show in form
      var formattedDate1 = this.datePipe.transform(resp.DurationFrom, "yyyy-MM-dd");//output : 2018-02-13
      this.proTeamFormGroup.controls['durationfrom'].setValue(formattedDate1);
      var formattedDate2 = this.datePipe.transform(resp.DurationTo, "yyyy-MM-dd");//output : 2018-02-13
      this.proTeamFormGroup.controls['durationto'].setValue(formattedDate2);


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




  

  showProTeamDetailModal(e:any){

    // this.clearForm(); //clear the form of previous edit data
    // this.modalClicked="detailModal" // test 2025
    this.loading2=true;
    $('#proteamdetailmodalShow').click(); 
    $("#proteamempid").prop("disabled", false); // disabled to avoid duplicate


    this.proTeamService.getProTeamDetail(e).subscribe(resp => {

      //this.editData = resp; //use .data after resp for post method. Now using FormFroup to put data
      // **FormFroup and FormControl is used to pass value to edit form instead of [(ngModel)]
      // this.empid=resp.empid; // to pass to child modal if used
  
      // this.empid = resp.EmpID; // to pass to child modal if used

      //2025 formcontrol is used because without formcontrol tinymce editor not showing content in html
      this.proTeamFormGroup.controls['dutiesandresponsibilities'].setValue(resp.DutiesAndResponsibilities);

     this.proteam=resp;

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
  
    // if (!this.errors) {
    //   //route to new page
    // }
  
  }



  // saveEmp common for edit and add. Option to call 2 function from here 
  saveProTeam() {

    //   // check internet connection first
    //   var onlineOffline = navigator.onLine;
    //   if (onlineOffline===false) {
    //     alert("no internet connection");
    //     return;
    //   }
    if (this.modalClicked == "editModal") {
      this.updateProTeam();
    }
    if (this.modalClicked == "addModal") {
      this.addProTeam();
    }
  }





  // //  before using async await
  // // DUPLICATE EMPLOYEEID CHECK
  // // *****************************************************
  //  checkDuplicateEmployeeID(empid: any, projectid: any) {
  //   this.proTeamService.getDuplicateEmployeeID(empid, projectid).subscribe(resp => {
  //     this.count = resp[0].employeeidcount;
  //     // let count:any = resp[0].employeeidcount;
  //     // return count;


  //   },
  //     err => {
  //       this.loading2 = false;
  //       alert(err.message);
  //     });
  // }
  







// before using async await
//  addProTeam() {

//     this.loading2 = true;

//     // *** 2023 Note If date is cleared the it always has a value of '' which tries to save 0000-00-00 00:00:00 in mysql server resulting err;
//     // 2023 SO handle it in front end and save null when value is '' dont have to do antthing in backend
//     if (this.proTeamFormGroup.controls['durationfrom'].value === '') {//0000-00-00 00:00:00
//       this.proTeamFormGroup.controls['durationfrom'].setValue(null);
//     }
//     if (this.proTeamFormGroup.controls['durationto'].value === '') {//0000-00-00 00:00:00
//       this.proTeamFormGroup.controls['durationto'].setValue(null);
//     }


//     // DATE COMPARE CHECK
//     //************************************* */
//     let durationfrom: any = this.proTeamFormGroup.controls['durationfrom'].value;
//     let durationto: any = this.proTeamFormGroup.controls['durationto'].value;
//     if (durationfrom > durationto) {
//       this.loading2 = false;
//       alert("Duration to date must be greater than Durarion from date.");
//       return;
//     }


//     // DUPLICATE EMPLOYEEID CHECK
//     //**************************************************************************************** */
//     let count = this.checkDuplicateEmployeeID(this.proTeamFormGroup.controls['empid'].value, this.proTeamFormGroup.controls['projectid'].value);//test

//     // set timer is used to allow checkDuplicateEmployeeID function run first
//     setTimeout(() => {
//       // alert("before " + this.count);
//       if (this.count > 0) {
//         this.loading2 = false;
//         alert("Selected EmployeeID exists for this project.\nPlease select another EmployeeID.");
//         return;
//       }
//       else {

//         this.proTeamService.addProTeam(this.proTeamFormGroup.value).subscribe(resp => {
//           // $("#empeditmodal").modal("hide");
//           $("#btnProTeamEditCloseModal").click();
//           this.loading2 = false;
//           // this.refreshEmpDetail.next('somePhone'); //calling  loadEmpDetail() from parent component
//           //this.router.navigateByUrl('Empdetail/2') //navigate to AngularDatatable
//           // var a= this.getMaxId();
//           // this.router.navigateByUrl('Empdetail/' + a) //navigate to AngularDatatable // not working
//           this.refreshDatatableProTeam();
//         },
//           err => {
//             this.loading2 = false;
//             // Form Validation backend errors
//             if (err.status === 422 || err.status === 400) {
//               this.formErrors = err.error.errors;// alert(err.error.errors[0].msg);
//             }
//             else {
//               alert(err.message);
//             }
//           });

//       }

//     }, 100);

//   }




  // NOT USING now directly calling in the method
  // https://stackoverflow.com/questions/34104638/how-can-i-chain-http-calls-in-angular-2
  // Now using async await Note ".toPromise();" is also used
  // DUPLICATE EMPLOYEEID CHECK
  // **********************************************************************************
  async checkDuplicateEmployeeID(empid: any, projectid: any) {
    try {
      const resp = await this.proTeamService.getDuplicateEmployeeID(empid, projectid).toPromise();
      this.count = resp[0].employeeidcount;
    } catch (err
      ) {
      alert("Failed to check DuplicateEmployeeID! " + err);
      // return; 
      this.loading2 = false;
      throw err;
      // must throw error instesd of return else the following lines in the calling function will execute
    }
  }







  // https://stackoverflow.com/questions/34104638/how-can-i-chain-http-calls-in-angular-2
  // Now using async await and using checkDuplicateEmployeeID() which needs to be also ASYNC type
  async addProTeam() {

    // this.loading2 = true;


    // EMPTY DATE CHECK
    //************************************* */
    // // *** 2023 Note If date is cleared the it always has a value of '' which tries to save 0000-00-00 00:00:00 in mysql server resulting err;
    // // 2023 SO handle it in front end and save null when value is '' dont have to do antthing in backend
    // if (this.proTeamFormGroup.controls['durationfrom'].value === '') {//0000-00-00 00:00:00
    //   this.proTeamFormGroup.controls['durationfrom'].setValue(null);
    // }
    // if (this.proTeamFormGroup.controls['durationto'].value === '') {//0000-00-00 00:00:00
    //   this.proTeamFormGroup.controls['durationto'].setValue(null);
    // }


    // DATE COMPARE CHECK
    //************************************* */
    let durationfrom: any = this.proTeamFormGroup.controls['durationfrom'].value;
    let durationto: any = this.proTeamFormGroup.controls['durationto'].value;
    if (durationfrom > durationto) {
      this.loading2 = false;
      alert("Duration to date must be greater than Durarion from date.");
      return;
    }



    // GENERATE Months of experience
    //*************************************************************** */
    // let durationfrom1 = moment('2000-11-30 00:00:00');
    // let durationto1 = moment('2004-12-30 00:00:00');
    let durationfrom1 = moment(this.proTeamFormGroup.controls['durationfrom'].value);
    let durationto1 = moment(this.proTeamFormGroup.controls['durationto'].value);
    // let diffInMonth = durationto1.diff(durationfrom1, 'month');
    let diffInDays = durationto1.diff(durationfrom1, 'days');
    let result=Math.ceil(diffInDays/30);
    alert(diffInDays);  
    this.proTeamFormGroup.controls['monthsofexp'].setValue(result.toString());

    // Note: can also use Math.round() Method



    // Client side DUPLICATE EMPLOYEEID CHECK Using async await (Chaining).To prevent going to next request before 
    // completing this one Note: must use async fuction await keyword and usi .toPromise()
    // https://stackoverflow.com/questions/34104638/how-can-i-chain-http-calls-in-angular-2
    //************************************************************************************************************************* */

    try {
      let eid: any = this.proTeamFormGroup.controls['empid'].value;
      let pid: any = this.proTeamFormGroup.controls['projectid'].value;
      const resp = await this.proTeamService.getDuplicateEmployeeID(eid, pid).toPromise();
      this.count = resp[0].employeeidcount;
    } catch (error: any) {
      // alert("Error in checking DuplicateEmployeeID" + error.message);
      alert(error.message);
      this.loading2 = false;
      $("#btnProTeamEditCloseModal").click();
      throw error;// must throw error instesd of return else the following lines in the calling function will execute
    }
    
    if (this.count > 0) {
      this.loading2 = false;
      alert("Selected EmployeeID exists for this project.\nPlease select another EmployeeID.");
      return;
    }


    this.loading2 = true;


    // NOW EXECUTE ADD
    // ************************************************************************************
    this.proTeamService.addProTeam(this.proTeamFormGroup.value).subscribe(resp => {


      // Server side DUPLICATE EMPLOYEEID CHECK (we can turn off the client side check)
      if (resp.duplicateitemfound == true) {
        alert("Selected2 EmployeeID exists for this project.\nPlease select another EmployeeID.");
        this.loading2 = false;
        return;
      }


      // $("#empeditmodal").modal("hide");
      $("#btnProTeamEditCloseModal").click();
      this.loading2 = false;
      // this.refreshEmpDetail.next('somePhone'); //calling  loadEmpDetail() from parent component
      // this.router.navigateByUrl('Empdetail/2') //navigate to AngularDatatable
      // var a= this.getMaxId();
      // this.router.navigateByUrl('Empdetail/' + a) //navigate to AngularDatatable // not working
      this.refreshDatatableProTeam();
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



  updateProTeam() {

    // **FormFroup and FormControl is used to pass value to save form instead of [(ngModel)]
    this.loading2 = true;

    if (this.proTeamFormGroup.invalid) {
      this.loading2 = false;
      return;
    }

    // Handle date. If cleared in html the datepicker returns empty string "" and saves as '0000-00-00' in database 
    // which gives error while reading in form . So convert the date to "null" before saving empty string
    // if (this.employeeFormGroup.controls['hiredate'].value === '') {
    //   this.employeeFormGroup.controls['hiredate'].setValue(null);
    // }

    // *** 2023 Note If date is cleared the it always has a value of '' which tries to save 0000-00-00 00:00:00 in mysql server resulting err;
    // 2023 SO handle it in front end and save null when value is '' dont have to do antthing in backend
    if (this.proTeamFormGroup.controls['durationfrom'].value === '') {//0000-00-00 00:00:00
      this.proTeamFormGroup.controls['durationfrom'].setValue(null);
    }
    if (this.proTeamFormGroup.controls['durationto'].value === '') {//0000-00-00 00:00:00
      this.proTeamFormGroup.controls['durationto'].setValue(null);
    }








    // DATE COMPARE CHECK
    //************************************* */
    let durationfrom:any=this.proTeamFormGroup.controls['durationfrom'].value;
    let durationto:any=this.proTeamFormGroup.controls['durationto'].value;
    if(durationfrom >durationto){
      this.loading2 = false;
      alert("Duration to date must be greater than Durarion from date.");
      return;
    }




    // GENERATE Months of experience
    //*************************************************************** */
    // let durationfrom1 = moment('2000-11-30 00:00:00');
    // let durationto1 = moment('2004-12-30 00:00:00');
    let durationfrom1 = moment(this.proTeamFormGroup.controls['durationfrom'].value);
    let durationto1 = moment(this.proTeamFormGroup.controls['durationto'].value);
    // let diffInMonth = durationto1.diff(durationfrom1, 'month');
    let diffInDays = durationto1.diff(durationfrom1, 'days');
    let result = Math.ceil(diffInDays / 30);
    // alert(diffInDays);  
    this.proTeamFormGroup.controls['monthsofexp'].setValue(result.toString());

    // Note: can also use Math.round() Method




    // NOT USING now instead disabling EmployeeID control
    // DUPLICATE EMPLOYEEID CHECK
    // NOT USING now in update method(using in add) instead disabling EmployeeID control
    //**************************************************************************************** */
   






    this.proTeamService.updateProTeam(this.proTeamFormGroup.value).subscribe(resp => {
           
      // $("#empeditmodal").modal("hide");
      $("#btnProTeamEditCloseModal").click();
      // this.refreshEmployeeDatatable();
      // this.refreshEmpDetail.next('somePhone'); //calling  loadEmpDetail() from parent component
      this.refreshDatatableProTeam();
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



  deleteProTeam(proteamid: any) {

    if (confirm('Are you sure you want to delete this record?')) {
      // Delete it!
    } else {
      // Do nothing!
      return;
    }
     
    this.proTeamService.deleteProTeam(proteamid).subscribe(resp => {
      // $("#empeditmodal").modal("hide");
      // this.refreshEmployeeDatatable();
      // this.router.navigateByUrl('Employee') //navigate to AngularDatatable
      this.refreshDatatableProTeam();  // to refresh datatable after delete

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


    // Fill all combos in one function using forkJoin of rxjx
    // Fill all combos in one function using forkJoin of rxjx
    fillAllCmb() {
      this.loading2=true;
      forkJoin([

        this.projectSearchService.getCmbEmpProjectRole(), //observable 8
        this.projectSearchService.getCmbEmpMain(), //observable 3
        // this.projectsearchservice.getCmbProposalMain(), //observable 9
      ]).subscribe(([CmbEmpProjectRole,CmbEmpMain]) => {
        // When Both are done loading do something
        this.CmbEmpProjectRole = CmbEmpProjectRole;
        this.CmbEmpMain = CmbEmpMain;
        this.loading2=false;

      }, err => {
        alert(err.message);
        // alert("Problem filling Employee combos");
      });
      // if (!this.errors) {
      //   //route to new page
      // }

    }


}
