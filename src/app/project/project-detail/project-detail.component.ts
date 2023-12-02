// import { Component } from '@angular/core';
import { Component,ViewChild,QueryList } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../services/employee/employee.service';
import { DatePipe,Location } from '@angular/common';// datepipe used to convert date format to show in html date element
import { ProTeamComponent } from '../pro-team/pro-team.component';
import { ProjectEditModalComponent } from '../project-edit-modal/project-edit-modal.component';
import { ProjectService } from '../../services/project/project.service';
import { ProProfilecodeComponent } from '../pro-profilecode/pro-profilecode.component';
import { ProDacComponent } from '../pro-dac/pro-dac.component';
import { ProDescriptionComponent } from '../pro-description/pro-description.component';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})



export class ProjectDetailComponent {

  project: any = {};

  // empid:any=0; 
  // employeeid:any="";

  projectid : any="";
  projectno: any="";
  projectname : any="";

  comid: any="";
  primaryprojecttype:any="";
  // searchsecondaryprojecttype = $('#SecondaryProjectType').val();
  projectrole: any="";
  ownercategory: any="";
  owner: any="";
  client: any="";
  projectstatus: any="";
  empid: any="";
  empprojectrole: any="";
  firmfeeoperator: any="";
  firmfee: any="";
  constcostoperator: any="";
  constcost: any="";
  expstartdateoperator: any="";
  expstartdate: any="";
  expenddateoperator: any="";
  expenddate: any="";
  excludeieprojects: any="";
  excludeongoingprojects: any="";
  secondaryprojecttype: any="";
  // secondaryprojecttype = $('#multiprosearchsecproject').val();
  // this field not working with ngModel binding so used jquery to send value
 

loadprodac:boolean=false;
loadproprofilecode:boolean=false;
loadprodescription:boolean=false;
test:boolean=false;

  id: any = null;
  loading2:boolean=false;
  formErrors:any=[{}];
  lstEmpID:any= [];
  findid: any = '';
  cmbProject:any=[{}];

  // CALL CHILD METHOD
  @ViewChild(ProTeamComponent) proteamcomponent!:ProTeamComponent;
  @ViewChild(ProProfilecodeComponent) proprofilecomponent!:ProProfilecodeComponent;
  @ViewChild(ProDacComponent) prodaccomponent!:ProDacComponent;
  @ViewChild(ProDescriptionComponent) prodescriptioncomponent!:ProDescriptionComponent;


  constructor(private router: Router, public activatedRoute: ActivatedRoute,private projectService: ProjectService,public datePipe: DatePipe,private location: Location) {
    // this.id = this.activatedRoute.snapshot.paramMap.get('id'); //get id parameter
  }


 // CALL CHILD METHOD
 @ViewChild(ProjectEditModalComponent)
 private promainmodalcomponent!: ProjectEditModalComponent;//https://stackoverflow.com/questions/54104187/typescript-complain-has-no-initializer-and-is-not-definitely-assigned-in-the-co

 test2(){
  this.test=true;
 }


 proteamtabclicked(){ //test
  // this.proteamcomponent.loadDatatableProTeam();
  // this.proteamcomponent.refreshDatatableProTeam();
 }
 //2023 To only load child component on tab click
 prodactabclicked(){ //test
  // this.proteamcomponent.loadDatatableProTeam();
  // this.proteamcomponent.refreshDatatableProTeam();
  this.loadprodac=true;
 }
 proprofilecodetabclicked(){ //test
  // this.proteamcomponent.loadDatatableProTeam();
  // this.proteamcomponent.refreshDatatableProTeam();
  this.loadproprofilecode=true;
 }
 prodescriptiontabclicked(){ //test
  // this.proteamcomponent.loadDatatableProTeam();
  // this.proteamcomponent.refreshDatatableProTeam();
  this.loadprodescription=true;
 }


  //EDIT to use seperate child component for modal and call it from parent
  showProMainChildModal() {
    this.promainmodalcomponent.showChildModal();
  }
  //ADD to use seperate child component for modal and call it from parent
  showProMainChildModalAdd() {
    this.promainmodalcomponent.showChildModalAdd();
  }

  callProMainChildModalDelete() {
    // alert(this.id);
    // return;
    this.promainmodalcomponent.callChildModalDelete(this.id);
  }

  ngOnInit() {
    
    // this.loadEmpDetail();
    this.fillProjectCmb();
    // //child tabs initially will be updated using parent to child @Input()
    // //On emp cmb search child tabs will be updated using this.empdegreecomponent.loadAngularDatatable(); in findbyemployeeid() method
    
    // // option1
    // this.id = this.activatedRoute.snapshot.paramMap.get('id'); //get id parameter
    // this.emp = this.loadEmpDetail();
    // this.fillEmpCmb();


    // OPTION2  https://www.youtube.com/watch?v=b4zpvh_saic&list=PL1BztTYDF-QNrtkvjkT6Wjc8es7QB4Gty&index=65
    // ngOnInit() only called once so empcmb click will not refresh page. So we are using observable 
    this.activatedRoute.paramMap.subscribe((param)=>{
      this.id=param.get('id')
      this.project = this.loadProjectDetail();
      this.findid=this.id; // set the initial value findid
    })
 
  }



  findbyprojectid() {
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

    

  }



// Call Child tables refresh methods
// Moved all refresh codes from child tables from "ngAfterViewInit()" method 
// Because child tables are already loaded in "loadDatatableProTeam". So datatables are called twice on load
// But we need to refresh child tables on combo search "GO" btn clicked. So we call "refreshAllChildTables" on "GO" btn click
  refreshAllChildTables(){
    this.proteamcomponent.refreshDatatableProTeam();
    this.proprofilecomponent.refreshDatatableProProfilecodeSF330();
    this.prodaccomponent.refreshDatatableProDac();
    this.prodescriptioncomponent.refreshDatatableProDescription();
  }



  loadProjectDetail() {

    // alert("empdetail loaded");

    // this.id = this.activatedRoute.snapshot.paramMap.get('id'); //get id parameter
    this.loading2 = true;

    this.projectService.getProjectdetail(this.id).subscribe(resp => {
      this.project = resp;
      // console.log(resp);

      //{{emp.empid}} giving error in console so converted to "empid" only for interpolation 
      // this.firstname= resp.empid,

      this.projectno = resp.ProjectNo; //2023 using it for showing photo
      // this.comid = resp.ComID; //2023
      // this.primaryprojecttype = resp.PrimaryProjectType;
      // // searchsecondaryprojecttype = $('#SecondaryProjectType').val();
      // this.projectrole = resp.ProjectRole;
      // this.ownercategory = resp.OwnerCategory;
      // this.owner = resp.Owner;
      // this.client = resp.Client;
      // this.projectstatus = resp.ProjectStatus;
      // this.empid = resp.EmpID;
      // this.empprojectrole = resp.EmpProjectRole;
      // // this.firmfeeoperator = resp.;
      // this.firmfee = resp.FirmFee;
      // // this.constcostoperator = resp.;
      // this.constcost = resp.ConstructionCost;
      // // this.expstartdateoperator = resp.;
      // this.expstartdate = resp.DurationFrom;
      // // this.expenddateoperator = resp.;
      // this.expenddate = resp.DurationTo;
      // // this.excludeieprojects = resp.;
      // // this.excludeongoingprojects = resp.;
      // // this.secondaryprojecttype.;

      this.loading2 = false;
      this.fillProjectCmb();// added 2023 to refresh cmb when new emp added

    },
      err => {
        alert(err.message);
        this.loading2 = false;
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




 
}
