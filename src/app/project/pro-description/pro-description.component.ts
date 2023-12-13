// import { Component } from '@angular/core';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../../services/common.service';
// import { EmployeeService } from '../../services/employee/employee.service';
import { ProjectService } from '../../services/project/project.service';
// import { ProteamService } from '../../services/project/proteam.service';
import { ProdescriptionService } from '../../services/project/prodescription.service';

import { DatePipe, Location } from '@angular/common';// datepipe used to convert date format to show in html date element
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, forkJoin, of } from 'rxjs';
import { ProjectSearchService } from '../../services/project/project-search.service';

@Component({
  selector: 'app-pro-description',
  templateUrl: './pro-description.component.html',
  styleUrls: ['./pro-description.component.css']
})
export class ProDescriptionComponent {

  constructor(private http: HttpClient,private projectSearchService: ProjectSearchService, private projectService: ProjectService, private proDescriptionService: ProdescriptionService, public datePipe: DatePipe, private router: Router, public activatedRoute: ActivatedRoute, private commonService: CommonService) {
  }

  // @Input() childempid:any;
  @Input() childprojectid: any;



  // dtOptions: DataTables.Settings = {};
  dtOptions: any = {}; // any is used instead of DataTables.Settings else datatable export buttons wont show

  // To refresh datatable with search parameters without using destroy
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective; //used "!" to avoid initialization of variable. Also can use strict:false in tsconfig.json

  proDescriptionData: any = []; // in angular should ([]) for array
  prodescription:any={};
  formErrors: any = [{}];
  loading2: boolean = false;
  componentLoaded = false;
// test:boolean=true;
  modalClicked = "editModal";

  
  //  cmbEmpDegree: any = ([]);
  //  cmbState: any = ([]);
  //  cmbCountry: any = ([]);
  CmbProDescItem: any = ([]);
  // CmbEmpMain: any = ([]);


  //ANGULAR FORMGROUP is used to pass Value to frm control without jquery and better error handling
  //ANGULAR VALIDATORS  https://angular.io/api/forms/Validators
  //*************************************************************************** */
  proDescriptionFormGroup = new FormGroup({
    id: new FormControl(0),
    itemname: new FormControl(0, [Validators.required, Validators.min(1)]),
    description: new FormControl(''),
    descriptionplaintext: new FormControl(''),
    notes: new FormControl(''),
    projectid: new FormControl(0),
  });

// ID  
// ItemName  
// Description
// DescriptionPlainText
// Notes
// ProjectID
 

  // set the getters for validation fields. convenient to use in html for validation
  get itemname() {
    return this.proDescriptionFormGroup.get('itemname');
  }
  // get empid() {
  //   return this.proTeamFormGroup.get('empid');
  // }
  // get country() {
  //   return this.empDegreeFormGroup.get('country');
  // }


  ngOnInit() {
    // this.loadDatatableProTeam();

    // ngOnInit is called only once. So for all next calls Observable is used so that it can always listen
    // https://www.youtube.com/watch?v=b4zpvh_saic&list=PL1BztTYDF-QNrtkvjkT6Wjc8es7QB4Gty&index=65
    if (!this.componentLoaded) {
      this.loadDatatableProDescription(); //loadDatatableProTeam() has to be called for first time only. Then refreshDatatableEmpDegree() is called everytime
      this.componentLoaded = false;
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
prodescriptiontabClicked(){
  // alert();
  // only fill cmb when tab clicked to make faster
  // this.loadDatatableEmpDegree();
  // this.fillAllCmb();
}





  /* to remove "no matching records found" even if angular-datatable is not empty */
  // https://github.com/l-lin/angular-datatables/issues/1260
  ngAfterViewInit(): void {
    var that = this;
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.on('draw.dt', function () {
        if (that.proDescriptionData.length > 0) {
          $('.dataTables_empty').remove();
        }
      });
    });
 
    
    // // ngOnInit is called only once. So for all next calls Observable is used so that it can always listen
    // // https://www.youtube.com/watch?v=b4zpvh_saic&list=PL1BztTYDF-QNrtkvjkT6Wjc8es7QB4Gty&index=65
    // // following observer code moved from ngOnInit() to here ngAfterViewInit()
    this.activatedRoute.paramMap.subscribe((param) => {
      this.childprojectid = param.get('id')
      // this.refreshDatatableProDescription();//// now calling from Pro-detail// refresh instance of angular-datatable
    })




  }



  // Refresh/reload Angular-Datatable. Following method must be used to reload angular-datatable since ngOnInit() is used to initilize table 
  // https://l-lin.github.io/angular-datatables/#/advanced/custom-range-search
  refreshDatatableProDescription() {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }




  loadDatatableProDescription() {

    var that = this;

    this.dtOptions = {
      pagingType: 'full_numbers',
      processing: true,
      serverSide: true,// server side processing
      searching: false,
      lengthChange: false,
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
          '' + that.commonService.baseUrl + '/api/prodescription/prodescription-angular-datatable',
          Object.assign(dataTablesParameters,
            {
              // token: '',
              // projectid: this.childprojectid,//this.id, 
              projectid: this.childprojectid,//this.id, TEST
            }),
          {
            // ** Header is now coming from Auth.Inceptor file
            // headers: {
            // Authorization: "Bearer " + localStorage.getItem("token"),
            // Accept: "application/json" //the token is a variable which holds the token
            // }
          },
        ).subscribe(resp => {
          this.proDescriptionData = resp.data; //use .data after resp for post method
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            // data: []
            // //https://stackoverflow.com/questions/57849250/angular-datatables-server-side-processing-and-buttons-extension-data-is-empty
            data:  resp.data  // set data
           
          });
          this.fillAllCmb();

        });
        
      },
 
      columnDefs: [
        // {
        // "orderable": true,
        // "targets": '_all',
        // },
        {
          "targets": 2, // center action column
          "className": "text-center",
          "orderable": false,
          // "width": "4%"
        },
      ],

    //   "columns": [ 
    //     { "data": "ProjectID", "visible": false },
    //     { "data": "disItemName"},

    //     // Description(formatted text) is turned of for web version

    //     // { "data": "Description"},
    //     // { "data": "Description", "visible": false,"mRender": function(data) {
    //     //   if(data.length > 150){
    //     //       var trimmedString = data.substring(0, 150);
    //     //       return trimmedString + ' ...';
    //     //   } else {
    //     //       return data;
    //     //    }
    //     // }},
    //     { "data": "DescriptionPlainText","mRender": function(data) {
    //       if(data.length > 80){
    //           var trimmedString = data.substring(0, 80);
    //           return trimmedString + ' ...';
    //       } else {
    //           return data;
    //        }
    //     }},
    //     { "data": "DescriptionPlainText", "visible": false},
    //     { "data": "Notes", "visible": false},
    //     { "data": "ID", "render": function (data, type, row) {
    //             // ** with inline jquery no need to call function from outside vue(masterpage)
    //             return(    
    //                 "<a onclick=$('#prodeschiddenid').val("+row.ID +"); id='prodescview' style='cursor:pointer'>View</a> | <a onclick=$('#prodeschiddenid').val("+row.ID +");  id='prodescedit' style='cursor:pointer'>Edit</a> | <a onclick=$('#prodeschiddenid').val("+row.ID +");  id='prodescdelete' style='cursor:pointer'>Delete</a>"
    //             );
    //           },
    //     } // end col ID
       

    // ] // end columns

      columns: [

        // { data: "ID", "visible": false },
        // { data: "ProjectID", "visible": false },
        { data: "disItemName" },
        {
          data: "DescriptionPlainText", "mRender": function (data: any, type: any, row: any) {
            if (data.length > 60) {
              var trimmedString = data.substring(0, 60);
              return trimmedString + '...';
            } else {
              return data;
            }
          }, 
        
        }, 
        // { data: "DescriptionPlainText", "visible": false},
        // { data: "Notes", "visible": false},
        {
          render: (data: any, type: any, row: any) => {
            return "<a class='btn-detail' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Detail</a> | <a class='btn-edit' data-toggle='modal' data-target='#empeditmodal' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Edit</a> | <a class='btn-delete' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Delete</a>";
          }, title: 'Action',
        },

      ],


      // ** Calling angular method from within datatable. Routerlink is more smoth than a tag since it swith between components 
      // https://stackoverflow.com/questions/47529333/render-column-in-data-table-with-routerlink
      // https://l-lin.github.io/angular-datatables/#/advanced/row-click-event
      // https://datatables.net/reference/option/rowCallback
      // buttons in same column //https://datatables.net/forums/discussion/56914/rowcallback-mode-responsive
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        
        const self = this;

        // // Fix for col width: https://stackoverflow.com/questions/54612232/how-to-set-the-width-of-an-individual-column
        // setTimeout(()=>{
        //   let itemColumn:any = document.querySelector('#prodesc-item');
        //   itemColumn.setAttribute('style', 'width: 20% !important;');
        //   let actionColumn:any = document.querySelector('#prodesc-action');
        //   actionColumn.setAttribute('style', 'width: 14% !important;');
        // }, 200)


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
  this.router.navigate(['/Empdetail/' + data.EmpID]);
}
rowDetailClickHandler(data:any) {
  // alert("Detail Handler: "+data.firstname+"");
  // this.router.navigate(['/Empdetail/' + data.ID]); //TODO
   this.showProDescriptionDetailModal(data.ID);
}
rowEditClickHandler(data:any) {
  // alert("Edit Handler: "+data.firstname+"");
    // this.showProDescriptionEditModal(data.ID) // for edit pass only data instead of data.empid
    if (this.commonService.user_role === 'guest') { 
      alert("Need permission.");
    }
    else{
      this.showProDescriptionEditModal(data.ID) 
    }
}
rowDeleteClickHandler(data:any) {
  // alert("Delete Handler: "+data.firstname+"");
  // this.deleteProDescription(data.ID);
  if (this.commonService.user_role === 'guest' || this.commonService.user_role === 'user' ) {
    alert("Need permission.");
  }
  else {
    this.deleteProDescription(data.ID);
  }
}



showProDescriptionAddModal() {

  if (this.commonService.user_role === 'guest' || this.commonService.user_role === 'user' ) {
    alert("Need permission.");
    return;
  }

    this.modalClicked = "addModal";
    // $('#btnProTeamEditModalShow').click(); 
    $('btnproDescriptionEditModalShow').click(); 

    //Get the maxid
    //***************************** */
    let maxid = 0;
    this.proDescriptionService.getMaxProDescriptionID().subscribe(resp => {

      maxid = resp[0].maxprodescriptionid;

      //**employeeFormGroup control within the subscribe so tha values are set after maxid is retrieved from database  */
      // clear form group since same group is used for edit and add
      // Now formgroup is used instead of data object to pass value
      this.proDescriptionFormGroup.reset(); // to clear the previous validations
      // Manualy set default values since reset() will will turn values to null: // https://stackoverflow.com/questions/51448764/why-are-formgroup-controls-null-after-formgroup-reset
      // this.employeeFormGroup.controls['empid'].setValue(0);

      this.proDescriptionFormGroup.controls['id'].setValue(maxid + 1);
      this.proDescriptionFormGroup.controls['projectid'].setValue(this.childprojectid);//(this.childprojectid);
      this.proDescriptionFormGroup.controls['itemname'].setValue(0);
      this.proDescriptionFormGroup.controls['description'].setValue('');
      this.proDescriptionFormGroup.controls['descriptionplaintext'].setValue('');
      this.proDescriptionFormGroup.controls['notes'].setValue('');

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

showProDescriptionEditModal(e:any){

  this.clearForm(); //clear the form of previous edit data
  this.modalClicked = "editModal"
  this.loading2 = true;
      
  $('#btnproDescriptionEditModalShow').click();
  this.proDescriptionService.getProDescription(e).subscribe(resp => {

    //this.editData = resp; //use .data after resp for post method. Now using FormFroup to put data
    // **FormFroup and FormControl is used to pass value to edit form instead of [(ngModel)]
    // this.empid=resp.empid; // to pass to child modal if used

    // this.empid = resp.EmpID; // to pass to child modal if used

    // this.empDegreeFormGroup.patchValue(resp); 
    // OR

    this.proDescriptionFormGroup.controls['id'].setValue(resp.ID);
    this.proDescriptionFormGroup.controls['projectid'].setValue(resp.ProjectID);//(this.childprojectid);
    this.proDescriptionFormGroup.controls['itemname'].setValue(resp.ItemName);
    this.proDescriptionFormGroup.controls['description'].setValue(resp.Description);
    this.proDescriptionFormGroup.controls['descriptionplaintext'].setValue(resp.DescriptionPlainText);
    this.proDescriptionFormGroup.controls['notes'].setValue(resp.Notes);

    this.loading2 = false;
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

  // if (!this.errors) {
  //   //route to new page
  // }
}



showProDescriptionDetailModal(e:any){

      // this.clearForm(); //clear the form of previous edit data
    // this.modalClicked="editModal"
    this.loading2=true;
    $('#prodescriptiondetailmodalShow').click();

    this.proDescriptionService.getProDescriptionDetail(e).subscribe(resp => {

      //this.editData = resp; //use .data after resp for post method. Now using FormFroup to put data
      // **FormFroup and FormControl is used to pass value to edit form instead of [(ngModel)]
      // this.empid=resp.empid; // to pass to child modal if used

      // this.empid = resp.EmpID; // to pass to child modal if used
      this.prodescription = resp;

      this.loading2 = false;
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



  // saveEmp common for edit and add. Option to call 2 function from here 
  saveProDescription() {

    //   // check internet connection first
    //   var onlineOffline = navigator.onLine;
    //   if (onlineOffline===false) {
    //     alert("no internet connection");
    //     return;
    //   }
    if (this.modalClicked == "editModal") {
      this.updateProDescription();
    }
    if (this.modalClicked == "addModal") {
      this.addProDescription();
    }
  }




  addProDescription() {

    this.loading2 = true;

    this.proDescriptionService.addProDescription(this.proDescriptionFormGroup.value).subscribe(resp => {
      // $("#empeditmodal").modal("hide");
          
      $("#btnproDescriptionEditCloseModal").click();
      // this.refreshEmployeeDatatable();
      this.loading2 = false;
      // this.refreshEmpDetail.next('somePhone'); //calling  loadEmpDetail() from parent component
      // this.router.navigateByUrl('Employee') //navigate to AngularDatatable
      //this.router.navigateByUrl('Empdetail/2') //navigate to AngularDatatable
      // var a= this.getMaxId();
      // this.router.navigateByUrl('Empdetail/' + a) //navigate to AngularDatatable // not working

      this.refreshDatatableProDescription();
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



  updateProDescription() {

    // **FormFroup and FormControl is used to pass value to save form instead of [(ngModel)]
    this.loading2 = true;

    if (this.proDescriptionFormGroup.invalid) {
      this.loading2 = false;
      return;
    }

    this.proDescriptionService.updateDescription(this.proDescriptionFormGroup.value).subscribe(resp => {

      // $("#empeditmodal").modal("hide");
      $("#btnproDescriptionEditCloseModal").click();
      // this.refreshEmployeeDatatable();
      // this.refreshEmpDetail.next('somePhone'); //calling  loadEmpDetail() from parent component
      this.refreshDatatableProDescription();
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






  deleteProDescription(e: any) {
    if (confirm('Are you sure you want to delete this record?')) {
      // Delete it!
    } else {
      // Do nothing!
      return;
    }

    this.proDescriptionService.deleteProDescription(e).subscribe(resp => {
      // $("#empeditmodal").modal("hide");
      // this.refreshEmployeeDatatable();
      // this.router.navigateByUrl('Employee') //navigate to AngularDatatable
      this.refreshDatatableProDescription();  // to refresh datatable after delete

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

    // if (!this.errors) {
    //   //route to new page
    // }

  }




  clearForm() {
    this.proDescriptionFormGroup.controls['id'].setValue(0);
    this.proDescriptionFormGroup.controls['projectid'].setValue(0);//(this.childprojectid);
    this.proDescriptionFormGroup.controls['itemname'].setValue(0);
    this.proDescriptionFormGroup.controls['description'].setValue('');
    this.proDescriptionFormGroup.controls['descriptionplaintext'].setValue('');
    this.proDescriptionFormGroup.controls['notes'].setValue('');
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

        this.projectSearchService.getCmbProDescItem(), //observable 8
        // this.projectSearchService.getCmbEmpMain(), //observable 3
        // this.projectsearchservice.getCmbProposalMain(), //observable 9
      ]).subscribe(([CmbProDescItem]) => {
        // When Both are done loading do something
        this.CmbProDescItem = CmbProDescItem;
        // this.CmbEmpMain = CmbEmpMain;
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
