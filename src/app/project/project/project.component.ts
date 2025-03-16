// import { Component } from '@angular/core';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../../services/common.service';
import { DatePipe } from '@angular/common';// datepipe used to convert date format to show in html date element

import { __values } from 'tslib';
import { Observable, forkJoin, of } from 'rxjs';
import { Router } from '@angular/router';
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
      // lengthMenu: [ 15, 35, 50, 75, 100 ],
      lengthMenu: [ [15, 25, 50, -1], [15, 25, 50, "All"] ],
      dom: 'Blfrtip',//'Blfrtip', //'Bfrtip', use l before f to show length with bottons
      // //"any" is used in "dtOptions" instead of DataTables.Settings else datatable export buttons wont show
      buttons: [
        // 'copy', 'csv', 'excel', 'pdf', 'print'
        'excel', 'csv', 'pdf', 'print',

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

        { data: "ProjectID", title: "ProjectID", visible: false },
        {
          render: (data: any, type: any, row: any) => {
            // return "<a style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);'  href='/Empdetail/" + row.empid + "'>" + row.firstname + "</a> ";
            return "<a style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >" + row.ProjectNo + "</a> ";
          }, title: 'ProjectNo'
        },
        {
          data: "ProjectName", "mRender": function (data: any, type: any, row: any) {
            if (data.length > 35) {
              var trimmedString = data.substring(0, 35);
              return trimmedString + '...';
            } else {
              return data;
            }
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


        { data: "ProjectRole",  },// width: "80px",// data: "disProjectRole",
        { data: "AwardYear", },  //   width: "80px"// visible: false,
        { data: "ProjectManager", visible: false },// "defaultContent": "" // to avoid showing error on null values
        { data: "OwnerCategory", visible: false }, // "defaultContent": "",// to avoid showing error on null values
        { data: "ComID", visible: false, },// defaultContent: "",visible: false

        {
          "data": "PrimaryProjectType", "defaultContent": "", "mRender": function (data: any, type: any, row: any) {
            // { "data": "disPrimaryProjectType","defaultContent": "","mRender": function(data, type, row) {
            if (data.length > 35) {
              var trimmedString = data.substring(0, 35);
              return trimmedString + '...';
            } else {
              return data;
            }
          }
        },
        { data: "SecondaryProjectType", defaultContent: "", visible: false },
        {
          "data": "Owner", "mRender": function (data: any, type: any, row: any) {
            // { "data": "disOwner","mRender": function(data, type, row) {
            if (data.length > 22) {
              var trimmedString = data.substring(0, 22);
              return trimmedString + '...';
            } else {
              return data;
            }
          }
        },
        { data: "Client", visible: false },//data: "disClient",// defaultContent: ""
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
          }, title: 'Action', class:'dt-center'
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



} 
