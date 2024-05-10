// import { Component } from '@angular/core';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../../services/common.service';
import { DatePipe, Location } from '@angular/common';// datepipe used to convert date format to show in html date element
import { ProjectService } from '../../services/project/project.service';
import { EmpprojectsService } from '../../services/employee/empprojects.service';


@Component({
  selector: 'app-emp-projects',
  templateUrl: './emp-projects.component.html',
  styleUrls: ['./emp-projects.component.css']
})
export class EmpProjectsComponent {
  
  constructor(private http: HttpClient,private empProjectService: EmpprojectsService,  private projectService: ProjectService,  public datePipe: DatePipe, private router: Router, public activatedRoute: ActivatedRoute, private commonService: CommonService) {
  }


    @Input() childempid:any;
    // @Input() childprojectid: any;


  // dtOptions: DataTables.Settings = {};
  dtOptions: any = {}; // any is used instead of DataTables.Settings else datatable export buttons wont show




  // To refresh datatable with search parameters without using destroy
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective; //used "!" to avoid initialization of variable. Also can use strict:false in tsconfig.json

  proteam:any={};
  empProjectsData: any = []; // in angular should ([]) for array
  formErrors: any = [{}];
  loading2: boolean = false;
  componentLoaded = false;

  modalClicked = "editModal";




  ngOnInit() {
    // this.loadDatatableProTeam();
    // alert("ngOnInit");
    // ngOnInit is called only once. So for all next calls Observable is used so that it can always listen
    // https://www.youtube.com/watch?v=b4zpvh_saic&list=PL1BztTYDF-QNrtkvjkT6Wjc8es7QB4Gty&index=65
    if (!this.componentLoaded) {
      this.loadDatatableEmpProjects(); //loadDatatableProTeam() has to be called for first time only. Then refreshDatatableEmpDegree() is called everytime
      // this.componentLoaded = false;
      this.componentLoaded = true; //2023 to avoid duplicate datatable on load

    }


    // // following observer code moved from ngOnInit() to ngAfterViewInit() since datatable instance is not created yet to be refreshed
    // this.activatedRoute.paramMap.subscribe((param) => {
    //   this.childempid = param.get('id')
    //   this.refreshDatatableEmpDegree();// refresh instance of angular-datatable
    // })

    // this.fillAllCmb();

  }



  /* to remove "no matching records found" even if angular-datatable is not empty */
  // https://github.com/l-lin/angular-datatables/issues/1260
  ngAfterViewInit(): void {

    // alert("ngAfterViewInit");
    var that = this;
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.on('draw.dt', function () {
        if (that.empProjectsData.length > 0) {
          $('.dataTables_empty').remove();
        }
      });
    });
 
    
    // // ngOnInit is called only once. So for all next calls Observable is used so that it can always listen
    // // https://www.youtube.com/watch?v=b4zpvh_saic&list=PL1BztTYDF-QNrtkvjkT6Wjc8es7QB4Gty&index=65
    // // following observer code moved from ngOnInit() to here ngAfterViewInit()
    this.activatedRoute.paramMap.subscribe((param) => {
      this.childempid = param.get('id')
      if (!this.componentLoaded) { //2023 to avoid duplicate datatable on load
        this.refreshDatatableEmpProjects();// refresh instance of angular-datatable
      }
      this.componentLoaded = false; //2023 to avoid duplicate datatable on load

    })

  }

  // Refresh/reload Angular-Datatable. Following method must be used to reload angular-datatable since ngOnInit() is used to initilize table 
  // https://l-lin.github.io/angular-datatables/#/advanced/custom-range-search
  refreshDatatableEmpProjects() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }



  loadDatatableEmpProjects() {

    var that = this;

    this.dtOptions = {
      pagingType: 'full_numbers',
      processing: true,
      serverSide: true,// server side processing
      searching: false,
      lengthChange: false,
      order: [[0, 'asc']],
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
          '' + that.commonService.baseUrl + '/api/empprojects/empprojects-angular-datatable',
          Object.assign(dataTablesParameters,
            {
              // token: '',
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
          this.empProjectsData = resp.data; //use .data after resp for post method
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            // data: []
            // //https://stackoverflow.com/questions/57849250/angular-datatables-server-side-processing-and-buttons-extension-data-is-empty
            data:  resp.data , // set data
           
          });
          // this.commonService.setButtonStatus(); // disable btn if no permission

        });
      },

      columnDefs: [
        // {
        // "orderable": true,
        // "targets": '_all',
        // },
        {
          "targets": 6, // center action column
          "className": "text-center",
          "orderable": false,
          // "width": "4%"
        },
      ],



      columns: [

        // { "data": "ProjectID", "visible": false },

        {
          render: (data: any, type: any, row: any) => {
            // return "<a style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);'  href='/Empdetail/" + row.empid + "'>" + row.firstname + "</a> ";
            return "<a style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >" + row.ProjectNo + "</a> ";
          }, title: 'ProjectNo'
        },

        // to limit the string. https://stackoverflow.com/questions/31809932/datatable-cell-string-truncate
        {
          "data": "ProjectName", "mRender": function (data: any, type: any, row: any) {
            if (data.length > 40) {
              var trimmedString = data.substring(0, 40);
              return trimmedString + '...';
            } else {
              return data;
            }
          }
        },
        {
          "data": "disEmpProjectRole", "mRender": function (data: any, type: any, row: any) {
            if (data.length > 70) {
              var trimmedString = data.substring(0, 70);
              return trimmedString + '...';
            } else {
              return data;
            }
          }
        },
        // {
        //   "data": "disSecProjectRole", "visible": false, "mRender": function (data: any, type: any, row: any) {
        //     if (data.length > 70) {
        //       var trimmedString = data.substring(0, 70);
        //       return trimmedString + '...';
        //     } else {
        //       return data;
        //     }
        //   } 
        // },
        // { "data": "DutiesAndResponsibilities", "visible": false },
        {
          render: (data: any, type: any, row: any) => {
            return this.datePipe.transform(row.DurationFrom, "MM/dd/yyyy");
          }, title: 'DurationFrom'
        },
        {
          render: (data: any, type: any, row: any) => {
            return this.datePipe.transform(row.DurationTo, "MM/dd/yyyy");
          }, title: 'DurationTo'
        },
        { "data": "MonthsOfExp", "className": "dt-center" },
        // { "data": "Notes", "visible": false },
        // { "data": "EmpID", "visible": false },

        {
          render: (data: any, type: any, row: any) => {
            return "<a class='btn-detail' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Detail</a>";
          }, title: '&nbsp;&nbsp; &nbsp;Action&nbsp; &nbsp; &nbsp; ', "className": "dt-center" 
        },

      ],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;

        // // Fix for col width: https://stackoverflow.com/questions/54612232/how-to-set-the-width-of-an-individual-column
        // setTimeout(() => {
        //   let itemColumn: any = document.querySelector('#empproject-projectno');
        //   itemColumn.setAttribute('style', 'width: 14% !important;');
        // }, 10)

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
        const eltdetail = $('td', row).find('a.btn-detail');
        if (eltdetail) {
          eltdetail.unbind('click');
          eltdetail.bind('click', () => {
            this.rowDetailClickHandler(data);

            // $('#empprojectsdetailmodalShow').click(); // can also call modal from here
          });
        }

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

 
    };
  }



// Action column handlers connecting to angular methods directly from within jquatu table
rowFirstNameClickHandler(data:any) {

  this.router.navigate(['/Projectdetail/' + data.ProjectID]);

    // Option1
    // this.router.navigate(['/Projectdetail/' + data.ProjectID]);
    // TO INITIALIZE MULTISELECT NEEDS PAGE REFRESH TO RUN JAVASCRIPT CODE IN Index.html
    //***************************************************************************************** */
    // setTimeout(() => {
    //   location.reload()
    // }, 0);

    // Option 2 smooth, takes time but no jumping
    // TO INITIALIZE MULTISELECT NEEDS PAGE REFRESH TO RUN JAVASCRIPT CODE IN Index.html
    //***************************************************************************************** */
    // window.location.href = '/Projectdetail/' + data.ProjectID;

}

rowDetailClickHandler(data:any) {
  // alert("Detail Handler: "+data.firstname+"");
  // this.router.navigate(['/Projectdetail/' + data.ProjectID]);
  // this.showProTeamEditModal(data) // for edit pass only data instead of data.empid
  // $('#empprojectsdetailmodalShow').click(); // using hidden btn in html to show modal
  // alert("data   "+data.ID);
  this.showEmpProjectsDetailModal(data.ID)

}

// rowEditClickHandler(data:any) {
//   // alert("Edit Handler: "+data.firstname+"");
//     this.showProTeamEditModal(data) // for edit pass only data instead of data.empid
// }

// rowDeleteClickHandler(data:any) {
//   // alert("Delete Handler: "+data.firstname+"");
//   this.deleteProTeam(data);
// }





showEmpProjectsDetailModal(e:any){

  // this.clearForm(); //clear the form of previous edit data
  // this.modalClicked="editModal"
  this.loading2=true;
  $('#empprojectsdetailmodalShow').click(); 
  this.empProjectService.getEmpProjectsDetail(e).subscribe(resp => {

    //this.editData = resp; //use .data after resp for post method. Now using FormFroup to put data
    // **FormFroup and FormControl is used to pass value to edit form instead of [(ngModel)]
    // this.empid=resp.empid; // to pass to child modal if used

    // this.empid = resp.EmpID; // to pass to child modal if used
   this.proteam=resp;
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










}
