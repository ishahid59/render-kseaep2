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
// test:boolean=true;
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
    actualcompletionyear: new FormControl('' ,[Validators.required, Validators.minLength(4), Validators.maxLength(4)]),
    biddate: new FormControl(''),
    bidyear: new FormControl('' ,[Validators.required, Validators.minLength(4), Validators.maxLength(4)]),
    completiondatecomment: new FormControl(''),
    constructioncompletiondate: new FormControl(''),
    constructioncompletionyear: new FormControl('' ,[Validators.required, Validators.minLength(4), Validators.maxLength(4)]),
    constructioncost: new FormControl(''),
    contractdate: new FormControl('',[Validators.required]),
    contractyear: new FormControl('' ,[Validators.required, Validators.minLength(4), Validators.maxLength(4)]),
    estcompletiondate: new FormControl(''),
    estcompletionyear: new FormControl('' ,[Validators.required, Validators.minLength(4), Validators.maxLength(4)]),
    firmcostcomment: new FormControl(''),
    firmfee: new FormControl(''),
    id: new FormControl(0),
    notes: new FormControl(''),
    ntpstartdate: new FormControl(''),
    ntpstartyear: new FormControl('' ,[Validators.required, Validators.minLength(4), Validators.maxLength(4)]),
    persentagecomplete: new FormControl(''),
    persentagecompletedate: new FormControl(''),
    projectid: new FormControl(0),
    projectonhold: new FormControl(0),
    totalprojectcostcomment: new FormControl(''),
    totalprojectfee: new FormControl(''),
  });


  // set the getters for validation fields. convenient to use in html for validation
  get contractdate() {
    return this.proDacFormGroup.get('contractdate');
  }
  get bidyear() {
    return this.proDacFormGroup.get('bidyear');
  }
  get contractyear() {
    return this.proDacFormGroup.get('contractyear');
  }
  get ntpstartyear() {
    return this.proDacFormGroup.get('ntpstartyear');
  }
  get estcompletionyear() {
    return this.proDacFormGroup.get('estcompletionyear');
  }
  get actualcompletionyear() {
    return this.proDacFormGroup.get('actualcompletionyear');
  }
  get constructioncompletionyear() {
    return this.proDacFormGroup.get('constructioncompletionyear');
  }


// ActualCompletionDate
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


  clearForm(){
    // this.proDacFormGroup.controls['id'].setValue(maxid + 1);
    this.proDacFormGroup.controls['projectid'].setValue(this.childprojectid);//(this.childprojectid);
    this.proDacFormGroup.controls['biddate'].setValue(null);
    this.proDacFormGroup.controls['contractdate'].setValue(null);
    this.proDacFormGroup.controls['ntpstartdate'].setValue(null);
    this.proDacFormGroup.controls['estcompletiondate'].setValue(null);
    this.proDacFormGroup.controls['actualcompletiondate'].setValue(null);
    this.proDacFormGroup.controls['constructioncompletiondate'].setValue(null);
    this.proDacFormGroup.controls['persentagecompletedate'].setValue(null);
    this.proDacFormGroup.controls['bidyear'].setValue('');
    this.proDacFormGroup.controls['contractyear'].setValue('');
    this.proDacFormGroup.controls['ntpstartyear'].setValue('');
    this.proDacFormGroup.controls['estcompletionyear'].setValue('');
    this.proDacFormGroup.controls['actualcompletionyear'].setValue('');
    this.proDacFormGroup.controls['constructioncompletionyear'].setValue('');
    this.proDacFormGroup.controls['persentagecomplete'].setValue('');
    this.proDacFormGroup.controls['constructioncost'].setValue('');
    this.proDacFormGroup.controls['totalprojectfee'].setValue('');
    this.proDacFormGroup.controls['firmfee'].setValue('');
    this.proDacFormGroup.controls['completiondatecomment'].setValue('');
    this.proDacFormGroup.controls['totalprojectcostcomment'].setValue('');
    this.proDacFormGroup.controls['firmcostcomment'].setValue('');
    this.proDacFormGroup.controls['notes'].setValue('');
    this.proDacFormGroup.controls['projectonhold'].setValue(0);

  }




  showProDacAddModal() {

    // alert("addModal");
    this.modalClicked = "addModal";
    // $('#btnProTeamEditModalShow').click(); 

    // alert(this.childempid);
    //Get the maxid
    //***************************** */

    let maxid = 0;
    this.proDacService.getMaxProDacID().subscribe(resp => {

      maxid = resp[0].maxprodacid;

      // alert(maxid);

      //**employeeFormGroup control within the subscribe so tha values are set after maxid is retrieved from database  */
      // clear form group since same group is used for edit and add
      // Now formgroup is used instead of data object to pass value
      this.proDacFormGroup.reset(); // to clear the previous validations
      // Manualy set default values since reset() will will turn values to null: // https://stackoverflow.com/questions/51448764/why-are-formgroup-controls-null-after-formgroup-reset
      // this.employeeFormGroup.controls['empid'].setValue(0);


      this.proDacFormGroup.controls['id'].setValue(maxid + 1);
      this.proDacFormGroup.controls['projectid'].setValue(this.childprojectid);//(this.childprojectid);
      this.proDacFormGroup.controls['biddate'].setValue(null);
      this.proDacFormGroup.controls['contractdate'].setValue(null);
      this.proDacFormGroup.controls['ntpstartdate'].setValue(null);
      this.proDacFormGroup.controls['estcompletiondate'].setValue(null);
      this.proDacFormGroup.controls['actualcompletiondate'].setValue(null);
      this.proDacFormGroup.controls['constructioncompletiondate'].setValue(null);
      this.proDacFormGroup.controls['persentagecompletedate'].setValue(null);
      this.proDacFormGroup.controls['bidyear'].setValue('');
      this.proDacFormGroup.controls['contractyear'].setValue('');
      this.proDacFormGroup.controls['ntpstartyear'].setValue('');
      this.proDacFormGroup.controls['estcompletionyear'].setValue('');
      this.proDacFormGroup.controls['actualcompletionyear'].setValue('');
      this.proDacFormGroup.controls['constructioncompletionyear'].setValue('');
      this.proDacFormGroup.controls['persentagecomplete'].setValue('');
      this.proDacFormGroup.controls['constructioncost'].setValue('');
      this.proDacFormGroup.controls['totalprojectfee'].setValue('');
      this.proDacFormGroup.controls['firmfee'].setValue('');
      this.proDacFormGroup.controls['completiondatecomment'].setValue('');
      this.proDacFormGroup.controls['totalprojectcostcomment'].setValue('');
      this.proDacFormGroup.controls['firmcostcomment'].setValue('');
      this.proDacFormGroup.controls['notes'].setValue('');
      this.proDacFormGroup.controls['projectonhold'].setValue(0);


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






  showProDacEditModal(e:any) {

    this.clearForm(); //clear the form of previous edit data
    this.modalClicked="editModal"
    this.loading2=true;

    // $('#btnProDacEditModalShow').click(); 
    this.proDacService.getProDac(e).subscribe(resp => {

      //this.editData = resp; //use .data after resp for post method. Now using FormFroup to put data
      // **FormFroup and FormControl is used to pass value to edit form instead of [(ngModel)]
      // this.empid=resp.empid; // to pass to child modal if used

      // this.empid = resp.EmpID; // to pass to child modal if used
     
      // this.empDegreeFormGroup.patchValue(resp); 
      // OR

      this.proDacFormGroup.controls['id'].setValue(resp.ID);
      this.proDacFormGroup.controls['projectid'].setValue(resp.ProjectID);//(this.childprojectid);
      // this.proDacFormGroup.controls['biddate'].setValue(resp.BidDate);
      let x=this.datePipe.transform(resp.BidDate, "yyyy-MM-dd");
      this.proDacFormGroup.controls['biddate'].setValue(this.datePipe.transform(resp.BidDate, "yyyy-MM-dd"));
      this.proDacFormGroup.controls['contractdate'].setValue(this.datePipe.transform(resp.ContractDate, "yyyy-MM-dd"));
      this.proDacFormGroup.controls['ntpstartdate'].setValue(this.datePipe.transform(resp.NTPStartDate, "yyyy-MM-dd"));
      this.proDacFormGroup.controls['estcompletiondate'].setValue(this.datePipe.transform(resp.EstCompletionDate, "yyyy-MM-dd"));
      this.proDacFormGroup.controls['actualcompletiondate'].setValue(this.datePipe.transform(resp.ActualCompletionDate, "yyyy-MM-dd"));
      this.proDacFormGroup.controls['constructioncompletiondate'].setValue(this.datePipe.transform(resp.ConstructionCompletionDate, "yyyy-MM-dd"));
      this.proDacFormGroup.controls['persentagecompletedate'].setValue(this.datePipe.transform(resp.PersentageCompleteDate, "yyyy-MM-dd"));
      this.proDacFormGroup.controls['bidyear'].setValue(resp.BidYear);
      this.proDacFormGroup.controls['contractyear'].setValue(resp.ContractYear);
      this.proDacFormGroup.controls['ntpstartyear'].setValue(resp.NTPStartYear);
      this.proDacFormGroup.controls['estcompletionyear'].setValue(resp.EstCompletionYear);
      this.proDacFormGroup.controls['actualcompletionyear'].setValue(resp.ActualCompletionYear);
      this.proDacFormGroup.controls['constructioncompletionyear'].setValue(resp.ConstructionCompletionYear);
      this.proDacFormGroup.controls['persentagecomplete'].setValue(resp.PersentageComplete);
      this.proDacFormGroup.controls['constructioncost'].setValue(resp.ConstructionCost);
      this.proDacFormGroup.controls['totalprojectfee'].setValue(resp.TotalProjectFee);
      this.proDacFormGroup.controls['firmfee'].setValue(resp.FirmFee);
      this.proDacFormGroup.controls['completiondatecomment'].setValue(resp.CompletionDateComment);
      this.proDacFormGroup.controls['totalprojectcostcomment'].setValue(resp.TotalProjectCostComment);
      this.proDacFormGroup.controls['firmcostcomment'].setValue(resp.FirmCostComment);
      this.proDacFormGroup.controls['notes'].setValue(resp.Notes);
      this.proDacFormGroup.controls['projectonhold'].setValue(resp.ProjectOnHold);

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



  // saveEmp common for edit and add. Option to call 2 function from here 
  saveProDac() {

    //   // check internet connection first
    //   var onlineOffline = navigator.onLine;
    //   if (onlineOffline===false) {
    //     alert("no internet connection");
    //     return;
    //   }
    if (this.modalClicked == "editModal") {
      this.updateProDac();
    }
    if (this.modalClicked == "addModal") {
      this.addProDac();
    }
  }





  addProDac() {

    this.loading2 = true;

    // *** 2023 Note If date is cleared the it always has a value of '' which tries to save 0000-00-00 00:00:00 in mysql server resulting err;
    // 2023 SO handle it in front end and save null when value is '' dont have to do antthing in backend
    if (this.proDacFormGroup.controls['biddate'].value === '') {//0000-00-00 00:00:00
      this.proDacFormGroup.controls['biddate'].setValue(null);
    }
    if (this.proDacFormGroup.controls['contractdate'].value === '') {//0000-00-00 00:00:00
      this.proDacFormGroup.controls['contractdate'].setValue(null);
    }
    if (this.proDacFormGroup.controls['ntpstartdate'].value === '') {//0000-00-00 00:00:00
      this.proDacFormGroup.controls['ntpstartdate'].setValue(null);
    }
    if (this.proDacFormGroup.controls['estcompletiondate'].value === '') {//0000-00-00 00:00:00
      this.proDacFormGroup.controls['estcompletiondate'].setValue(null);
    }
    if (this.proDacFormGroup.controls['actualcompletiondate'].value === '') {//0000-00-00 00:00:00
      this.proDacFormGroup.controls['actualcompletiondate'].setValue(null);
    }
    if (this.proDacFormGroup.controls['constructioncompletiondate'].value === '') {//0000-00-00 00:00:00
      this.proDacFormGroup.controls['constructioncompletiondate'].setValue(null);
    }
    if (this.proDacFormGroup.controls['persentagecompletedate'].value === '') {//0000-00-00 00:00:00
      this.proDacFormGroup.controls['persentagecompletedate'].setValue(null);
    }

    this.proDacService.addProDac(this.proDacFormGroup.value).subscribe(resp => {
      // $("#empeditmodal").modal("hide");
      $("#btnProDacEditCloseModal").click();
      // this.refreshEmployeeDatatable();
      this.loading2 = false;
      // this.refreshEmpDetail.next('somePhone'); //calling  loadEmpDetail() from parent component
      // this.router.navigateByUrl('Employee') //navigate to AngularDatatable
      //this.router.navigateByUrl('Empdetail/2') //navigate to AngularDatatable
      // var a= this.getMaxId();
      // this.router.navigateByUrl('Empdetail/' + a) //navigate to AngularDatatable // not working

      this.refreshDatatableProDac();
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
  
  
  
  
  updateProDac() {

    // **FormFroup and FormControl is used to pass value to save form instead of [(ngModel)]
    this.loading2 = true;

    if (this.proDacFormGroup.invalid) {
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
    if (this.proDacFormGroup.controls['biddate'].value === '') {//0000-00-00 00:00:00
      this.proDacFormGroup.controls['biddate'].setValue(null);
    }
    if (this.proDacFormGroup.controls['contractdate'].value === '') {//0000-00-00 00:00:00
      this.proDacFormGroup.controls['contractdate'].setValue(null);
    }
    if (this.proDacFormGroup.controls['ntpstartdate'].value === '') {//0000-00-00 00:00:00
      this.proDacFormGroup.controls['ntpstartdate'].setValue(null);
    }
    if (this.proDacFormGroup.controls['estcompletiondate'].value === '') {//0000-00-00 00:00:00
      this.proDacFormGroup.controls['estcompletiondate'].setValue(null);
    }
    if (this.proDacFormGroup.controls['actualcompletiondate'].value === '') {//0000-00-00 00:00:00
      this.proDacFormGroup.controls['actualcompletiondate'].setValue(null);
    }
    if (this.proDacFormGroup.controls['constructioncompletiondate'].value === '') {//0000-00-00 00:00:00
      this.proDacFormGroup.controls['constructioncompletiondate'].setValue(null);
    }
    if (this.proDacFormGroup.controls['persentagecompletedate'].value === '') {//0000-00-00 00:00:00
      this.proDacFormGroup.controls['persentagecompletedate'].setValue(null);
    }


    this.proDacService.updateProDac(this.proDacFormGroup.value).subscribe(resp => {

      // $("#empeditmodal").modal("hide");
      $("#btnProDacEditCloseModal").click();
      // this.refreshEmployeeDatatable();
      // this.refreshEmpDetail.next('somePhone'); //calling  loadEmpDetail() from parent component
      this.refreshDatatableProDac();
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



  clearFormErrors(){

  }

 
}
