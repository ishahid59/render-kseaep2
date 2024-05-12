// import { Component } from '@angular/core';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../../services/common.service';
import { EmployeeService } from '../../services/employee/employee.service';
import { ComService } from '../../services/com/com.service';
import { ProposalService } from '../../services/proposal/proposal.service';

import { EmployeeSearchService } from '../../services/employee/employee-search.service';

import { createUrlTreeFromSnapshot } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { __values } from 'tslib';
import { ThisReceiver } from '@angular/compiler';
import { DatePipe } from '@angular/common';// datepipe used to convert date format to show in html date element
import { cleanData, data } from 'jquery';
import { TestBed } from '@angular/core/testing';
// import * as moment from 'moment';
import { Observable, forkJoin, of } from 'rxjs';
import { Router } from '@angular/router';
// import { EmpEditModalComponent } from '../emp-edit-modal/emp-edit-modal.component';
// import { ComEditModalComponent } from '../com-edit-modal/com-edit-modal.component';
import { ProjectSearchService } from '../../services/project/project-search.service';

import {callJSForProposalDetail} from './jsforproposaldetail.js'; // test



@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.css']
})
export class ProposalComponent {

  constructor(private http: HttpClient,private proposalService: ProposalService,private projectSearchService: ProjectSearchService, private comService: ComService, public datePipe: DatePipe,private router: Router,private commonService: CommonService) {
  }


  // dtOptions: DataTables.Settings = {};
  dtOptions: any = {}; // any is used instead of DataTables.Settings else datatable export buttons wont show

  // To refresh datatable with search parameters without using destroy
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective; //used "!" to avoid initialization of variable. Also can use strict:false in tsconfig.json


  // table data
  myData: any = ([]); // in angular should ([]) for array
  proposal: any = {};  
  proposalid: any = 0; // to pass to child modal if used
  count: any = 0;


  CmbProProjectType: any = ([]);
  CmbCaoMain: any = ([]); 
  CmbProOCategory: any = ([]);  
  CmbEmpMain: any = ([]);  
  CmbProposalStatus: any = ([]);
  CmbProjectAwardStatus: any = ([]);

  formErrors: any = [{}];
  loading2: boolean = false;
  componentLoaded = false;
  modalClicked = "editModal";


  // DebriefingReceived
  // EstimatedFee
  // Owner
  // OwnerCategory
  // PresentationDate
  // PresentationTime
  // ProjectAwardStatus
  // ProjectName
  // ProjectRole
  // ProjectType
  // ProposalCoordinator
  // ProposalDueDate
  // ProposalDueTime
  // ProposalID
  // ProposalNo
  // PublicNoticeDate
  // SecondaryProjectType
  // SolicitationNo
  // SOQDueDate
  // SOQDueTime
  // Status
  // TechnicalLead

  
  //2024 t store display values of secondaryprojecttype
  dissecondaryprojecttype: any="";

  proposalFormGroup = new FormGroup({
      proposalid: new FormControl(0),
      projectname: new FormControl('', [Validators.required]),
      proposalno: new FormControl('', [Validators.required]),
      publicnoticedate: new FormControl(''),
      solicitationno: new FormControl(''),
      owner: new FormControl(0),
      ownercategory: new FormControl(0),
      projecttype: new FormControl(0),
      secondaryprojecttype: new FormControl(''),
      estimatedfee: new FormControl(''),
      
      proposalcoordinator: new FormControl(0),
      technicallead: new FormControl(0),
      presentationdate: new FormControl(''),
      presentationtime: new FormControl(''),
      soqduedate: new FormControl(''),
      soqduetime: new FormControl(''),
      proposalduedate: new FormControl(''),
      proposalduetime: new FormControl(''),
      status: new FormControl(0),
      projectawardstatus: new FormControl(''),
      debriefingreceived: new FormControl(0),
      projectrole: new FormControl(''),
});


  // set the getters for validation fields. convenient to use in html for validation
    get projectname() {
    return this.proposalFormGroup.get('projectname');
  }
  get proposalno() {
    return this.proposalFormGroup.get('proposalno');
  }




  clearMultiSelect3() {
    // $("#clearMultiSelect2").click();
    // $("#multiple-checkboxes2 option:selected").removeAttr("selected");
    // $("#multiple-checkboxes2 option[value='"+1+"']").prop('selected', false);
    // for (let index = 0; index < 35; index++) {

    //   //  alert(index )
    //   // $("#multiple-checkboxes option[value='" + index+ "']").attr("selected", "selected");
    //   $("#multiple-checkboxes2 option[value='"+index+"']").prop('selected', false);
    // }
    // // $("#multiple-checkboxes2").empty();


    // let items:any=[21,27,25,10];//this.secprojecttype;
    // // alert(resp.SecondaryProjectType)
    // for (let index = 0; index < items.length; index++) {
    //   // alert(items[index] )
    //   $("#multiple-checkboxes2 option[value='" + items[index] + "']").attr("selected", "selected");
    //   // $("#multiple-checkboxes2 option[value='"+items[index]+"']").prop('selected', true);
    // }
    // // (<any>$("#multiple-checkboxes")).multiselect('rebuild'); // **IMPORTANT
    // location.reload();


    // alert();
    // // (<any>$("#multiple-checkboxes2")).multiselect("clearSelection");
    // // for (let index = 0; index < items.length; index++) {
    //   // (<any>$("#multiple-checkboxes2")).multiselect("clearSelection");
    // for (let index = 0; index < 3; index++) {

    //    alert(index )
    //   // $("#multiple-checkboxes option[value='" + index+ "']").attr("selected", "selected");
    //   $("#multiple-checkboxes2 option[value='"+index+"']").prop('selected', false);
    // }
    // (<any>$("#multiple-checkboxes2")).multiselect('rebuild'); // **IMPORTANT

  }


  // not using (click)="reloadPage()",now page is loaded from url to refresh
  reloadPage() {
    // location.reload();
    $("#clearMultiSelect3").click();
  }






 // // For Angular-Datatable reload. Following method must be used to reload angular-datatable since ngOnInit() is used to initilize table 
  // https://l-lin.github.io/angular-datatables/#/advanced/custom-range-search
  refreshProposalDatatable() {
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
this.fillAllCmb();


  }



  // now using this.CmbProProjectType which is already filled
  fillsecprojecttype() {
    var items: any = [];
    items = this.CmbProProjectType;
    for (let i = 1; i < items.length; i++) {
      $('#multiple-checkboxes3').append("<option value=" + items[i].ListID + ">" + items[i].Str1 + "</option>"); //append to select itself
      //  (<any>$('#multiple-checkboxes')).append("<option value=" + items[i].label + ">" + items[i].title + "</option>"); //append to select itself
    }
    (<any>$("#multiple-checkboxes3")).multiselect('rebuild');

    // // WORKING
    // // var items: any = this.projectFormGroup.controls['secondaryprojecttype'].value;
    // // alert("items" + items)
    // // items = $('#secondaryprojecttype').val;
    // // alert("items" + x)
    // let items2: any = '21,27,25,10';//this.secprojecttype;

    // $.each(items2.split(','), function (idx, val) {
    //   $("#multiple-checkboxes3 option[value='" + val + "']").attr("selected", "selected");
    //   // $("#multiple-checkboxes option[value='"+val+"']").prop('selected', true); // use prop for latest jquery
    // });
    // (<any>$("#multiple-checkboxes3")).multiselect('rebuild'); // **IMPORTANT

  }








  public ngOnInit(): void {

    callJSForProposalDetail();

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
          '' + that.commonService.baseUrl + '/api/proposal/angular-datatable',

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
          // this.fillAllCmb();
          this.commonService.setButtonStatus(); // disable btn if no permission

        });
        
      },

      order: [[0, 'asc']], // 1 col is selected instead of 0 since 1 is hidden
      columnDefs: [
        // {
        // "orderable": true,
        // "targets": '_all',
        // },
        {
          "targets": 5, // center action column
          "className": "dt-center",//"text-center",
          "orderable": false,
          // "width": "4%"
        },
      ],


      columns: [

          // { data: "ProposalID", title: "ProposalID", visible: false },
          // { data: "ProposalNo" ,width:"80px"},  //   width: "80px"// visible: false,
          // {
          //   render: (data: any, type: any, row: any) => {
          //     // return "<a style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);'  href='/Empdetail/" + row.empid + "'>" + row.firstname + "</a> ";
          //     return "<a style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >" + row.ProjectName + "</a> ";
          //   }, title: 'Name',width:"250px"
          // },

          {
            render: (data: any, type: any, row: any) => {
              // return "<a style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);'  href='/Empdetail/" + row.empid + "'>" + row.firstname + "</a> ";
              return "<a style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >" + row.ProposalNo + "</a> ";
            }, title: 'ProposalNo'
          },
          {
            data: "ProjectName", "mRender": function (data: any, type: any, row: any) {
              if (data.length > 50) {
                var trimmedString = data.substring(0, 50);
                return trimmedString + '...';
              } else {
                return data;
              }
            }
          },

          { data: "ProjectType" ,width:"80px"},  //   width: "80px"// visible: false,
          { data: "Owner" ,width:"80px" },  //   width: "80px"// visible: false,
          { data: "OwnerCategory" ,width:"80px" },  //   width: "80px"// visible: false,
          {
            render: (data: any, type: any, row: any) => {
              // return "<a class='btn-detail' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Detail</a> ";
              return "<a class='btn-detail' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Detail</a> | <a class='btn-edit' data-toggle='modal' data-target='#empeditmodal' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Edit</a> | <a class='btn-delete' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Delete</a>";
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

  // this.router.navigate(['/Comdetail/' + data.ComID]);
  this.showProposalDetailModal(data.ProposalID);


    
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
  // this.router.navigate(['/Comdetail/' + data.ComID]);
  this.showProposalDetailModal(data.ProposalID);
}

rowEditClickHandler(data:any) {
  // alert("Edit Handler: "+data.firstname+"");
  // this.showEmpEditModal(data) // for edit pass only data instead of data.empid
  if (this.commonService.checkEditRole()) {
    this.showProposalEditModal(data.ProposalID)
  }
}



rowDeleteClickHandler(data:any) {
  // alert("Delete Handler: "+data.firstname+"");
  // this.deleteEmp(data);
  if (this.commonService.checkDeleteRole()) {
    this.deleteProposal(data.ProposalID);
  }
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


  clearForm() {
    // // this.proDacFormGroup.controls['id'].setValue(maxid + 1);
    this.proposalFormGroup.controls['proposalid'].setValue(0);//(this.childprojectid);
    this.proposalFormGroup.controls['projectname'].setValue('');
    this.proposalFormGroup.controls['proposalno'].setValue('');
    this.proposalFormGroup.controls['publicnoticedate'].setValue('');
    this.proposalFormGroup.controls['solicitationno'].setValue('');
    this.proposalFormGroup.controls['owner'].setValue(0);
    this.proposalFormGroup.controls['ownercategory'].setValue(0);
    this.proposalFormGroup.controls['projecttype'].setValue(0);
    this.proposalFormGroup.controls['secondaryprojecttype'].setValue('');
    this.proposalFormGroup.controls['estimatedfee'].setValue('');
    this.proposalFormGroup.controls['proposalcoordinator'].setValue(0);
    this.proposalFormGroup.controls['technicallead'].setValue(0);
    this.proposalFormGroup.controls['presentationdate'].setValue('');
    this.proposalFormGroup.controls['presentationtime'].setValue('');
    this.proposalFormGroup.controls['soqduedate'].setValue('');
    this.proposalFormGroup.controls['soqduetime'].setValue('');
    this.proposalFormGroup.controls['proposalduedate'].setValue('');
    this.proposalFormGroup.controls['proposalduetime'].setValue('');
    this.proposalFormGroup.controls['status'].setValue(0);
    this.proposalFormGroup.controls['projectawardstatus'].setValue('');
    this.proposalFormGroup.controls['debriefingreceived'].setValue(0);
    this.proposalFormGroup.controls['projectrole'].setValue('');



    $("#projectrroledetailP").prop('checked', false);
    $("#projectrroledetailS").prop('checked', false);
    $("#projectrroledetailJV").prop('checked', false);

  }





  showProposalAddModal() {

    // if (this.commonService.user_role === 'guest' || this.commonService.user_role === 'user' ) {
    //   alert("Need permission.");
    //   return;
    // }

    if (!this.commonService.checkAddRole()) {
      return;
    }

    this.modalClicked = "addModal";
    // $('#btnProTeamEditModalShow').click(); 
    $('#btnProposalEditModalShow').click();
    $("#proposalnoedit").prop("disabled", false); // disabled to avoid duplicate

    // Now maxid is generated in backend
    // Get the maxid
    //***************************** */
    // let maxid = 0;
    // this.proDescriptionService.getMaxProDescriptionID().subscribe(resp => {

    // maxid = resp[0].maxprodescriptionid;

    //**employeeFormGroup control within the subscribe so tha values are set after maxid is retrieved from database  */
    // clear form group since same group is used for edit and add
    // Now formgroup is used instead of data object to pass value
    this.proposalFormGroup.reset(); // to clear the previous validations
    // Manualy set default values since reset() will will turn values to null: // https://stackoverflow.com/questions/51448764/why-are-formgroup-controls-null-after-formgroup-reset
    // this.employeeFormGroup.controls['empid'].setValue(0);

    // this.proDescriptionFormGroup.controls['id'].setValue(maxid + 1);
    this.proposalFormGroup.controls['proposalid'].setValue(0);//(this.childprojectid);
    this.proposalFormGroup.controls['projectname'].setValue('');
    this.proposalFormGroup.controls['proposalno'].setValue('');
    this.proposalFormGroup.controls['publicnoticedate'].setValue('');
    this.proposalFormGroup.controls['solicitationno'].setValue('');
    this.proposalFormGroup.controls['owner'].setValue(0);
    this.proposalFormGroup.controls['ownercategory'].setValue(0);
    this.proposalFormGroup.controls['projecttype'].setValue(0);
    this.proposalFormGroup.controls['secondaryprojecttype'].setValue('');
    this.proposalFormGroup.controls['estimatedfee'].setValue('');
    this.proposalFormGroup.controls['proposalcoordinator'].setValue(0);
    this.proposalFormGroup.controls['technicallead'].setValue(0);
    this.proposalFormGroup.controls['presentationdate'].setValue('');
    this.proposalFormGroup.controls['presentationtime'].setValue('');
    this.proposalFormGroup.controls['soqduedate'].setValue('');
    this.proposalFormGroup.controls['soqduetime'].setValue('');
    this.proposalFormGroup.controls['proposalduedate'].setValue('');
    this.proposalFormGroup.controls['proposalduetime'].setValue('');
    this.proposalFormGroup.controls['status'].setValue(0);
    this.proposalFormGroup.controls['projectawardstatus'].setValue('');
    this.proposalFormGroup.controls['debriefingreceived'].setValue(0);
    this.proposalFormGroup.controls['projectrole'].setValue('');

    // clearSelection from multiselect dropdown first before filling new values for add 
    (<any>$("#multiple-checkboxes3")).multiselect('clearSelection'); // **IMPORTANT

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

  }



  showProposalEditModal(e: any) {


    // alert("from edit");
    // if (this.commonService.user_role === 'guest') { 
    //   alert("Need permission.");
    //   return;
    // }


    if (!this.commonService.checkEditRole()) {
      return;
    }

    this.clearForm(); //clear the form of previous edit data
    this.modalClicked = "editModal"
    this.loading2 = true;
    $('#btnProposalEditModalShow').click();
    $("#proposalnoedit").prop("disabled", true); // disabled to avoid duplicate


    // $('#btnProDacEditModalShow').click(); 
    this.proposalService.getProposal(e).subscribe(resp => {

      // this.editData = resp; //use .data after resp for post method. Now using FormFroup to put data
      // **FormFroup and FormControl is used to pass value to edit form instead of [(ngModel)]
      // this.empid=resp.empid; // to pass to child modal if used
      // this.empid = resp.EmpID; // to pass to child modal if used

      // this.empDegreeFormGroup.patchValue(resp); 
      // OR

      // this.proDacFormGroup.controls['id'].setValue(maxid + 1);

      this.proposalFormGroup.controls['proposalid'].setValue(resp.ProposalID);//(this.childprojectid);
      this.proposalFormGroup.controls['projectname'].setValue(resp.ProjectName);
      this.proposalFormGroup.controls['proposalno'].setValue(resp.ProposalNo);
      // this.proposalFormGroup.controls['publicnoticedate'].setValue(resp.PublicNoticeDate);
      this.proposalFormGroup.controls['solicitationno'].setValue(resp.SolicitationNo);
      this.proposalFormGroup.controls['owner'].setValue(resp.Owner);
      this.proposalFormGroup.controls['ownercategory'].setValue(resp.OwnerCategory);
      this.proposalFormGroup.controls['projecttype'].setValue(resp.ProjectType);
      this.proposalFormGroup.controls['secondaryprojecttype'].setValue(resp.SecondaryProjectType);
      this.proposalFormGroup.controls['estimatedfee'].setValue(resp.EstimatedFee);
      this.proposalFormGroup.controls['proposalcoordinator'].setValue(resp.ProposalCoordinator);
      this.proposalFormGroup.controls['technicallead'].setValue(resp.TechnicalLead);
      // this.proposalFormGroup.controls['presentationdate'].setValue(resp.PresentationDate);
      this.proposalFormGroup.controls['presentationtime'].setValue(resp.PresentationTime);
      // this.proposalFormGroup.controls['soqduedate'].setValue(resp.SOQDueDate);
      this.proposalFormGroup.controls['soqduetime'].setValue(resp.SOQDueTime);
      // this.proposalFormGroup.controls['proposalduedate'].setValue(resp.ProposalDueDate);
      this.proposalFormGroup.controls['proposalduetime'].setValue(resp.ProposalDueTime);
      this.proposalFormGroup.controls['status'].setValue(resp.Status);
      this.proposalFormGroup.controls['projectawardstatus'].setValue(resp.ProjectAwardStatus);
      this.proposalFormGroup.controls['debriefingreceived'].setValue(resp.DebriefingReceived);
      this.proposalFormGroup.controls['projectrole'].setValue(resp.ProjectRole);


      // change date format using datepipe, else will not show in form
      // let x=this.proTeamFormGroup.controls['durationfrom'].value;
      var formattedDate1 = this.datePipe.transform(resp.PublicNoticeDate, "yyyy-MM-dd");//output : 2018-02-13
      this.proposalFormGroup.controls['publicnoticedate'].setValue(formattedDate1);
      var formattedDate2 = this.datePipe.transform(resp.PresentationDate, "yyyy-MM-dd");//output : 2018-02-13
      this.proposalFormGroup.controls['presentationdate'].setValue(formattedDate2);
      
      var formattedDate3 = this.datePipe.transform(resp.SOQDueDate, "yyyy-MM-dd");//output : 2018-02-13
      this.proposalFormGroup.controls['soqduedate'].setValue(formattedDate3);
      var formattedDate4 = this.datePipe.transform(resp.ProposalDueDate, "yyyy-MM-dd");//output : 2018-02-13
      this.proposalFormGroup.controls['proposalduedate'].setValue(formattedDate4);



      
      // clearSelection from multiselect dropdown first before fill 
      (<any>$("#multiple-checkboxes3")).multiselect('clearSelection'); // **IMPORTANT



      
      //********************************************************************************************* */
      // SELECT ITEMS IN MULTISELECT DROPDOWN from coma sepaerted values of SecondaryProjectType     
      //********************************************************************************************* */

      // //WORKING
      // let items2: any = '21,27,25,10';//this.secprojecttype;
      let items2: any = this.proposalFormGroup.controls['secondaryprojecttype'].value;// must use .toString() 
      $.each(items2.split(','), function (idx, val) {
        // $("#multiple-checkboxes3 option[value='" + val + "']").attr("selected", "selected");
        $("#multiple-checkboxes3 option[value='" + val + "']").prop('selected', true); // use prop for latest jquery
      });
      (<any>$("#multiple-checkboxes3")).multiselect('rebuild'); // **IMPORTANT

      //**************************************************************************** */




      //*************************************************************** */
      // Select Project roles
      //*************************************************************** */

      // let prole='';
      $("#projectrroleP").prop('checked', false);
      $("#projectrroleS").prop('checked', false);
      $("#projectrroleJV").prop('checked', false);

      let str: any = this.proposalFormGroup.controls['projectrole'].value;//"J,V";
      let mainarr: any = str.split(','); //convert comma seperated string secondaryprojecttype values to array
      for (let i = 0; i < mainarr.length; i++) {
        if (mainarr[i] == 'P') {
          $("#projectrroleP").prop('checked', true);
          // prole="P";
        }
        if (mainarr[i] == 'S') {
          $("#projectrroleS").prop('checked', true);
          // prole=prole+",S"
        }
        if (mainarr[i] == 'JV') {
          $("#projectrroleJV").prop('checked', true);
          // prole=prole+",JV"
        }
      }
      // this.proposalFormGroup.controls['projectrole'].setValue(prole);

      //*************************************************************** */





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





  showProposalDetailModal(e: any) {

    // this.clearForm(); //clear the form of previous edit data
    // this.modalClicked="editModal"
    this.loading2 = true;
    $('#proposaldetailmodalShow').click();
    $("#proteamempid").prop("disabled", false); // disabled to avoid duplicate

    this.proposalService.getProposalDetail(e).subscribe(resp => {

      // this.editData = resp; //use .data after resp for post method. Now using FormFroup to put data
      // **FormFroup and FormControl is used to pass value to edit form instead of [(ngModel)]
      // this.empid=resp.empid; // to pass to child modal if used
      // this.empid = resp.EmpID; // to pass to child modal if used
      this.proposal = resp;

      // return;
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



      // Convert ids to text for secondaryprojecttype
      //*************************************************************** */

      // this.fillProjectTypeCmb()
      
      this.dissecondaryprojecttype=''      

      // setTimeout(() => { // used to wait for fillProjectTypeCmb before getting values of projecttype
        let str = this.proposal.SecondaryProjectType; //"1,2";
        let mainarr =  str.split(','); //convert comma seperated string secondaryprojecttype values to array
        let arr = this.CmbProProjectType; //get array from cmb
        for (let i = 0; i < mainarr.length; i++) {
          for (let j = 0; j < arr.length; j++) {
            if (arr[j].ListID == mainarr[i]) {
              // alert(arr[j].Str1);
              // console.log(arr[j].Str1);
              this.dissecondaryprojecttype = this.dissecondaryprojecttype + arr[j].Str1 + ', '
            }
          }
        }
        // remove the last comma and the space
        this.dissecondaryprojecttype=this.dissecondaryprojecttype.slice(0, -2)//

      // }, 1000);

      //*************************************************************** */




      //*************************************************************** */
      // Select Project roles
      //*************************************************************** */

      // let prole='';
      $("#projectrroledetailP").prop('checked', false);
      $("#projectrroledetailS").prop('checked', false);
      $("#projectrroledetailJV").prop('checked', false);

      // let str1: any = this.proposalFormGroup.controls['projectrole'].value;//"J,V";
      let str1: any = this.proposal.ProjectRole;//"J,V";

      let mainarr1: any = str1.split(','); //convert comma seperated string secondaryprojecttype values to array
      for (let i = 0; i < mainarr1.length; i++) {
        if (mainarr1[i] == 'P') {
          $("#projectrroledetailP").prop('checked', true);
          // prole="P";
        }
        if (mainarr1[i] == 'S') {
          $("#projectrroledetailS").prop('checked', true);
          // prole=prole+",S"
        }
        if (mainarr1[i] == 'JV') {
          $("#projectrroledetailJV").prop('checked', true);
          // prole=prole+",JV"
        }
      }
      // this.proposalFormGroup.controls['projectrole'].setValue(prole);

      //*************************************************************** */


      
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




  // saveEmp common for edit and add. Option to call 2 function from here 
  saveProposal() {

    //   // check internet connection first
    //   var onlineOffline = navigator.onLine;
    //   if (onlineOffline===false) {
    //     alert("no internet connection");
    //     return;
    //   }

    if (this.modalClicked == "editModal") {
      this.updateProposal();
    }
    if (this.modalClicked == "addModal") {
      this.addProposal();
    }

  }



  async addProposal() {

    // this is for extra protection. User access is controlled in checkRole(). But sometimes the edit btns
    // in the dttable are late to refresh and user may access other users role by clicking on btns. So extra control is used.
    // if (this.isAdmin==false) {
    //   alert("You need permiddion to edit this form");
    //   return;
    // }

    // this.loading2 = true;






    // Client side DUPLICATE EMPLOYEEID CHECK Using async await (Chaining).To prevent going to next request before 
    // completing this one Note: must use async fuction await keyword and usi .toPromise()
    // https://stackoverflow.com/questions/34104638/how-can-i-chain-http-calls-in-angular-2
    //************************************************************************************************************************* */

    try {
      let pno: any = this.proposalFormGroup.controls['proposalno'].value;
      const resp = await this.proposalService.getDuplicateProposalNo(pno).toPromise();
      this.count = resp[0].proposalnocount;
    } catch (error: any) {
      // alert("Error in checking DuplicateEmployeeID" + error.message);
      alert(error.message);
      this.loading2 = false;
      $("#btnProposalEditCloseModal").click();
      throw error;// must throw error instesd of return else the following lines in the calling function will execute
    }

    if (this.count > 0) {
      this.loading2 = false;
      alert("Selected Proposal No. exists for this Proposal.\nPlease select another Proposal No.");
      return;
    }






    // *** 2023 Note If date is cleared the it always has a value of '' which tries to save 0000-00-00 00:00:00 in mysql server resulting err;
    // 2023 SO handle it in front end and save null when value is '' dont have to do antthing in backend
    
    if (this.proposalFormGroup.controls['publicnoticedate'].value === '') {//0000-00-00 00:00:00
      this.proposalFormGroup.controls['publicnoticedate'].setValue(null);
    }
    if (this.proposalFormGroup.controls['presentationdate'].value === '') {//0000-00-00 00:00:00
      this.proposalFormGroup.controls['presentationdate'].setValue(null);
    }
    if (this.proposalFormGroup.controls['soqduedate'].value === '') {//0000-00-00 00:00:00
      this.proposalFormGroup.controls['soqduedate'].setValue(null);
    }
    if (this.proposalFormGroup.controls['proposalduedate'].value === '') {//0000-00-00 00:00:00
      this.proposalFormGroup.controls['proposalduedate'].setValue(null);
    }

    let x:any= $("#secondaryprojecttypeproposal").val();
    let y:any=x.toString(); 
    this.proposalFormGroup.controls['secondaryprojecttype'].setValue(y);



    // SET ProjectRole******************************************************************************** */
    let prole:any='';

    if ($("#projectrroleP").is(':checked')){
      prole = "P,";
    }
    if ($("#projectrroleS").is(':checked')){
      prole=prole+"S,";
    }
    if ($("#projectrroleJV").is(':checked')){
      prole=prole+"JV,";
    }
        
    prole = prole.slice(0, -1) // remove the last comma and the space
    this.proposalFormGroup.controls['projectrole'].setValue(prole);
    //************************************************************************************************* */


    this.loading2 = true;


    this.proposalService.addProposal(this.proposalFormGroup.value).subscribe(resp => {
      // $("#empeditmodal").modal("hide");
      $("#btnProposalEditCloseModal").click();
      // this.refreshEmployeeDatatable();
      this.loading2 = false;
      // this.refreshEmpDetail.next('somePhone'); //calling  loadEmpDetail() from parent component
      // this.router.navigateByUrl('Employee') //navigate to AngularDatatable
      //this.router.navigateByUrl('Empdetail/2') //navigate to AngularDatatable
      // var a= this.getMaxId();
      // this.router.navigateByUrl('Empdetail/' + a) //navigate to AngularDatatable // not working

      this.refreshProposalDatatable();
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




  updateProposal() {

    // **FormFroup and FormControl is used to pass value to save form instead of [(ngModel)]
    this.loading2 = true;

    if (this.proposalFormGroup.invalid) {
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
    
    if (this.proposalFormGroup.controls['publicnoticedate'].value === '') {//0000-00-00 00:00:00
      this.proposalFormGroup.controls['publicnoticedate'].setValue(null);
    }
    if (this.proposalFormGroup.controls['presentationdate'].value === '') {//0000-00-00 00:00:00
      this.proposalFormGroup.controls['presentationdate'].setValue(null);
    }
    if (this.proposalFormGroup.controls['soqduedate'].value === '') {//0000-00-00 00:00:00
      this.proposalFormGroup.controls['soqduedate'].setValue(null);
    }
    if (this.proposalFormGroup.controls['proposalduedate'].value === '') {//0000-00-00 00:00:00
      this.proposalFormGroup.controls['proposalduedate'].setValue(null);
    }

    // NOT USING now instead disabling EmployeeID control
    // DUPLICATE EMPLOYEEID CHECK
    // NOT USING now in update method(using in add) instead disabling EmployeeID control
    //**************************************************************************************** */


    let x:any= $("#secondaryprojecttypeproposal").val();
    let y:any=x.toString(); 
    this.proposalFormGroup.controls['secondaryprojecttype'].setValue(y);



    // SET ProjectRole******************************************************************************** */
    let prole:any='';

    if ($("#projectrroleP").is(':checked')){
      prole = "P,";
    }
    if ($("#projectrroleS").is(':checked')){
      prole=prole+"S,";
    }
    if ($("#projectrroleJV").is(':checked')){
      prole=prole+"JV,";
    }
        
    prole = prole.slice(0, -1) // remove the last comma and the space
    this.proposalFormGroup.controls['projectrole'].setValue(prole);
    //************************************************************************************************* */





    this.proposalService.updateProposal(this.proposalFormGroup.value).subscribe(resp => {

      // $("#empeditmodal").modal("hide");
      $("#btnProposalEditCloseModal").click();
      // this.refreshEmployeeDatatable();
      // this.refreshEmpDetail.next('somePhone'); //calling  loadEmpDetail() from parent component
      this.refreshProposalDatatable();
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



  deleteProposal(listid: any) {

    if (confirm('Are you sure you want to delete this record?')) {
      // Delete it!
    } else {
      // Do nothing!
      return;
    }

    this.proposalService.deleteProposal(listid).subscribe(resp => {
    this.refreshProposalDatatable();  // to refresh datatable after delete

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





    // Fill all combos in one function using forkJoin of rxjx
    fillAllCmb() {
      // this.loading2=true;
      forkJoin([

      this.projectSearchService.getCmbProjectType(), //observable 1
      this.projectSearchService.getCmbEmpMain(), //observable 3
      this.projectSearchService.getCmbProOCategory(), //observable 4
      this.projectSearchService.getCmbCaoMain(), //observable 6
      this.projectSearchService.getCmbProposalStatus(), //observable 6
      this.projectSearchService.getCmbCmbProjectAwardStatus(), //observable 6
        ]).subscribe(([CmbProProjectType,CmbEmpMain, CmbProOCategory, CmbCaoMain, CmbProposalStatus,CmbProjectAwardStatus]) => {
      // When Both are done loading do something
        this.CmbProProjectType = CmbProProjectType;
        this.CmbEmpMain = CmbEmpMain;
        this.CmbProOCategory = CmbProOCategory;
        this.CmbCaoMain = CmbCaoMain;
        this.CmbProposalStatus = CmbProposalStatus;
        this.CmbProjectAwardStatus = CmbProjectAwardStatus;



      // this.projectService.getProjectFromModal(this.projectid).subscribe(resp => {

      // ************************************************************************************************************************
      // fill sec projecttype here so that it can use the data from CmbProProjectType to avoid duplicate call for projecttype
      // *************************************************************************************************************************
      this.fillsecprojecttype();      
      // *************************************************************************************************

      // callJSForProposalDetail(); // already loaded in ngOnInit, but loaded again in fillcombo because multiselect is not loaded sometimes


      }, err => {
        alert(err.message);
        // alert("Problem filling Employee combos");
      });
      // if (!this.errors) {
      //   //route to new page
      // }

    }


  // called form save clicked to detect any new errors on save click.
  clearFormErrors() {
    this.formErrors = [{}];
  }









}
