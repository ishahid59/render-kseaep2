// import { Component } from '@angular/core';
import { Component,ViewChild,QueryList } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../services/employee/employee.service';
import { DatePipe,Location } from '@angular/common';// datepipe used to convert date format to show in html date element

// import { ProTeamComponent } from '../pro-team/pro-team.component';
import { CaoProjectsAsOwnerComponent } from '../cao-projects-as-owner/cao-projects-as-owner.component';
import { CaoEditModalComponent } from '../cao-edit-modal/cao-edit-modal.component';
import { ProjectService } from '../../services/project/project.service';

import { CommonService } from '../../services/common.service';
// import {callJSForProDetail} from './jsforprodetail.js'; // test



@Component({
  selector: 'app-cao-detail',
  templateUrl: './cao-detail.component.html',
  styleUrls: ['./cao-detail.component.css']
})
export class CaoDetailComponent {




//****************************************************************************************** */
// NOT USING THIS COMPONENT NOW. ALL EDIT IS DONE IN THE SAME CAO COMPONENT WITH DATATABLE
//****************************************************************************************** */



  cao: any = {};

 

  // AddressLine1
  // AddressLine2
  // CAOID
  // City
  // Country
  // Email
  // Ext
  // Fax
  // FullName
  // GovtAgency
  // Name
  // Phone
  // State
  // Zipcode


  addressline1: any="";
  addressline2: any="";
  caoid: any="";
  city: any="";
  country: any="";
  email: any="";
  ext: any="";
  fax: any="";
  fullname: any="";
  govtagency: any="";
  name: any="";
  phone: any="";
  state: any="";
  zipcode: any="";


  compLoaded:boolean=false;

// loadproaddress:boolean=false;
// loadprodac:boolean=false;


  // CALL CHILD METHOD
  // @ViewChild(ProTeamComponent) proteamcomponent!:ProTeamComponent;
  // @ViewChild(ProProfilecodeComponent) proprofilecomponent!:ProProfilecodeComponent;



  constructor(private router: Router, private commonService: CommonService, public activatedRoute: ActivatedRoute,private projectService: ProjectService,public datePipe: DatePipe,private location: Location) {
    // this.id = this.activatedRoute.snapshot.paramMap.get('id'); //get id parameter
  }


// CALL CHILD METHOD
@ViewChild(CaoEditModalComponent)
private caomainmodalcomponent!: CaoEditModalComponent;//https://stackoverflow.com/questions/54104187/typescript-complain-has-no-initializer-and-is-not-definitely-assigned-in-the-co


// proteamtabclicked() { //test
//   // this.proteamcomponent.loadDatatableProTeam();
//   // this.proteamcomponent.refreshDatatableProTeam();
// }
// //2023 To only load child component on tab click
// prodactabclicked() { //test
//   // this.proteamcomponent.loadDatatableProTeam();
//   // this.proteamcomponent.refreshDatatableProTeam();
//   this.loadprodac = true;
// }

// caoprojectsasownerclicked(){

// }


  //EDIT to use seperate child component for modal and call it from parent
  showCaoMainChildModal() {

    // this.promainmodalcomponent.showChildModal();
    // if (this.commonService.user_role === 'guest') {
    //   alert("Need permission.");
    // }
    // else {
    //   this.promainmodalcomponent.showChildModal();
    //   // this.loading2=false;
    // }


    // ****TODO We will use common service to check role
    // We may also use data from uassecc_control table for detail role check for all module individually
    // if (this.commonService.checkEditRole()) {
    //   this.caomainmodalcomponent.showChildModal();
    // }


  }



  //ADD to use seperate child component for modal and call it from parent
  showCaoMainChildModalAdd() {
    // this.promainmodalcomponent.showChildModalAdd();
    // if (this.commonService.user_role === 'guest' || this.commonService.user_role === 'user') {
    //   alert("Need permission.");
    // }
    // else {
    //   this.promainmodalcomponent.showChildModalAdd();
    // }


    // if (this.commonService.checkAddRole()) {
    //   this.caomainmodalcomponent.showChildModalAdd();
    // }


  }




  callProMainChildModalDelete() {
    // this.promainmodalcomponent.callChildModalDelete(this.id);
    // if (this.commonService.user_role === 'guest' || this.commonService.user_role === 'user') {
    //   alert("Need permission.");
    // }
    // else {
    //   this.promainmodalcomponent.callChildModalDelete(this.id);
    // }


    // if (this.commonService.checkDeleteRole()) {
    //   this.caomainmodalcomponent.callChildModalDelete(this.id);
    // }

  }



  ngOnInit() {
    // callJSForProDetail();

    // this.loadEmpDetail();
    // this.fillProjectCmb();
    // //child tabs initially will be updated using parent to child @Input()
    // //On emp cmb search child tabs will be updated using this.empdegreecomponent.loadAngularDatatable(); in findbyemployeeid() method

    // // option1
    // this.id = this.activatedRoute.snapshot.paramMap.get('id'); //get id parameter
    // this.emp = this.loadEmpDetail();
    // this.fillEmpCmb();


    // OPTION2  https://www.youtube.com/watch?v=b4zpvh_saic&list=PL1BztTYDF-QNrtkvjkT6Wjc8es7QB4Gty&index=65
    // ngOnInit() only called once so empcmb click will not refresh page. So we are using observable 
    // this.activatedRoute.paramMap.subscribe((param) => {
    //   this.id = param.get('id')
    //   this.project = this.loadCaoDetail();
    //   this.findid = this.id; // set the initial value findid
    // })


  }



  ngAfterViewInit(){
 
    // if (this.compLoaded==false) {
    //   location.reload();
    //   this.compLoaded=true
    //   return;
    // } 
  
  }


  findbycaoid() {

    //**NOW REFRESH DATATABLE AFTER SEARCH COMBO CHANGE IS DONE IN CHILD COMPONENT IN ngAfterViewInit WITH OBSERVABLE  */
    // SO DONT NEED IT NOW. BUT MAY NEED LATER.


    // // https://medium.com/@mvivek3112/reloading-components-when-change-in-route-params-angular-deed6107c6bb
    // this.router.navigate(['/Empdetail/' + this.findid + '']);
   
    // // after many search browser back only changes url not the page. So following is used so that going back
    // // with take to datatable page without showing all the search pages in url
    // // https://stackoverflow.com/questions/38891002/angular-2-replace-history-instead-of-pushing
    // this.location.replaceState('/Empdetail/' + this.findid + '');


    // // // this will load whole page
    // // setTimeout(() => {
    // //  location.reload();
    // // }, 1);


    // //Async observable: https://stackoverflow.com/questions/52115904/how-to-call-a-function-after-the-termination-of-another-function-in-angular/52116252

    // //this will only update emp
    // setTimeout(() => {
    //   this.id = this.activatedRoute.snapshot.paramMap.get('id'); //get id parameter
    //   this.loadEmpDetail()
    // }, 2);

    // setTimeout(() => {
    //   this.empdegreecomponent.loadAngularDatatable();
    // }, 3);
    // this.id = this.activatedRoute.snapshot.paramMap.get('id');
  // setTimeout(() => {
      // this.empdegreecomponent.loadAngularDatatable();
    // }, 3);


    // to clear the tab content in proownercontact if no data
    // $("#proownercontact").val("");
    
  }



  // NOT Using. Refresh is done in child component. Duplicate loading is avoided with if condtion( if (!this.componentLoaded) )
  // Call Child tables refresh methods
  // Moved all refresh codes from child tables from "ngAfterViewInit()" method 
  // Because child tables are already loaded in "loadDatatableProTeam". So datatables are called twice on load
  // But we need to refresh child tables on combo search "GO" btn clicked. So we call "refreshAllChildTables" on "GO" btn click
  refreshAllChildTables() {
    // alert();
    // this.prodescriptioncomponent.refreshDatatableProDescription();//keep this in the first line to work
    // this.proteamcomponent.refreshDatatableProTeam();
    // this.proprofilecomponent.refreshDatatableProProfilecodeSF330();
    // this.prodaccomponent.refreshDatatableProDac();
    // this.prophotocomponent.refreshDatatableProPhoto();
  }








  loadCaoDetail() {

    // // this.id = this.activatedRoute.snapshot.paramMap.get('id'); //get id parameter
    // this.loading2 = true;

    // this.projectService.getProjectdetail(this.id).subscribe(resp => {
    //   this.project = resp;

    //   //{{emp.empid}} giving error in console so converted to "empid" only for interpolation 
    //   // this.firstname= resp.empid,

    //   this.projectno = resp.ProjectNo; //2023 using it for showing photo
    //   this.projectid = resp.ProjectID; //2023 using it for showing photo
    //   this.comid = resp.disComID; //2023
    //   this.projectname=resp.ProjectName;
    //   this.awardyear = resp.AwardYear; //2023
    //   this.proposalid=resp.disProposalID;
    //   this.projectagreementno=resp.ProjectAgreementNo;
    //   this.primaryprojecttype = resp.disPrimaryProjectType;
    //   // searchsecondaryprojecttype = $('#SecondaryProjectType').val();
    //   this.projectrole = resp.disProjectRole;
    //   this.ownercategory = resp.disOwnerCategory;
    //   this.owner = resp.disOwner;
    //   this.client = resp.disClient;
    //   this.projectstatus = resp.disProjectStatus;
    //   this.empid = resp.disProjectManager;
    //   this.empprojectrole = resp.EmpProjectRole;
    //   // this.firmfeeoperator = resp.;
    //   this.firmfee = resp.FirmFee;
    //   // this.constcostoperator = resp.;
    //   this.constcost = resp.ConstructionCost;
    //   // this.expstartdateoperator = resp.;
    //   this.expstartdate = resp.DurationFrom;
    //   // this.expenddateoperator = resp.;
    //   this.expenddate = resp.DurationTo;
    //   // this.excludeieprojects = resp.;
    //   // this.excludeongoingprojects = resp.;
    //   this.secondaryprojecttype=resp.SecondaryProjectType;

      

    //   this.fillCaoCmb();// added 2023 to refresh cmb when new emp added
    //   this.loading2 = false;
    // },
    //   err => {
    //     alert(err.message);
    //     this.loading2 = false;
    //   });
  }






  // Fill all combos in one function using forkJoin of rxjx
  fillCaoCmb() {
    // this.projectService.getCmbProject().subscribe(resp => {
    //   this.cmbProject = resp;
    //   // console.log(resp);
    // },
    //   err => {
    //     alert(err.message);
    //   });
  }









}
