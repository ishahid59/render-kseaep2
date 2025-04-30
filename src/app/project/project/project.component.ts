// import { Component } from '@angular/core';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../../services/common.service';
import { DatePipe } from '@angular/common';// datepipe used to convert date format to show in html date element

import { __values } from 'tslib';
import { Observable, forkJoin, of } from 'rxjs';
import { Router } from '@angular/router';
import { style } from '@angular/animations';
// import { EmpEditModalComponent } from '../emp-edit-modal/emp-edit-modal.component';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})


export class ProjectComponent {


  constructor(private http: HttpClient, public datePipe: DatePipe,private router: Router,private commonService: CommonService) {
  }


    // dtOptions: DataTables.Settings = {};
    dtOptions: any = {}; // any is used instead of DataTables.Settings else datatable export buttons wont show

    // To refresh datatable with search parameters without using destroy
    @ViewChild(DataTableDirective, { static: false })
    datatableElement!: DataTableDirective; //used "!" to avoid initialization of variable. Also can use strict:false in tsconfig.json
  
  
    // table data
    myData: any = ([]); // in angular should ([]) for array
    empid: any = 0; // to pass to child modal if used
    cmbJobtitle: any = ([]);
    cmbRegistration: any = ([]);

 
    showAwardColumn = true;

    collist=[{"ListID":"test1","Str1":"test1"},{"ListID":"test1","Str1":"test1"},{"ListID":"test2","Str1":"test3"}]

  // // For Angular-Datatable reload. Following method must be used to reload angular-datatable since ngOnInit() is used to initilize table 
  // https://l-lin.github.io/angular-datatables/#/advanced/custom-range-search
  refreshEmployeeDatatable() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });

    
  }




  /* to remove "no matching records found" even if angular-datatable is not empty */
  // https://github.com/l-lin/angular-datatables/issues/1260
  ngAfterViewInit(): void {
    var that = this;
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.on('draw.dt', function () {
        if (that.myData.length > 0) {
          $('.dataTables_empty').remove();
        }
      });
    });

// test to remove hash https://www.youtube.com/watch?v=j1ZHuyhHApg
// history.pushState({id:1},'','/AngularDatatable')





  }

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

  public ngOnInit(): void {

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
      pageLength: 25,
      // lengthMenu: [ 15, 35, 50, 75, 100 ],
      lengthMenu: [ [15, 25, 50, -1], [15, 25, 50, "All"] ],
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
            $('#btnProColumnsModalShow').click();
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
        this.http.post<any>(
          // 'http://localhost:5000/api/employee/search/angular-datatable',
          '' + that.commonService.baseUrl + '/api/project/angular-datatable',

          // Adding custom parameters: https://stackoverflow.com/questions/49645200/how-can-add-custom-parameters-to-angular-5-datatables
          // using Object.assign to bundle dataTablesParameters and additionalparameters in 1 object so that an additional  
          // parameter can be used for post,last parameter is for header which is passes in request header instead of body
          Object.assign(dataTablesParameters,
            {
              token: '',
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
          
          this.commonService.setButtonStatus(); // disable btn if no permission
          // that.test()
        });
        
      },

      order: [[1, 'asc']], // 1 col is selected instead of 0 since 1 is hidden
      columnDefs: [
        // {
        // "orderable": true,
        // "targets": '_all',
        // },
        {
          "targets": 15, // center action column
          "className": "dt-center",//"text-center",
          "orderable": false,
          // "width": "4%"
        },
      ],


      columns: [
        { data: "ProjectID", title: "ProjectID", visible: false, },
        {
          render: (data: any, type: any, row: any) => {
            // return "<a style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);'  href='/Empdetail/" + row.empid + "'>" + row.firstname + "</a> ";
            return "<a style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >" + row.ProjectNo + "</a> ";
          }, title: 'ProjectNo',
        },
        // {
        //   data: "ProjectName", "mRender": function (data: any, type: any, row: any) {
        //     if (data.length > 40) {
        //       var trimmedString = data.substring(0, 40);
        //       // return  trimmedString + '...';
        //       // implement tooltip
        //        return '<span data-toggle="tooltip" title="' + data + '">' +  trimmedString + '...' + '</span>'
        //     } else {
        //       return data;
        //     }
        //   }
       

        // to automatically add '...' upto col width using css https://jsfiddle.net/5zbgpsre/23/
        {
          data: "ProjectName", "mRender": function (data: any, type: any, row: any) {
              // implement tooltip
               return '<span data-toggle="tooltip" title="' + data + '">' +  data + '' + '</span>'
          }
        },

            
        // {
        //   data: "ProjectName", "mRender": function (data: any, type: any, row: any) {
        //     if (data !=null) {
        //       if (data.length > 35) {
        //         var trimmedString = data.substring(0, 35);
        //         return trimmedString + '...';
        //       } else {
        //         return data;
        //       }
        //     }
        //     else {
        //       return data;
        //     }
        //   }
        // },


        { data: "ProjectRole" },// width: "80px",// data: "disProjectRole",
        { data: "AwardYear", visible: false },  //   width: "80px"// visible: false,
        { data: "ProjectManager", },// "defaultContent": "" // to avoid showing error on null values
        { data: "OwnerCategory", visible: false }, // "defaultContent": "",// to avoid showing error on null values
        { data: "ComID", visible: false, },// defaultContent: "",visible: false

        // {
        //   "data": "PrimaryProjectType", "defaultContent": "", "mRender": function (data: any, type: any, row: any) {
        //     // { "data": "disPrimaryProjectType","defaultContent": "","mRender": function(data, type, row) {
        //     // if (data.length > 35) {
        //     if (data && data.length > 28) { // to avoid length of null err if data is used
        //       var trimmedString = data.substring(0, 28);
        //       // return trimmedString + '...';
        //       // implement tooltip
        //       return '<span data-toggle="tooltip" title="' + data + '">' +  trimmedString + '...' + '</span>'
        //     } else {
        //       return data;
        //     }
        //   }
        // },


        // to automatically add '...' upto col width using css https://jsfiddle.net/5zbgpsre/23/
        {
          data: "PrimaryProjectType", "mRender": function (data: any, type: any, row: any) {
              // implement tooltip
               return '<span data-toggle="tooltip" title="' + data + '">' +  data + '' + '</span>'
          }
        },


        { data: "SecondaryProjectType", defaultContent: "", visible: false },
        // {
        //   "data": "Owner", "mRender": function (data: any, type: any, row: any) {
        //     // { "data": "disOwner","mRender": function(data, type, row) {
        //     if (data.length > 18) {
        //       var trimmedString = data.substring(0, 18);
        //       // return trimmedString + '...';
        //       // implement tooltip
        //       return '<span data-toggle="tooltip" title="' + data + '">' +  trimmedString + '...' + '</span>'             
        //     } else {
        //       return data;
        //     }
        //   }
        // },


        // to automatically add '...' upto col width using css https://jsfiddle.net/5zbgpsre/23/
        {
          data: "Owner", "mRender": function (data: any, type: any, row: any) {
              // implement tooltip
               return '<span data-toggle="tooltip" title="' + data + '">' +  data + '' + '</span>'
          }
        },

        // { data: "Client", },//data: "disClient",// defaultContent: ""
        // {
        //   "data": "Client", "mRender": function (data: any, type: any, row: any) {
        //     // { "data": "disOwner","mRender": function(data, type, row) {
        //     if (data.length > 16) {
        //       var trimmedString = data.substring(0, 16);
        //       // return trimmedString + '...';
        //       // implement tooltip
        //       return '<span data-toggle="tooltip" title="' + data + '">' +  trimmedString + '...' + '</span>'            
        //     } else {
        //       return data;
        //     }
        //   }
        // },


        // to automatically add '...' upto col width using css https://jsfiddle.net/5zbgpsre/23/
        {
          data: "Client", "mRender": function (data: any, type: any, row: any) {
              // implement tooltip
               return '<span data-toggle="tooltip" title="' + data + '">' +  data + '' + '</span>'
          }
        },


        { data: "ProjectAgreementNo", visible: false },
        { data: "ProjectStatus",visible: false }, // visible: false
        { data: "ProposalID", visible: false },

        // data: "disProposalID",
        // defaultContent: ""


        // {
        //   data: "ProjectID",
        //   // width: "100px",
        //   searchable: false,
        //   orderable: false,
        //   visible: false,
        //   render: function(data: any, type: any, row: any) {
        //     // return "<a href='/kseprojects/update_employee/'"+ data +"'/>Edit</a>"
        //     // return "<a  href='/kseprojects/update_employee/" + data + "'>Edit</a>"

        //     //return "<a  href='/kseprojects/employee_detail/" + data + "'>View</a> | <a  href='/kseprojects/update_employee/" + data + "/'>Edit</a>"

        //     return (
        //       // " <a onclick='openprodetailpage(" +
        //       // row.ProjectID +
        //       // ");' style='cursor:pointer'>View</a> | <a onclick='showproeditmodal(" +
        //       // row.ProjectID +
        //       // ");' style='cursor:pointer'>Edit</a>"

        //        // ** with inline jquery no need to call function from outside vue(masterpage)
        //        // not using now in search
        //       //"<a onclick=$('#prohiddenid').val("+row.ProjectID +");$('#hiddenopendetailpage').click(); style='cursor:pointer'>View</a> | <a onclick=$('#prohiddenid').val("+row.ProjectID +");$('#hiddenshoweditmodal').click(); style='cursor:pointer'>Edit</a> | <a onclick=$('#prohiddenid').val("+row.ProjectID +");$('#hiddendeleteemp').click(); style='cursor:pointer'>Delete</a>"

        //       ""
        //     );
        //   }
        // },

        {
          render: (data: any, type: any, row: any) => {
            return "<a class='btn-detail' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Detail</a> ";
          }, title: 'Action', class:'dt-center',  visible: false
        },

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
        // $('td', row).bind('click', function () { //in a:eq(0) "a" is used to specify the tag which will be clicked, and  :eq(0) is used to specify the col else whole row click will ire the event
        //   $("#dt td").each(function () {
        //     $(this).parent().css('background-color', 'transparent');
        //   });
        //   $(this).parent().css('background-color', 'rgb(255 255 220)');
        // });

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

    }; // end dtOptions
    
  } // end onInit()


// Action column handlers connecting to angular methods directly from within jquatu table
rowFirstNameClickHandler(data:any) {

  this.router.navigate(['/Projectdetail/' + data.ProjectID]);
    
    // TO INITIALIZE MULTISELECT NEEDS PAGE REFRESH TO RUN JAVASCRIPT CODE IN Index.html
    //***************************************************************************************** */
    // Option-1
    // setTimeout(() => {
    //   location.reload()
    // }, 0);

    // Option 2 smooth, takes time but no jumping
    //***************************************************************************************** */
    // window.location.href = '/Projectdetail/' + data.ProjectID;
}


rowDetailClickHandler(data:any) {
  // alert("Detail Handler: "+data.firstname+"");
  // this.router.navigate(['/Empdetail/' + data.EmpID]);
  this.router.navigate(['/Projectdetail/' + data.ProjectID]);
}

rowEditClickHandler(data:any) {
  // alert("Edit Handler: "+data.firstname+"");
  // this.showEmpEditModal(data) // for edit pass only data instead of data.empid
}

rowDeleteClickHandler(data:any) {
  // alert("Delete Handler: "+data.firstname+"");
  // this.deleteEmp(data);
}



viewEmp(e: any) {
  alert("view emp with id: " + e.empid);
  // console.log(e);
  this.router.navigate(['/Empdetail']);
}



  clearSearch() {
    $('#dt').DataTable().search('').draw();//clear dt text search input
    // this.search();
  }




  resetColumns(){
    // col visibility reset
    $( "#ProjectNo" ).prop( "checked", true );
    $( "#ProjectName" ).prop( "checked", true );
    $( "#ProjectRole" ).prop( "checked", true );
    $( "#AwardYear" ).prop( "checked", false );
    $( "#ProjectManager" ).prop( "checked", true );
    $( "#OwnerCategory" ).prop( "checked", false );
    $( "#ComID" ).prop( "checked", false );
    $( "#PrimaryProjectType" ).prop( "checked", true );
    $( "#SecondaryProjectType" ).prop( "checked", false );
    $( "#Owner" ).prop( "checked", true );
    $( "#Client" ).prop( "checked", true );
    $( "#ProjectAgreementNo" ).prop( "checked", false );
    $( "#ProjectStatus" ).prop( "checked", false );
    $( "#ProposalID" ).prop( "checked", false );

    const table = $('#dt').DataTable();
    const column1 = table.column(1);
    column1.visible(true);
    const column2 = table.column(2);
    column2.visible(true);
    const column3 = table.column(3);
    column3.visible(true);
    const column4 = table.column(4);
    column4.visible(false);
    const column5 = table.column(5);
    column5.visible(true);
    const column6 = table.column(6);
    column6.visible(false);
    const column7 = table.column(7);
    column7.visible(false);
    const column8 = table.column(8);
    column8.visible(true);
    const column9 = table.column(9);
    column9.visible(false);
    const column10 = table.column(10);
    column10.visible(true);
    const column11 = table.column(11);
    column11.visible(true);
    const column12 = table.column(12);
    column12.visible(false);
    const column13 = table.column(13);
    column13.visible(false);
    const column14 = table.column(14);
    column14.visible(false);
  }
  


} 
