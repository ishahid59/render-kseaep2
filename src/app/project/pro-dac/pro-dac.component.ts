// import { Component } from '@angular/core';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../../services/common.service';
// import { EmployeeService } from '../../services/employee/employee.service';
import { ProjectService } from '../../services/project/project.service';
import { ProdacService } from '../../services/project/prodac.service';
import { DatePipe, Location } from '@angular/common';// datepipe used to convert date format to show in html date element
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, forkJoin, of } from 'rxjs';
import { ProjectSearchService } from '../../services/project/project-search.service';

@Component({
  selector: 'app-pro-dac',
  templateUrl: './pro-dac.component.html',
  styleUrls: ['./pro-dac.component.css']
})
export class ProDacComponent {
  constructor(private http: HttpClient,private projectsearchservice: ProjectSearchService, private projectService: ProjectService, private proDacService: ProdacService, public datePipe: DatePipe, private router: Router, public activatedRoute: ActivatedRoute, private commonService: CommonService) {
  }


  // @Input() childempid:any;
  @Input() childprojectid: any;



  // dtOptions: DataTables.Settings = {};
  dtOptions: any = {}; // any is used instead of DataTables.Settings else datatable export buttons wont show

  // To refresh datatable with search parameters without using destroy
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective; //used "!" to avoid initialization of variable. Also can use strict:false in tsconfig.json

  proTeamData: any = []; // in angular should ([]) for array
  prodac:any={};
  formErrors: any = [{}];
  loading2: boolean = false;
  componentLoaded = false;
test:boolean=true;
  modalClicked = "editModal";

  
  //  cmbEmpDegree: any = ([]);
  //  cmbState: any = ([]);
  //  cmbCountry: any = ([]);
  CmbEmpProjectRole: any = ([]);
  CmbEmpMain: any = ([]);


  //ANGULAR FORMGROUP is used to pass Value to frm control without jquery and better error handling
  //ANGULAR VALIDATORS  https://angular.io/api/forms/Validators
  //*************************************************************************** */
  // proTeamFormGroup = new FormGroup({
  //   id: new FormControl(0),
  //   empprojectrole: new FormControl(0, [Validators.required, Validators.min(1)]),
  //   secprojectrole: new FormControl(0),
  //   dutiesandresponsibilities: new FormControl(''),
  //   durationfrom: new FormControl(''),
  //   durationto: new FormControl(''),
  //   monthsofexp: new FormControl(''),
  //   notes: new FormControl(''),
  //   projectid: new FormControl(0),
  //   empid: new FormControl(0,[Validators.required, Validators.min(1)]),
  // });

  proDacFormGroup = new FormGroup({
    actualcompletiondate: new FormControl(''),
    actualcompletionyear: new FormControl(''),
    biddate: new FormControl(''),
    bidyear: new FormControl(''),
    completiondatecomment: new FormControl(''),
    constructioncompletiondate: new FormControl(''),
    constructioncompletionyear: new FormControl(''),
    constructioncost: new FormControl(''),
    contractdate: new FormControl(''),
    contractyear: new FormControl(''),
    estcompletiondate: new FormControl(''),
    estcompletionyear: new FormControl(''),
    firmcostcomment: new FormControl(''),
    firmfee: new FormControl(''),
    id: new FormControl(0),
    notes: new FormControl(''),
    ntpstartdate: new FormControl(''),
    ntpstartyear: new FormControl(''),
    persentagecomplete: new FormControl(''),
    persentagecompletedate: new FormControl(''),
    projectid: new FormControl(0),
    projectonhold: new FormControl(0),
    totalprojectcostcomment: new FormControl(''),
    totalprojectfee: new FormControl(''),
  });







//   ActualCompletionDate
// ActualCompletionYear
// BidDate
// BidYear
// CompletionDateComment
// ConstructionCompletionDate
// ConstructionCompletionYear
// ConstructionCost
// ContractDate
// ContractYear
// EstCompletionDate
// EstCompletionYear
// FirmCostComment
// FirmFee
// ID
// Notes
// NTPStartDate
// NTPStartYear
// PersentageComplete
// PersentageCompleteDate
// ProjectID
// ProjectOnHold
// TotalProjectCostComment
// TotalProjectFee


  ngOnInit() {
    // this.loadDatatableProTeam();

    // ngOnInit is called only once. So for all next calls Observable is used so that it can always listen
    // https://www.youtube.com/watch?v=b4zpvh_saic&list=PL1BztTYDF-QNrtkvjkT6Wjc8es7QB4Gty&index=65
    if (!this.componentLoaded) {
      this.loadProDacDetail(this.childprojectid); //loadDatatableProTeam() has to be called for first time only. Then refreshDatatableEmpDegree() is called everytime
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


  /* to remove "no matching records found" even if angular-datatable is not empty */
  // https://github.com/l-lin/angular-datatables/issues/1260
  ngAfterViewInit(): void {
    // var that = this;
    // this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //   dtInstance.on('draw.dt', function () {
    //     if (that.proTeamData.length > 0) {
    //       $('.dataTables_empty').remove();
    //     }
    //   });
    // });
 
    
    // // // ngOnInit is called only once. So for all next calls Observable is used so that it can always listen
    // // // https://www.youtube.com/watch?v=b4zpvh_saic&list=PL1BztTYDF-QNrtkvjkT6Wjc8es7QB4Gty&index=65
    // // // following observer code moved from ngOnInit() to here ngAfterViewInit()
    // this.activatedRoute.paramMap.subscribe((param) => {
    //   this.childprojectid = param.get('id')
    //   this.refreshDatatableProTeam();// refresh instance of angular-datatable
    // })


    // this.loadProDacDetail(115);

  }




  refreshDatatableProDac(){
       this.activatedRoute.paramMap.subscribe((param) => {
      this.childprojectid = param.get('id')
       this.loadProDacDetail(this.childprojectid);
    })
   

    
  }







  loadProDacDetail(e:any){

    // this.clearForm(); //clear the form of previous edit data
    // this.modalClicked="editModal"
    // this.loading2=true;
    // $('#proteamdetailmodalShow').click(); 
    
    this.proDacService.getProDacDetail(e).subscribe(resp => {

      //this.editData = resp; //use .data after resp for post method. Now using FormFroup to put data
      // **FormFroup and FormControl is used to pass value to edit form instead of [(ngModel)]
      // this.empid=resp.empid; // to pass to child modal if used
  
      // this.empid = resp.EmpID; // to pass to child modal if used
     this.prodac=resp;
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




 
}
