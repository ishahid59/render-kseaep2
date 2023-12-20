// import { Component } from '@angular/core';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../../services/common.service';
import { EmployeeService } from '../../services/employee/employee.service';
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
import { ProjectEditModalComponent } from '../project-edit-modal/project-edit-modal.component';
import { ProjectSearchService } from '../../services/project/project-search.service';
import {callJSForProSearch} from './jsforprosearch.js'; // test

// import { takeUntil } from 'rxjs/operators';
import { Subscription } from 'rxjs';

// import '../../../assets/javascript/test.js';
 
// https://medium.com/@Codeible/adding-loading-and-using-javascript-in-angular-3281ea4b056b
// declare function test(): void;
// declare function test2(): void;
// declare function run2(): void;

@Component({
  selector: 'app-project-search',
  templateUrl: './project-search.component.html',
  styleUrls: ['./project-search.component.css']
})


export class ProjectSearchComponent {

  // constructor(private http: HttpClient, private empservice: EmployeeService, public datePipe: DatePipe, private router: Router,private commonService: CommonService) {
    constructor(private http: HttpClient, private empservice: EmployeeService, private projectSearchService: ProjectSearchService, public datePipe: DatePipe, private router: Router,private commonService: CommonService) {

}


  // // firstname for search is supplied from parent to child for angular-datatable, since table code is written in ngOnInit() 
  // // search input field is in parent component else ngOnInit() will clear all input in child component
  // @Input()
  // fname: string = "";


  // dtOptions: DataTables.Settings = {};
  dtOptions: any = {}; // any is used instead of DataTables.Settings else datatable export buttons wont show

  // To refresh datatable with search parameters without using destroy
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective; //used "!" to avoid initialization of variable. Also can use strict:false in tsconfig.json
  loading2:any=false;

  // table data
  myData: any = ([]); // in angular should ([]) for array
  empid: any = 0; // to pass to child modal if used

  multiSelectedIds: any = []; // for multiselect
 
  CmbProProjectType: any = ([]);
  CmbProPRole: any = ([]);
  CmbEmpMain: any = ([]);
  CmbProOCategory: any = ([]);
  CmbComMain: any = ([]);
  CmbCaoMain: any = ([]);
  CmbProStatus: any = ([]);
  CmbEmpProjectRole: any = ([]);
  CmbProposalMain: any = ([]);


  searchcomid : number = 0;
  // searchprimaryprojecttype: number = 0;
  searchprimaryprojecttype: number = 0;
  // searchsecondaryprojecttype = $('#SecondaryProjectType').val();
  searchprojectrole: number = 0;
  searchownercategory: number = 0;
  searchowner: number = 0;
  searchclient: number = 0;
  searchprojectstatus: number = 0;
  searchempid: number = 0;
  searchempprojectrole: number = 0;
  //searchfirmfeeoperator = $("#FirmFeeOperator :selected").val();
  searchfirmfeeoperator: string = "";
  // searchfirmfee = $('#srcFirmFee').val();
  searchfirmfee: number = 0;
  searchconstcostoperator: string = "";
  searchconstcost: number = 0;
  searchexpstartdateoperator: number = 0;
  searchexpstartdate: string = "";
  searchexpenddateoperator: number = 0;
  searchexpenddate: string = "";
  searchexcludeieprojects: number = 0;
  searchexcludeongoingprojects: number = 0;
  searchsecondaryprojecttype: any = [];


  secprojecttype:any= []; //[{ "ListID": 1, "Str1": "Bridge Design", "Str2": null }, { "ListID": 2, "Str1": "Bridge Inspection", "Str2": null }, { "ListID": 3, "Str1": "Building Architectural Projects", "Str2": null }, { "ListID": 4, "Str1": "Building Design", "Str2": null }, { "ListID": 5, "Str1": "Building Inspection", "Str2": null }, { "ListID": 6, "Str1": "Construction inspection of buildings", "Str2": null }, { "ListID": 7, "Str1": "Construction Inspection of Roadways & Bridges", "Str2": null }, { "ListID": 8, "Str1": "Construction management of buildings", "Str2": null }, { "ListID": 9, "Str1": "Construction Management of Roadways & Bridges", "Str2": null }, { "ListID": 10, "Str1": "Drainage Design", "Str2": null }, { "ListID": 11, "Str1": "Electrical Engineering", "Str2": null }, { "ListID": 12, "Str1": "Final Design of Route 29", "Str2": null }, { "ListID": 13, "Str1": "Geotechnical Engineering", "Str2": null }, { "ListID": 14, "Str1": "GIS Mapping", "Str2": null }, { "ListID": 15, "Str1": "HVAC Engineering", "Str2": null }, { "ListID": 16, "Str1": "Hydraulic Engineering", "Str2": null }, { "ListID": 17, "Str1": "Land Surveying", "Str2": null }, { "ListID": 18, "Str1": "Landscape Architecture", "Str2": null }, { "ListID": 19, "Str1": "Mechanical Engineering", "Str2": null }, { "ListID": 20, "Str1": "Other Bridge Projects", "Str2": null }, { "ListID": 21, "Str1": "Other Building Projects", "Str2": null }, { "ListID": 22, "Str1": "Other Projects", "Str2": null }, { "ListID": 23, "Str1": "Other Railroad Projects", "Str2": null }, { "ListID": 24, "Str1": "Other Roadways Projects", "Str2": null }, { "ListID": 25, "Str1": "Parking Lot Design", "Str2": null }, { "ListID": 26, "Str1": "Railroad Station design", "Str2": null }, { "ListID": 27, "Str1": "Roadway Design", "Str2": null }, { "ListID": 28, "Str1": "Sanitary Engineering", "Str2": null }, { "ListID": 29, "Str1": "Traffic Data Collection", "Str2": null }, { "ListID": 30, "Str1": "Traffic Engineering", "Str2": null }, { "ListID": 31, "Str1": "Transportation Planning", "Str2": null }, { "ListID": 32, "Str1": "Underwater Inspection", "Str2": null }, { "ListID": 33, "Str1": "Urban Planning", "Str2": null }, { "ListID": 34, "Str1": "Utilities Engineering", "Str2": null }, { "ListID": 35, "Str1": "Water Supply Engineering", "Str2": null }];


  componentLoaded: boolean = false;

  // private sub: any;
  // private sub2: any;
  // private sub3: any;
  // private sub4: any;
  // private sub5: any;
  // private sub6: any;
  // private sub7: any;
  // private sub8: any;
  // private sub9: any;

  //******ENABLE WITH RENEME */
  // // CALL CHILD METHOD
  // @ViewChild(EmpEditModalComponent)
  // private empmainmodalcomponent!: EmpEditModalComponent;//https://stackoverflow.com/questions/54104187/typescript-complain-has-no-initializer-and-is-not-definitely-assigned-in-the-co


  // //to use seperate child component for modal and call it from parent
  // showEmpMainChildModal() {
  //   this.empmainmodalcomponent.showChildModal();
  // }


  testbtn(){
    $("#srcEmpID").prop("selectedIndex", 0);

  }


    // Fill all combos in one function using forkJoin of rxjx
    // fillAllCmb() {
    //   // this.loading2=true;
    //   forkJoin([
    //   //   this.sub= this.projectSearchService.getCmbProjectType(), //observable 1
    //   //  this.sub2=  this.projectSearchService.getCmbProPRole(), //observable 2
    //   //  this.sub3=  this.projectSearchService.getCmbEmpMain(), //observable 3
    //   //  this.sub4=  this.projectSearchService.getCmbProOCategory(), //observable 4
    //   //  this.sub5=   this.projectSearchService.getCmbComMain(), //observable 5
    //   //  this.sub6=  this.projectSearchService.getCmbCaoMain(), //observable 6
    //   //  this.sub7=  this.projectSearchService.getCmbProStatus(), //observable 7
    //   //  this.sub8=  this.projectSearchService.getCmbEmpProjectRole(), //observable 8
    //   //  this.sub9=  this.projectSearchService.getCmbProposalMain(), //observable 9
    //   this.projectSearchService.getCmbProjectType(), //observable 1
    //   this.projectSearchService.getCmbProPRole(), //observable 2
    //   this.projectSearchService.getCmbEmpMain(), //observable 3
    //   this.projectSearchService.getCmbProOCategory(), //observable 4
    //   this.projectSearchService.getCmbComMain(), //observable 5
    //   this.projectSearchService.getCmbCaoMain(), //observable 6
    //   this.projectSearchService.getCmbProStatus(), //observable 7
    //   this.projectSearchService.getCmbEmpProjectRole(), //observable 8
    //   this.projectSearchService.getCmbProposalMain(), //observable 9
    //   ]).subscribe(([CmbProProjectType,CmbProPRole,CmbEmpMain,CmbProOCategory,CmbComMain,CmbCaoMain,CmbProStatus,CmbEmpProjectRole,CmbProposalMain]) => {
    //     // When Both are done loading do something
    //     this.CmbProProjectType = CmbProProjectType;
    //     this.CmbProPRole = CmbProPRole;
    //     this.CmbEmpMain = CmbEmpMain;
    //     this.CmbProOCategory = CmbProOCategory;
    //     this.CmbComMain = CmbComMain;
    //     this.CmbCaoMain = CmbCaoMain;
    //     this.CmbProStatus = CmbProStatus;
    //     this.CmbEmpProjectRole = CmbEmpProjectRole;
    //     this.CmbProposalMain = CmbProposalMain;
        
    //     // this.loading2=false;
    //     // fill sec projecttype here so that it can use the data from CmbProProjectType to avoid duplicate call for projecttype
    //     this.fillsecprojecttype();

    //   }, err => {
    //     alert(err.message);
    //     // alert("Problem filling Employee combos");
    //   });
    //   // if (!this.errors) {
    //   //   //route to new page
    //   // }

    // }



    // Fill all combos in one function using forkJoin of rxjx
    fillAllCmb() {

      const x: any = this.projectSearchService.getCmbProjectType().toPromise(); //observable 1
      x.then((data: any) => {
        this.CmbProProjectType = data;
      });

      // If use fetch
      // fetch(this.commonService.baseUrl + '/api/procombo/cmbprojecttype/')
      // .then(r => r.json())
      // .then(j => { 
      //   // console.log(j); 
      //   this.CmbProProjectType = j;
      // });
     
      const x2: any = this.projectSearchService.getCmbProPRole().toPromise(); //observable 1
      x2.then((data: any) => {
        this.CmbProPRole = data;
      });
      const x3: any = this.projectSearchService.getCmbEmpMain().toPromise(); //observable 1
      x3.then((data: any) => {
        this.CmbEmpMain = data;
      });
      const x4: any = this.projectSearchService.getCmbProOCategory().toPromise(); //observable 1
      x4.then((data: any) => {
        this.CmbProOCategory = data;
      });
      const x5: any = this.projectSearchService.getCmbComMain().toPromise(); //observable 1
      x5.then((data: any) => {
        this.CmbComMain = data;
      });
      const x6: any = this.projectSearchService.getCmbCaoMain().toPromise(); //observable 1
      x6.then((data: any) => {
        this.CmbCaoMain = data;
      });
      const x7: any = this.projectSearchService.getCmbProStatus().toPromise(); //observable 1
      x7.then((data: any) => {
        this.CmbProStatus = data;
      });
      const x8: any = this.projectSearchService.getCmbEmpProjectRole().toPromise(); //observable 1
      x8.then((data: any) => {
        this.CmbEmpProjectRole = data;
      });
      const x9: any = this.projectSearchService.getCmbProposalMain().toPromise(); //observable 1
      x9.then((data: any) => {
        this.CmbProposalMain = data;
      });
     
      // this.CmbProPRole = this.projectSearchService.getCmbProPRole(), //observable 2
      // this.CmbEmpMain = this.projectSearchService.getCmbEmpMain(), //observable 3

      // this.CmbProOCategory = this.projectSearchService.getCmbProOCategory(), //observable 4
      // this.CmbComMain = this.projectSearchService.getCmbComMain(), //observable 5
      // this.CmbCaoMain = this.projectSearchService.getCmbCaoMain(), //observable 6
      // this.CmbProStatus = this.projectSearchService.getCmbProStatus(), //observable 7
      // this.CmbEmpProjectRole = this.projectSearchService.getCmbEmpProjectRole(), //observable 8
      // this.CmbProposalMain = this.projectSearchService.getCmbProposalMain(), //observable 9

        
        // this.loading2=false;
        // fill sec projecttype here so that it can use the data from CmbProProjectType to avoid duplicate call for projecttype
        this.fillsecprojecttype();


      // if (!this.errors) {
      //   //route to new page
      // }

    }


  
  
    // // For Angular-Datatable reload. Following method must be used to reload angular-datatable since ngOnInit() is used to initilize table 
    // https://l-lin.github.io/angular-datatables/#/advanced/custom-range-search
    refreshEmployeeDatatable() {
      this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.draw();
      });
    }
  
  






  // async fillsecprojecttype() {
  //  this.secprojecttype = this.projectSearchService.getCmbProjectType().toPromise();
   
  // }




ngOnDestroy() {
  // this.sub.unsubscribe();
  // this.sub2.unsubscribe();
  // this.sub3.unsubscribe();
  // this.sub4.unsubscribe();
  // this.sub5.unsubscribe();
  // this.sub6.unsubscribe();
  // this.sub7.unsubscribe();
  // this.sub8.unsubscribe();
  // this.sub9.unsubscribe();
 
}


  // FILL CMB secprojecttype function called in ngAfterViewInit()  
  // but multiselect dropdown has to be initilized in the js file which is loaded in ngOnInit()
  // **********************************************************************************************
  // fillsecprojecttype() {
  //  this.projectSearchService.getCmbProjectType().subscribe(resp => {
  //     // this.secprojecttype = resp;
  //     var items: any = [];
  //     items = resp;
  //     for (let i = 1; i < items.length; i++) {
  //       $('#multiple-checkboxes').append("<option value=" + items[i].ListID + ">" + items[i].Str1 + "</option>"); //append to select itself
  //       //  (<any>$('#multiple-checkboxes')).append("<option value=" + items[i].label + ">" + items[i].title + "</option>"); //append to select itself
  //     }
  //     (<any>$("#multiple-checkboxes")).multiselect('rebuild');
  //   },
  //     err => {
  //       alert(err.message);
  //     });
  // }

  
  // now using this.CmbProProjectType which is already filled
  fillsecprojecttype() {
       var items: any = [];
       items = this.CmbProProjectType;
       for (let i = 1; i < items.length; i++) {
         $('#multiple-checkboxes').append("<option value=" + items[i].ListID + ">" + items[i].Str1 + "</option>"); //append to select itself
         //  (<any>$('#multiple-checkboxes')).append("<option value=" + items[i].label + ">" + items[i].title + "</option>"); //append to select itself
       }
       (<any>$("#multiple-checkboxes")).multiselect('rebuild');
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


    setTimeout(() => {
      this.fillAllCmb();// fill cmb moved in datatable so that datatable data can be loaded before
    }, 100);

    // this.fillAllCmb()
    // .then((data: any) => {
    //   //  console.log(data)
    //    this. CmbProProjectType=data;
    // });

    // FIL CMB secproject now here instead of js file so that api address could be dynamic 
    // but multiselect dropdown has to be initilized in the js file which is loaded in ngOnInit()
    // this.fillsecprojecttype();
    // now moved to fillAllCmb()




    //     // WORKING secproject cmb should be filled in ngOnInit for multiselect
    //     var items: any = [];
    //     // items = resp;

    //    await this.fillsecprojecttype();
    //     items = this.secprojecttype;

    //     // items = [{ "ListID": 1, "Str1": "Bridge Design", "Str2": null }, { "ListID": 2, "Str1": "Bridge Inspection", "Str2": null }, { "ListID": 3, "Str1": "Building Architectural Projects", "Str2": null }, { "ListID": 4, "Str1": "Building Design", "Str2": null }, { "ListID": 5, "Str1": "Building Inspection", "Str2": null }, { "ListID": 6, "Str1": "Construction inspection of buildings", "Str2": null }, { "ListID": 7, "Str1": "Construction Inspection of Roadways & Bridges", "Str2": null }, { "ListID": 8, "Str1": "Construction management of buildings", "Str2": null }, { "ListID": 9, "Str1": "Construction Management of Roadways & Bridges", "Str2": null }, { "ListID": 10, "Str1": "Drainage Design", "Str2": null }, { "ListID": 11, "Str1": "Electrical Engineering", "Str2": null }, { "ListID": 12, "Str1": "Final Design of Route 29", "Str2": null }, { "ListID": 13, "Str1": "Geotechnical Engineering", "Str2": null }, { "ListID": 14, "Str1": "GIS Mapping", "Str2": null }, { "ListID": 15, "Str1": "HVAC Engineering", "Str2": null }, { "ListID": 16, "Str1": "Hydraulic Engineering", "Str2": null }, { "ListID": 17, "Str1": "Land Surveying", "Str2": null }, { "ListID": 18, "Str1": "Landscape Architecture", "Str2": null }, { "ListID": 19, "Str1": "Mechanical Engineering", "Str2": null }, { "ListID": 20, "Str1": "Other Bridge Projects", "Str2": null }, { "ListID": 21, "Str1": "Other Building Projects", "Str2": null }, { "ListID": 22, "Str1": "Other Projects", "Str2": null }, { "ListID": 23, "Str1": "Other Railroad Projects", "Str2": null }, { "ListID": 24, "Str1": "Other Roadways Projects", "Str2": null }, { "ListID": 25, "Str1": "Parking Lot Design", "Str2": null }, { "ListID": 26, "Str1": "Railroad Station design", "Str2": null }, { "ListID": 27, "Str1": "Roadway Design", "Str2": null }, { "ListID": 28, "Str1": "Sanitary Engineering", "Str2": null }, { "ListID": 29, "Str1": "Traffic Data Collection", "Str2": null }, { "ListID": 30, "Str1": "Traffic Engineering", "Str2": null }, { "ListID": 31, "Str1": "Transportation Planning", "Str2": null }, { "ListID": 32, "Str1": "Underwater Inspection", "Str2": null }, { "ListID": 33, "Str1": "Urban Planning", "Str2": null }, { "ListID": 34, "Str1": "Utilities Engineering", "Str2": null }, { "ListID": 35, "Str1": "Water Supply Engineering", "Str2": null }];
    //  console.log(items );
    //      setTimeout(()=>{   

    //        // alert(this.secprojecttype)
    //        // items = this.secprojecttype;
    //        // $.each(items, function (i, option) {
    //        //   alert(items[i].ListID );
    //        //   (<any>$('#multiple-checkboxes2')).append("<option value=" + items[i].ListID + ">" + items[i].Str1 + "</option>"); //append to select itself
    //        //   //  $("#multiproeditsecproject option[value='"+val+"']").attr("selected", "selected");
    //        // })
    //        for (let i = 0; i < items.length; i++) {
    //         //  $('#test').append("<option value=" + items[i].ListID + ">" + items[i].Str1 + "</option>"); //append to select itself
    //         $('#multiple-checkboxes').append("<option value=" + items[i].ListID + ">" + items[i].Str1 + "</option>"); //append to select itself
    //         //  (<any>$('#multiple-checkboxes')).append("<option value=" + items[i].label + ">" + items[i].title + "</option>"); //append to select itself
    //        }
    //        (<any>$("#multiple-checkboxes")).multiselect('rebuild');
    //   }, 1000);




    //   let items:any=[21,27,25];//this.secprojecttype;
    //   // let items:any=this.secprojecttype;
    //   // let items: any = this.secprojecttype.split(",");
    // //  alert(resp.SecondaryProjectType)
    // for (let index = 0; index < items.length; index++) {
    //     //  alert(items[index] )
    //    $("#multiple-checkboxes2 option[value='" + items[index] + "']").attr("selected", "selected");
    //   // $("#multiple-checkboxes option[value='"+21+"']").prop('selected', true);
    // }
    // (<any>$("#multiple-checkboxes2")).multiselect('rebuild'); // **IMPORTANT


    // (<any>$('#multiple-checkboxes')).multiselect('select', ['1', '2', '4']);
    // (<any>$('#multiple-checkboxes')).multiselect('rebuild');
    // $('#multiple-checkboxes').removeAttr('selected').find('option:first').attr('selected', 'selected');


    //  let items:any='21,27,25,10';//this.secprojecttype;

    //   $.each(items.split(','), function(idx, val) {
    //       // $("#multiple-checkboxes option[value='"+val+"']").attr("selected", "selected");
    //       $("#multiple-checkboxes option[value='"+val+"']").prop('selected', true); // use prop for latest jquery

    //     }); 
    //   (<any>$("#multiple-checkboxes")).multiselect('rebuild'); // **IMPORTANT

  }
  
  


  // multiselrct is not initilized when form loads for first time. So to refresh page location.reload() is 
  // used when clicking multiselect is for first time
  // reloadPage() {
  //   location.reload()
  // }



  search() {

    // convert secproject to array(using string.split(',');) before search is submitted
    var x: any = $('#multiSelectedIds').val();
    $('#multiSelectedIds').val();
    this.multiSelectedIds = x.split(',');

    this.refreshEmployeeDatatable()

  }



  
    clearSearch() {
    
      this.searchcomid   = 0;
      this.searchprimaryprojecttype  = 0;
      // $('#srcPrimaryProjectType').val(0),
      // searchsecondaryprojecttype = $('#SecondaryProjectType').val();
      this.searchprojectrole  = 0;
      this.searchownercategory  = 0;
      this.searchowner  = 0;
      this.searchclient  = 0;
      this.searchprojectstatus  = 0;
      this.searchempid  = 0;
      this.searchempprojectrole  = 0;
      //searchfirmfeeoperator = $("#FirmFeeOperator :selected").val();
      this.searchfirmfeeoperator = "";
      // this.searchfirmfee = $('#srcFirmFee').val();
      this.searchfirmfee  = 0;
      // $('#srcFirmFee').val("");
      this.searchconstcostoperator = "";
      this.searchconstcost  = 0;
      // $('#srcConstCost').val("");
      this.searchexpstartdateoperator  = 0;
      this.searchexpstartdate  = "";
      // $('#srcExpStartDate').val("");
      this.searchexpenddateoperator  = 0;
      this.searchexpenddate  = "";
      // $('#srcExpEndDate').val("");
      this.searchexpenddate  = "";
      this.searchexcludeieprojects  = 0;
      this.searchexcludeongoingprojects  = 0;
      this.searchsecondaryprojecttype = [];
      $('#srcExpEndDate').val("");

      this.multiSelectedIds = []; // for multiselect sec project pasing search array value
      $('#multiSelectedIds').val("");
      // (<any>$("#multiple-checkboxes")).multiselect("deselectAll", true);
      $('#dt').DataTable().search('').draw();//clear dt text search input
      this.search(); // refresh table

     
        //  (<any>$("#multiple-checkboxes")).multiselect("clearSelection");// clear Bootstrap multiselect
        // <!-- hidden btn to clearMultiSelect called in index.html -->
        $("#clearMultiSelect").click();
    }
  
  



    public  ngOnInit(): void {
    // public async ngOnInit(): Promise<any> {


    // NEW js file created for this component and called directly in ngOnInit() to initilize bootstrap multiselect 
    // dropdown else will need page refresh to load bootstrap multiselect 
      callJSForProSearch(); 
   


    // var onlineOffline = navigator.onLine;
    // if (onlineOffline===false) {
    //   alert("no internet connection");
    //   return;
    // }
// let url:any="";
//     if (this.componentLoaded==false) {
//       url='/api/project/angular-datatable'
//     } else {
//       url='/api/project/search/angular-datatable'
//     }
    // alert(url);
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
      // lengthMenu: [ 10, 35, 50, 75, 100 ],
      lengthMenu: [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
      dom: 'Blfrtip',//'Blfrtip', //'Bfrtip', use l before f to show length with bottons
      // //"any" is used in "dtOptions" instead of DataTables.Settings else datatable export buttons wont show
      buttons: [
        // 'copy', 'csv', 'excel', 'pdf', 'print'
        'excel', 'csv', 'pdf', 'print',

      ],

       ajax: (dataTablesParameters: any, callback: any) => {
          this.http.post<any>(
          // 'http://localhost:5000/api/employee/search/angular-datatable',
          // '' + that.commonService.baseUrl + '/api/project/angular-datatable',
          '' + that.commonService.baseUrl + '/api/project/search/angular-datatable',
         


          // Adding custom parameters: https://stackoverflow.com/questions/49645200/how-can-add-custom-parameters-to-angular-5-datatables
          // using Object.assign to bundle dataTablesParameters and additionalparameters in 1 object so that an additional  
          // parameter can be used for post,last parameter is for header which is passes in request header instead of body
          Object.assign(dataTablesParameters,
            {
              token: '',

              comid: this.searchcomid,
              // primaryprojecttype: this.searchprimaryprojecttype,
              // searchsecondaryprojecttype = $('#SecondaryProjectType').val();
              projectrole: this.searchprojectrole,
              ownercategory: this.searchownercategory,
              owner: this.searchowner,
              client: this.searchclient,
              projectstatus: this.searchprojectstatus,
              empid: this.searchempid,
              empprojectrole: this.searchempprojectrole,
              //searchfirmfeeoperator = $("#FirmFeeOperator :selected").val();
              firmfeeoperator: this.searchfirmfeeoperator,
              // firmfee: this.searchfirmfee,
              // firmfee:  $('#srcFirmFee').val(),
              constcostoperator: this.searchconstcostoperator,
              constcost: this.searchconstcost,
              // constcost:  $('#srcConstCost').val(),
              // firmfee:  $('#srcFirmFee').val(),
              firmfee: this.searchfirmfee,
              expstartdateoperator: this.searchexpstartdateoperator,
              expstartdate: this.searchexpstartdate,
              // expstartdate:  $('#srcExpStartDate').val(),
              expenddateoperator: this.searchexpenddateoperator,
              expenddate: this.searchexpenddate,
              // expenddate:  $('#srcExpEndDate').val(),
              
              excludeieprojects: this.searchexcludeieprojects,
              excludeongoingprojects: this.searchexcludeongoingprojects,
              // secondaryprojecttype: this.searchsecondaryprojecttype,
              // secondaryprojecttype = $('#multiprosearchsecproject').val();
              // this field not working with ngModel binding so used jquery to send value
              // primaryprojecttype: $('#srcPrimaryProjectType').val(),
              primaryprojecttype: this.searchprimaryprojecttype,
              // secondaryprojecttype: this.searchsecondaryprojecttype,
              // string.split(',');
              // var x:any=''
              // $('#multiSelectedIds').val(),
              secondaryprojecttype:this.multiSelectedIds,

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
        });
        
      },
      order: [[1, 'asc']], // 1 col is selected instead of 0 since 1 is hidden
      columnDefs: [
        // {
        // "orderable": true,
        // "targets": '_all',
        // },
        {
          "targets": 6, // center action column
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
        { data: "ProjectRole",  },// width: "80px",// data: "disProjectRole",
        { data: "AwardYear" },  //   width: "80px"// visible: false,
        { data: "ProjectManager", visible: false },// "defaultContent": "" // to avoid showing error on null values
        { data: "OwnerCategory", visible: false }, // "defaultContent": "",// to avoid showing error on null values
        { data: "ComID", visible: false, },// defaultContent: "",visible: false

        {
          "data": "PrimaryProjectType", "defaultContent": "", "mRender": function (data: any, type: any, row: any) {
            // { "data": "disPrimaryProjectType","defaultContent": "","mRender": function(data, type, row) {
            if (data.length > 20) {
              var trimmedString = data.substring(0, 20);
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
        // { data: "Client", visible: false },//data: "disClient",// defaultContent: ""
        // { data: "ProjectAgreementNo", visible: false },
        // { data: "ProjectStatus", }, // visible: false
        // { data: "ProposalID", visible: false },

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


    // $(document).ready(function () {

    //   (<any>$('#multiple-checkboxes')).multiselect({
    //     includeSelectAllOption: true,
    //     buttonWidth:'443px',
    //     maxHeight:358,
    //   });
    //  (<any>$("#multiple-checkboxes")).multiselect('refresh');

    // }); // end documenready
    
  } // end onInit()





  ngAfterContentInit(){
// alert();
    // to refresh multiselect
    // setTimeout(() => {
    //   location.reload()
    // }, .0000001);
    
  }



// Action column handlers connecting to angular methods directly from within jquatu table
  rowFirstNameClickHandler(data:any) {
  
    this.router.navigate(['/Projectdetail/' + data.ProjectID]);
    
    // TO INITIALIZE MULTISELECT NEEDS PAGE REFRESH TO RUN JAVASCRIPT CODE IN Index.html
    //***************************************************************************************** */
    // Option-1
    // setTimeout(() => {
    //   location.reload()
    // }, 1);

    // Option 2 smooth, takes time but no jumping
    //***************************************************************************************** */
    // window.location.href = '/Projectdetail/' + data.ProjectID;

  
  //  test();      


  }



  rowDetailClickHandler(data:any) {
    // alert("Detail Handler: "+data.firstname+"");
    this.router.navigate(['/Projectdetail/' + data.ProjectID]);
    // setTimeout(() => {
    //   location.reload()
    // }, .000000001);
    // window.location.href = '/Projectdetail/' + data.ProjectID;

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
    // this.router.navigate(['/Empdetail']);
    this.router.navigate(['/Projectdetail/' + e]);
  }



}
