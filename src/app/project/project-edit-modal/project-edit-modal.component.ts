// import { Component } from '@angular/core';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../../services/common.service';
import { EmployeeService } from '../../services/employee/employee.service';
import { ProjectService } from '../../services/project/project.service';
import { DatePipe } from '@angular/common';// datepipe used to convert date format to show in html date element
import { Router } from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';
import { ProjectSearchService } from '../../services/project/project-search.service';
// import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-project-edit-modal',
  templateUrl: './project-edit-modal.component.html',
  styleUrls: ['./project-edit-modal.component.css']
})
export class ProjectEditModalComponent {

  // // dropdownList = [];
  // dropdownList : any = [];
  // selectedItems : any = [];
  // // dropdownSettings = {};

  // dropdownSettings:IDropdownSettings;
  constructor(private http: HttpClient, private projectService: ProjectService, private projectsearchservice: ProjectSearchService, public datePipe: DatePipe, private router: Router, private commonService: CommonService) {



    this.list =
      [
        { name: 'India', checked: false },
        { name: 'US', checked: false },
        { name: 'China', checked: false },
        { name: 'France', checked: false },
        { name: 'France', checked: false },
        { name: 'France', checked: false },
        { name: 'France', checked: false },
      ]
  }


  @Input() projectid: any = null;

  // https://stackoverflow.com/questions/43323272/angular-4-call-parent-method-in-a-child-component
  //to use seperate child component for modal and call it from parent
  // @Output() refreshEmployeeDatatable = new EventEmitter<string>();
  // @Output() refreshEmpDetail = new EventEmitter<string>();
  @Output() refreshProjectDatatable = new EventEmitter<string>();
  @Output() refreshProjectDetail = new EventEmitter<string>();


  list: any[];

  myData: any = ([]); // in angular should ([]) for array
  // empid: any = 0; // to pass to child modal if used

  // cmbJobtitle: any = ([]);
  // cmbRegistration: any = ([]);
  CmbProProjectType: any = ([]);
  CmbProPRole: any = ([]);
  CmbEmpMain: any = ([]);
  CmbProOCategory: any = ([]);
  CmbComMain: any = ([]);
  CmbCaoMain: any = ([]);
  CmbProStatus: any = ([]);
  CmbEmpProjectRole: any = ([]);
  CmbProposalMain: any = ([]);

  formErrors: any = [{}];
  loading2: boolean = false;
  modalClicked = "editModal";

  secprojecttype: any = ''

  //ANGULAR FORMGROUP is used to pass Value to frm control without jquery and better error handling
  //ANGULAR VALIDATORS  https://angular.io/api/forms/Validators
  //*************************************************************************** */
  projectFormGroup = new FormGroup({

    projectid: new FormControl(0),
    projectname: new FormControl('', [Validators.required]), // added 2023
    projectrole: new FormControl(0, [Validators.required, Validators.min(1)]),
    awardyear: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]),
    projectno: new FormControl('', [Validators.required]),
    projectmanager: new FormControl(0),
    ownercategory: new FormControl(0),
    comid: new FormControl(0),
    primaryprojecttype: new FormControl(0),
    secondaryprojecttype: new FormControl(''),
    owner: new FormControl(0),
    client: new FormControl(0),
    projectagreementno: new FormControl(''),
    projectstatus: new FormControl(0),
    proposalid: new FormControl(0),

  });

  CmbProjectTypeData: any = [];

  // for validation fields set the getters for convenience to use in html for validation
  get projectno() {
    return this.projectFormGroup.get('projectno');
  }
  get projectname() {
    return this.projectFormGroup.get('projectname');
  }
  get awardyear() {
    return this.projectFormGroup.get('awardyear');
  }
  get projectrole() {
    return this.projectFormGroup.get('projectrole');
  }
  // get jobtitle() {
  //   return this.projectFormGroup.get('jobtitle');
  // }

  example8model: any = []
  example8data: any = []



  clearMultiSelect2() {
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
    $("#clearMultiSelect2").click();
  }



  public ngOnInit(): void {

    let that = this;
    // wait for the datatable data load first
    setTimeout(() => {
      this.fillAllCmb();
    }, 100);


    // FIL CMB secproject now here instead of js file so that api address could be dynamic 
    // but multiselect dropdown has to be initilized in the js file which is loaded in ngOnInit()
    // this.fillsecprojecttype();
    // now moved to fillAllCmb()



    // var options = [
    //   {label: 'Option 1', title: 'Option 1', value: '1'},
    //   {label: 'Option 2', title: 'Option 2', value: '2'},
    //   {label: 'Option 3', title: 'Option 3', value: '3'},
    //   {label: 'Option 4', title: 'Option 4', value: '4'},
    //   {label: 'Option 5', title: 'Option 5', value: '5'},
    //   {label: 'Option 6', title: 'Option 6', value: '6'}
    // ];

    // (<any>$('#multiple-checkboxes')).multiselect('dataprovider', options);
    // (<any>$("#multiple-checkboxes")).multiselect('rebuild');




    // // WORKING secproject cmb should be filled in ngOnInit for multiselect
    // var items: any = [];
    // items = [{ "ListID": 1, "Str1": "Bridge Design", "Str2": null }, { "ListID": 2, "Str1": "Bridge Inspection", "Str2": null }, { "ListID": 3, "Str1": "Building Architectural Projects", "Str2": null }, { "ListID": 4, "Str1": "Building Design", "Str2": null }, { "ListID": 5, "Str1": "Building Inspection", "Str2": null }, { "ListID": 6, "Str1": "Construction inspection of buildings", "Str2": null }, { "ListID": 7, "Str1": "Construction Inspection of Roadways & Bridges", "Str2": null }, { "ListID": 8, "Str1": "Construction management of buildings", "Str2": null }, { "ListID": 9, "Str1": "Construction Management of Roadways & Bridges", "Str2": null }, { "ListID": 10, "Str1": "Drainage Design", "Str2": null }, { "ListID": 11, "Str1": "Electrical Engineering", "Str2": null }, { "ListID": 12, "Str1": "Final Design of Route 29", "Str2": null }, { "ListID": 13, "Str1": "Geotechnical Engineering", "Str2": null }, { "ListID": 14, "Str1": "GIS Mapping", "Str2": null }, { "ListID": 15, "Str1": "HVAC Engineering", "Str2": null }, { "ListID": 16, "Str1": "Hydraulic Engineering", "Str2": null }, { "ListID": 17, "Str1": "Land Surveying", "Str2": null }, { "ListID": 18, "Str1": "Landscape Architecture", "Str2": null }, { "ListID": 19, "Str1": "Mechanical Engineering", "Str2": null }, { "ListID": 20, "Str1": "Other Bridge Projects", "Str2": null }, { "ListID": 21, "Str1": "Other Building Projects", "Str2": null }, { "ListID": 22, "Str1": "Other Projects", "Str2": null }, { "ListID": 23, "Str1": "Other Railroad Projects", "Str2": null }, { "ListID": 24, "Str1": "Other Roadways Projects", "Str2": null }, { "ListID": 25, "Str1": "Parking Lot Design", "Str2": null }, { "ListID": 26, "Str1": "Railroad Station design", "Str2": null }, { "ListID": 27, "Str1": "Roadway Design", "Str2": null }, { "ListID": 28, "Str1": "Sanitary Engineering", "Str2": null }, { "ListID": 29, "Str1": "Traffic Data Collection", "Str2": null }, { "ListID": 30, "Str1": "Traffic Engineering", "Str2": null }, { "ListID": 31, "Str1": "Transportation Planning", "Str2": null }, { "ListID": 32, "Str1": "Underwater Inspection", "Str2": null }, { "ListID": 33, "Str1": "Urban Planning", "Str2": null }, { "ListID": 34, "Str1": "Utilities Engineering", "Str2": null }, { "ListID": 35, "Str1": "Water Supply Engineering", "Str2": null }];
    // $.each(items, function (i, option) {
    //   $('#multiple-checkboxes2').append("<option value=" + items[i].ListID + ">" + items[i].Str1 + "</option>"); //append to select itself
    //   //  $("#multiproeditsecproject option[value='"+val+"']").attr("selected", "selected");
    // })
    //   (<any>$("#multiple-checkboxes2")).multiselect('rebuild');


    // NOT WORKING
    // // multiproeditsecproject. placed here instead of mounted else dropdown wont fill after new project is searched 
    // // also use different id for each multiselect to avoid conflict 
    // var data = [];
    // for (var i = 1; i < items.length; i++) { // note i started from 1 instead of 0 to exclude blank row
    //     var obj={label: items[i].Str1, value: items[i].ListID};
    //     data.push(obj);
    // }
    // (<any>$("#multiproeditsecproject")).multiselect('dataprovider', data);



    // this.projectsearchservice.getSecProjectTypeValue(this.projectid).subscribe(resp => {
    //   this.secprojecttype=resp.SecondaryProjectType;
    //   },
    //     err => {
    //       // For Validation errors
    //       if (err.status === 422 || err.status === 400) {
    //         // alert(err.error.errors[0].msg);
    //         this.formErrors = err.error.errors;
    //       }
    //       else {
    //         alert(err.message);
    //       }
    //     });


  }





  // now using this.CmbProProjectType which is already filled
  fillsecprojecttype() {
    var items: any = [];
    items = this.CmbProProjectType;
    for (let i = 1; i < items.length; i++) {
      $('#multiple-checkboxes2').append("<option value=" + items[i].ListID + ">" + items[i].Str1 + "</option>"); //append to select itself
      //  (<any>$('#multiple-checkboxes')).append("<option value=" + items[i].label + ">" + items[i].title + "</option>"); //append to select itself
    }
    (<any>$("#multiple-checkboxes2")).multiselect('rebuild');



    // // WORKING
    // // var items: any = this.projectFormGroup.controls['secondaryprojecttype'].value;
    // // alert("items" + items)
    // // items = $('#secondaryprojecttype').val;
    // // alert("items" + x)
    // let items2: any = '21,27,25,10';//this.secprojecttype;

    // $.each(items2.split(','), function (idx, val) {
    //   $("#multiple-checkboxes2 option[value='" + val + "']").attr("selected", "selected");
    //   // $("#multiple-checkboxes option[value='"+val+"']").prop('selected', true); // use prop for latest jquery
    // });
    // (<any>$("#multiple-checkboxes2")).multiselect('rebuild'); // **IMPORTANT


}






  ngAfterViewInit(): void {



    
    
    




    

    // // (<any>$("##multiple-checkboxes option:selected")).prop("selected", false);// clear Bootstrap multiselect
    //   (<any>$("##multiple-checkboxes")).multiselect("clearSelection");// clear Bootstrap multiselect
    //   (<any>$("##multiple-checkboxes")).multiselect( 'refresh' );// refresh Bootstrap multiselect

    //   // let items:any=[21,27,25];//this.secprojecttype;
    //   // let items:any=this.secprojecttype;
    //   let items: any = this.secprojecttype.split(",");
    // //  alert(resp.SecondaryProjectType)
    // for (let index = 0; index < items.length; index++) {
    //     //  alert(items[index] )
    //    $("#multiple-checkboxes option[value='" + items[index] + "']").attr("selected", "selected");
    //   // $("#multiple-checkboxes option[value='"+21+"']").prop('selected', true);
    // }
    // (<any>$("#multiple-checkboxes")).multiselect('rebuild'); // **IMPORTANT


    // $.each(items.split(','), function(idx, val) {
    //     $("#multiple-checkboxes option[value='"+val+"']").attr("selected", "selected");
    //     // $("#multiple-checkboxes option[value='"+val+"']").prop('selected', true); // use prop for latest jquery
    // }); 
    // (<any>$("#multiple-checkboxes")).multiselect('rebuild'); // **IMPORTANT




    //************************************************************************ */
    // this.projectsearchservice.getSecProjectTypeValue(this.projectid).subscribe(resp => {
    //   this.secprojecttype=resp.SecondaryProjectType;
    //   },
    //     err => {
    //       // For Validation errors
    //       if (err.status === 422 || err.status === 400) {
    //         // alert(err.error.errors[0].msg);
    //         this.formErrors = err.error.errors;
    //       }
    //       else {
    //         alert(err.message);
    //       }
    //     });
    //************************************************************************ */





    // this.fillSecProjectType();

    // After ngOnInit() select the SecProjectType items as per database
    // var items=this.formdata.SecondaryProjectType;
    // $.each(items.split(','), function(idx, val) {
    //     // $("#multiproeditsecproject option[value='"+val+"']").attr("selected", "selected");
    //     $("#multiproeditsecproject option[value='"+val+"']").prop('selected', true); // use prop for latest jquery
    //     $("#multiproeditsecproject").multiselect('rebuild'); // **IMPORTANT
    // }); 



    //     //WORKING
    //     var items:any=this.projectFormGroup.controls['secondaryprojecttype'].value;
    //  alert("items" + items)
    //       items=$('#secondaryprojecttype').val;
    //       alert("items" + x)
    //       let items:any='21,27,25,10';//this.secprojecttype;

    //     $.each(items.split(','), function(idx, val) {
    //         $("#multiple-checkboxes option[value='"+val+"']").attr("selected", "selected");
    //         // $("#multiple-checkboxes option[value='"+val+"']").prop('selected', true); // use prop for latest jquery
    //     }); 
    //     (<any>$("#multiple-checkboxes")).multiselect('rebuild'); // **IMPORTANT


    // alert("out loop: "+items);

    // setTimeout(function () {

    //   // let items:any=that.secprojecttype;//.split(",");//this.secprojecttype;
    //   // $.each(items.split(','), function (idx, val) {
    //   //   // alert("in loop: "+items);
    //   //   $("#multiple-checkboxes option[value='" + val + "']").attr("selected", "selected");
    //   //   // $("#multiple-checkboxes option[value='"+val+"']").prop('selected', true); // use prop for latest jquery
    //   // });
    //   // (<any>$("#multiple-checkboxes")).multiselect('rebuild'); // **IMPORTANT


    // let items: any = that.secprojecttype.split(",");
    // let items:any=[21,27,25,10];//this.secprojecttype;
    // // alert(resp.SecondaryProjectType)
    // for (let index = 0; index < items.length; index++) {
    //   // alert(items[index] )
    //   $("#multiple-checkboxes option[value='" + items[index] + "']").attr("selected", "selected");
    //   // $("#multiple-checkboxes option[value='"+items[index]+"']").prop('selected', true);
    // }
    // (<any>$("#multiple-checkboxes")).multiselect('rebuild'); // **IMPORTANT

    // }, 5000);



    // $.each(items, function (i, option) {
    //   $('#multiple-checkboxes').append("<option value=" + items[i].ListID + ">" + items[i].Str1 + "</option>"); //append to select itself
    //   //  $("#multiproeditsecproject option[value='"+val+"']").attr("selected", "selected");
    // })
    //   (<any>$("#multiple-checkboxes")).multiselect('rebuild');


    // $.each(items.split(','), function(idx, val) {
    //     // $("#multiproeditsecproject option[value='"+val+"']").attr("selected", "selected");
    //     // $("#multiproeditsecproject option[value='"+val+"']").prop('selected', true); // use prop for latest jquery
    //     // $("#multiproeditsecproject").multiselect('rebuild'); // **IMPORTANT
    //     // $("#multiple-checkboxes option[value='"+val+"']").prop('selected', true); // use prop for latest jquery
    //     // (<any> $("#multiple-checkboxes")).multiselect('rebuild'); // **IMPORTANT

    //     $.each(items, function(i, option) {
    //       $('#multiple-checkboxes').append("<option value=" + 2+ ">" + 5 + "</option>") //append to select itself
    //         //  $("#multiproeditsecproject option[value='"+val+"']").attr("selected", "selected");
    //     })
    // }); 

    //       this.projectsearchservice.getCmbProjectType().subscribe(resp => {
    // // console.log(resp.data);


  }




  showChildModal() {

    $('#btnProEditModalShow').click();
    this.modalClicked = "editModal";
    this.showProEditModal();

    // // (<any>$("##multiple-checkboxes option:selected")).prop("selected", false);// clear Bootstrap multiselect
    // (<any>$("##multiple-checkboxes")).multiselect("clearSelection");// clear Bootstrap multiselect
    // (<any>$("##multiple-checkboxes")).multiselect( 'refresh' );// refresh Bootstrap multiselect

    // // setTimeout(function () {
    //   // let items: any = this.secprojecttype.split(",");
    //   let items:any=[21,27,25,10];//this.secprojecttype;
    //   // let items:any='21,27,25,10';//this.secprojecttype;
    //   $.each(items.split(','), function(idx, val) {
    //       $("#multiple-checkboxes option[value='"+val+"']").attr("selected", "selected");
    //       // $("#multiple-checkboxes option[value='"+val+"']").prop('selected', true); // use prop for latest jquery
    //   }); 
    //   (<any>$("#multiple-checkboxes")).multiselect('rebuild'); // **IMPORTANT
    // // }, 3000);


  }



  showChildModalAdd() {
    $('#btnProEditModalShow').click();
    this.modalClicked = "addModal";
    this.showProAddModal();

  }

  callChildModalDelete(projectid: any) {
    this.deletePro(projectid);
  }


  clearForm() {

    this.projectFormGroup.controls['projectid'].setValue(0);
    this.projectFormGroup.controls['projectname'].setValue('');
    this.projectFormGroup.controls['projectrole'].setValue(0);
    this.projectFormGroup.controls['awardyear'].setValue('');
    this.projectFormGroup.controls['projectno'].setValue('');
    this.projectFormGroup.controls['projectmanager'].setValue(0);
    this.projectFormGroup.controls['ownercategory'].setValue(0);
    this.projectFormGroup.controls['comid'].setValue(0);
    this.projectFormGroup.controls['primaryprojecttype'].setValue(0);
    this.projectFormGroup.controls['secondaryprojecttype'].setValue('');
    this.projectFormGroup.controls['owner'].setValue(0);
    this.projectFormGroup.controls['client'].setValue(0);
    this.projectFormGroup.controls['projectagreementno'].setValue('');
    this.projectFormGroup.controls['projectstatus'].setValue(0);
    this.projectFormGroup.controls['proposalid'].setValue(0);

    // clear multiselect dropdown selected items for next projecct edit or add
    (<any>$("#multiple-checkboxes2")).multiselect('clearSelection'); // **IMPORTANT

  }




  showProEditModal() {

    let that = this;

    this.clearForm(); //clear the form of previous edit data
    this.modalClicked = "editModal"
    this.loading2 = true;



    this.projectService.getProjectFromModal(this.projectid).subscribe(resp => {

      //this.editData = resp; //use .data after resp for post method. Now using FormFroup to put data
      // **FormFroup and FormControl is used to pass value to edit form instead of [(ngModel)]
      // this.empid=resp.empid; // to pass to child modal if used
      this.projectid = resp.ProjectID; // to pass to child modal if used

      // this.employeeFormGroup.patchValue(resp);
      // OR
      // this.employeeFormGroup.controls['empid'].setValue(resp.empid);
      // this.employeeFormGroup.controls['firstname'].setValue(resp.firstname);
      // this.employeeFormGroup.controls['lastname'].setValue(resp.lastname);
      // this.employeeFormGroup.controls['jobtitle'].setValue(resp.jobtitle);
      // this.employeeFormGroup.controls['registration'].setValue(resp.registration);
      // this.employeeFormGroup.controls['hiredate'].setValue(resp.hiredate);
      // this.employeeFormGroup.controls['employee_consultant'].setValue(resp.employee_consultant);

      this.projectFormGroup.controls['projectid'].setValue(resp.ProjectID);
      this.projectFormGroup.controls['projectname'].setValue(resp.ProjectName);
      this.projectFormGroup.controls['projectrole'].setValue(resp.ProjectRole);
      this.projectFormGroup.controls['awardyear'].setValue(resp.AwardYear);
      this.projectFormGroup.controls['projectno'].setValue(resp.ProjectNo);
      this.projectFormGroup.controls['projectmanager'].setValue(resp.ProjectManager);
      this.projectFormGroup.controls['ownercategory'].setValue(resp.OwnerCategory);
      this.projectFormGroup.controls['comid'].setValue(resp.ComID);
      this.projectFormGroup.controls['primaryprojecttype'].setValue(resp.PrimaryProjectType);
      this.projectFormGroup.controls['secondaryprojecttype'].setValue(resp.SecondaryProjectType);
      this.projectFormGroup.controls['owner'].setValue(resp.Owner);
      this.projectFormGroup.controls['client'].setValue(resp.Client);
      this.projectFormGroup.controls['projectagreementno'].setValue(resp.ProjectAgreementNo);
      this.projectFormGroup.controls['projectstatus'].setValue(resp.ProjectStatus);
      this.projectFormGroup.controls['proposalid'].setValue(resp.ProposalID);

      // // Handle date : First datepipe used to convert date format, so that it can be shown in html input element properly
      // // But null date returns 1/1/1970. So condition is used to convert only when date is not null
      // if (this.projectFormGroup.controls['hiredate'].value !== null) {
      //   var date = new Date(resp.HireDate);
      //   var formattedDate = this.datePipe.transform(date, "yyyy-MM-dd");//output : 2018-02-13
      //   this.projectFormGroup.controls['hiredate'].setValue(formattedDate);
      // }


      //************************************************************************ */
      // SELECT ITEMS IN MULTISELECT DROPDOWN from coma sepaerted values      
      //************************************************************************ */

      // //WORKING
      // let items2: any = '21,27,25,10';//this.secprojecttype;
      // let items2: any = '1,2';//this.secprojecttype;
      // let arr: any = [1,2];
      let items2: any = this.projectFormGroup.controls['secondaryprojecttype'].value;// must use .toString() 

      $.each(items2.split(','), function (idx, val) {
        // $.each(arr, function (idx, val) {

        // $("#multiple-checkboxes2 option[value='" + val + "']").attr("selected", "selected");
        $("#multiple-checkboxes2 option[value='" + val + "']").prop('selected', true); // use prop for latest jquery
      });
      (<any>$("#multiple-checkboxes2")).multiselect('rebuild'); // **IMPORTANT


      //**************************************************************************** */

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




  fillsecproj(items: any) {
    // alert(this.projectid);
    // $.each(items.split(','), function (idx, val) {
    //   // $("#multiple-checkboxes option[value='" + val + "']").attr("selected", "selected");
    //   $("#multiple-checkboxes option[value='"+val+"']").prop('selected', true); // use prop for latest jquery

    // });
    // (<any>$("#multiple-checkboxes")).multiselect('rebuild'); // **IMPORTANT

  }


  showProAddModal() {

    this.modalClicked = "addModal"


    //Get the maxid
    //***************************** */
    let maxid = 0;
    this.projectService.getMaxProjectID().subscribe(resp => {

      maxid = resp[0].maxprojectid;

      //**employeeFormGroup control within the subscribe so tha values are set after maxid is retrieved from database  */
      // clear form group since same group is used for edit and add
      // Now formgroup is used instead of data object to pass value
      this.projectFormGroup.reset(); // to clear the previous validations
      // Manualy set default values since reset() will will turn values to null: // https://stackoverflow.com/questions/51448764/why-are-formgroup-controls-null-after-formgroup-reset
      // this.employeeFormGroup.controls['empid'].setValue(0);
      // this.employeeFormGroup.controls['empid'].setValue(maxid + 1);
      // this.employeeFormGroup.controls['employeeid'].setValue('');//added 2023
      // this.employeeFormGroup.controls['firstname'].setValue('');
      // this.employeeFormGroup.controls['lastname'].setValue('');
      // this.employeeFormGroup.controls['middlei'].setValue('');//added 2023  
      // this.employeeFormGroup.controls['jobtitle'].setValue(0);
      // this.employeeFormGroup.controls['registration'].setValue(0);
      // this.employeeFormGroup.controls['hiredate'].setValue(null);  // should use null instead of ''
      // this.employeeFormGroup.controls['employee_consultant'].setValue(0);

      this.projectFormGroup.controls['projectid'].setValue(maxid + 1);
      this.projectFormGroup.controls['projectname'].setValue('');
      this.projectFormGroup.controls['projectrole'].setValue(0);
      this.projectFormGroup.controls['awardyear'].setValue('');
      this.projectFormGroup.controls['projectno'].setValue('');
      this.projectFormGroup.controls['projectmanager'].setValue(0);
      this.projectFormGroup.controls['ownercategory'].setValue(0);
      this.projectFormGroup.controls['comid'].setValue(0);
      this.projectFormGroup.controls['primaryprojecttype'].setValue(0);
      this.projectFormGroup.controls['secondaryprojecttype'].setValue('');
      this.projectFormGroup.controls['owner'].setValue(0);
      this.projectFormGroup.controls['client'].setValue(0);
      this.projectFormGroup.controls['projectagreementno'].setValue('');
      this.projectFormGroup.controls['projectstatus'].setValue(0);
      this.projectFormGroup.controls['proposalid'].setValue(0);

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


    //Timeout is used to run following code after maxid is returned from database
    //************************************************************************************** */
    // let that=this;
    // setTimeout(function () {

    //  this.editData.empid= 0;
    //  this.editData.firstname= '';
    //  this.editData.lastname= '';
    //  this.editData.jobtitle= 0;
    //  this.editData.registration= 0; 

    // // clear form group since same group is used for edit and add
    // // Now formgroup is used instead of data object to pass value
    // that.employeeFormGroup.reset(); // to clear the previous validations
    // // Manualy set default values since reset() will will turn values to null: // https://stackoverflow.com/questions/51448764/why-are-formgroup-controls-null-after-formgroup-reset
    // // this.employeeFormGroup.controls['empid'].setValue(0);
    // that.employeeFormGroup.controls['empid'].setValue(maxid+1);
    // that.employeeFormGroup.controls['employeeid'].setValue('');//added 2023
    // that.employeeFormGroup.controls['firstname'].setValue('');
    // that.employeeFormGroup.controls['lastname'].setValue('');
    // that.employeeFormGroup.controls['middlei'].setValue('');//added 2023  
    // that.employeeFormGroup.controls['jobtitle'].setValue(0);
    // that.employeeFormGroup.controls['registration'].setValue(0);
    // that.employeeFormGroup.controls['hiredate'].setValue(null);  // should use null instead of ''
    // that.employeeFormGroup.controls['employee_consultant'].setValue(0);

    // }, 1000)


  }


  // saveEmp common for edit and add. Option to call 2 function from here 
  savePro() {

    //   // check internet connection first
    //   var onlineOffline = navigator.onLine;
    //   if (onlineOffline===false) {
    //     alert("no internet connection");
    //     return;
    //   }
    if (this.modalClicked == "editModal") {
      this.updatePro();
    }
    if (this.modalClicked == "addModal") {
      this.addPro();
    }
  }







  updatePro() {

    // **FormFroup and FormControl is used to pass value to save form instead of [(ngModel)]


    this.loading2 = true;
    // console.log(this.employeeFormGroup);
    if (this.projectFormGroup.invalid) {
      this.loading2 = false;
      return;
    }

    // // Handle date. If cleared in html the datepicker returns empty string "" and saves as '0000-00-00' in database 
    // // which gives error while reading in form . So convert the date to "null" before saving empty string
    // if (this.employeeFormGroup.controls['hiredate'].value === '') {
    //   this.employeeFormGroup.controls['hiredate'].setValue(null);
    // }
    let x:any= $("#secondaryprojecttype").val();
    let y:any=x.toString(); 
    this.projectFormGroup.controls['secondaryprojecttype'].setValue(y);

    this.projectService.updateProject(this.projectFormGroup.value).subscribe(resp => {

      // $("#empeditmodal").modal("hide");
      $("#btnEditCloseModal").click();

      // this.refreshEmployeeDatatable();
      this.refreshProjectDetail.next('somePhone'); //calling  loadEmpDetail() from parent component

      this.loading2 = false;

    },
      err => {
        // console.log(error.response.data);
        // console.log(error.error.errors[0].param); //working
        // console.log(error.error.errors[0].msg); //working

        this.loading2 = false;

        // For Validation errors
        if (err.status === 422 || err.status === 400) {
          // alert(err.error.errors[0].msg);
          this.formErrors = err.error.errors;
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

    // if (!this.errors) {
    //   //route to new page
    // }

  }



  goToNewRecord() {
    // To Goto the newly added Record in Empdetail after new record is added
    //******************************************************************************** */
    this.projectService.getMaxProjectID().subscribe(resp => {

      // this.refreshEmpDetail.next('somePhone'); //calling  loadEmpDetail() from parent component
      // this.router.navigateByUrl('Employee') //navigate to EmployeeDatatable
      // this.router.navigateByUrl('Empdetail/2') //navigate to Empdetail
      let a = resp[0].maxprojectid;
      this.router.navigateByUrl('Projectdetail/' + a) //navigate to AngularDatatable
      // return a;
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





  addPro() {

    this.loading2 = true;


    //*************************************************************************** */
    // Create EmployeeID. Creating in frontend now
    //************************************************** */
    // let fname: any = this.employeeFormGroup.controls['firstname'].value;
    // let lname: any = this.employeeFormGroup.controls['lastname'].value;
    // let mi: any = this.employeeFormGroup.controls['middlei'].value;
    // let lnamecap: any = lname.charAt(0).toUpperCase() + lname.slice(1);
    // let newemployeeid = lnamecap + fname.charAt(0).toUpperCase() + mi.charAt(0).toUpperCase();
    // this.employeeFormGroup.controls['employeeid'].setValue(newemployeeid);

    let newprojectno = this.projectFormGroup.controls['projectno'].value;;//test

    //********************************************************************************************* */
    //chaining db calls(1st call - cheking for duplicate employeeid). validation is in frontend now
    //********************************************************************************************* */

    this.projectService.getDuplicateProjectNo(newprojectno).subscribe(resp => {
      let duplicatecount = resp[0].projectnocount;
      // let x=0/1;
      if (duplicatecount > 0) {
        alert("Duplicate ProjectNo '" + newprojectno + "' found.\nPlease enter another Id");
        this.loading2 = false;
        // $("#btnEditCloseModal").click();
        duplicatecount = 0;
        return;
      }


      //************************************************************************************************* */
      //chaining db calls(2nd call for insert).then insert(chaining after duplicate employeeid validation)
      //*********************************************************************************************** */

      this.projectService.addProject(this.projectFormGroup.value).subscribe(resp => {
        // $("#empeditmodal").modal("hide");
        $("#btnEditCloseModal").click();
        this.loading2 = false;
        this.refreshProjectDetail.next('somePhone'); //calling  loadEmpDetail() from parent component
        // this.refreshEmployeeDatatable();
        // this.router.navigateByUrl('Employee') //navigate to AngularDatatable
        // var a= this.getMaxId();      
        // this.router.navigateByUrl('Empdetail/' + a) //navigate to Empdetail // not working
        this.goToNewRecord(); // jump to the newly added record
      },

        //error code for Chaining calls no.2(insert/add call) goes here
        //************************************************************************ */
        err => {
          this.loading2 = false;
          if (err.status === 422 || err.status === 400) {// Form validation backend errors
            this.formErrors = err.error.errors;// alert(err.error.errors[0].msg);
          }
          else {
            alert(err.message);
          }
        });

      // )

    },

      // error code Chaining calls no.1(chking duplicate employeeid) goes here
      //********************************************************************************************* */
      err => {
        alert(err.message);
        this.loading2 = false;
        $("#btnEditCloseModal").click();
      });
    //********************************************************************************************* */

  }






  deletePro(e: any) {

    if (confirm('Are you sure you want to delete this record?')) {
      // Delete it!
    } else {
      // Do nothing!
      return;
    }

    this.projectService.deleteProjectFromModal(e).subscribe(resp => {
      // $("#empeditmodal").modal("hide");
      // this.refreshEmployeeDatatable();
      this.router.navigateByUrl('Project') //navigate to AngularDatatable

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




  // called form save clicked to detect any new errors on save click.
  clearFormErrors() {
    this.formErrors = [{}];
  }





  // Fill all combos in one function using forkJoin of rxjx
  // Fill all combos in one function using forkJoin of rxjx
  fillAllCmb() {
    this.loading2 = true;
    forkJoin([
      this.projectsearchservice.getCmbProjectType(), //observable 1
      this.projectsearchservice.getCmbProPRole(), //observable 2
      this.projectsearchservice.getCmbEmpMain(), //observable 3
      this.projectsearchservice.getCmbProOCategory(), //observable 4
      this.projectsearchservice.getCmbComMain(), //observable 5
      this.projectsearchservice.getCmbCaoMain(), //observable 6
      this.projectsearchservice.getCmbProStatus(), //observable 7
      this.projectsearchservice.getCmbEmpProjectRole(), //observable 8
      this.projectsearchservice.getCmbProposalMain(), //observable 9
    ]).subscribe(([CmbProProjectType, CmbProPRole, CmbEmpMain, CmbProOCategory, CmbComMain, CmbCaoMain, CmbProStatus, CmbEmpProjectRole, CmbProposalMain]) => {
      // When Both are done loading do something
      this.CmbProProjectType = CmbProProjectType;
      this.CmbProPRole = CmbProPRole;
      this.CmbEmpMain = CmbEmpMain;
      this.CmbProOCategory = CmbProOCategory;
      this.CmbComMain = CmbComMain;
      this.CmbCaoMain = CmbCaoMain;
      this.CmbProStatus = CmbProStatus;
      this.CmbEmpProjectRole = CmbEmpProjectRole;
      this.CmbProposalMain = CmbProposalMain;


      // this.projectService.getProjectFromModal(this.projectid).subscribe(resp => {

      // this.fillSecProjectType();
      // fill sec projecttype here so that it can use the data from CmbProProjectType to avoid duplicate call for projecttype
      this.fillsecprojecttype();      

      this.loading2 = false;


    }, err => {
      // alert(err.message);
      // alert("Problem filling Employee combos");
    });
    // if (!this.errors) {
    //   //route to new page
    // }


  }


  // fillSecProjectType() {

  //   this.projectsearchservice.getCmbProjectType().subscribe(resp => {
  //     this.CmbProjectTypeData = resp;
  //     // alert(resp);

  //     //  setTimeout(function () {

  //     //    $.each(resp, function (i, option) {
  //     //      $('#multiple-checkboxes').append("<option value=" + resp[i].ListID + ">" + resp[i].Str1 + "</option>"); //append to select itself
  //     //      //  $("#multiproeditsecproject option[value='"+val+"']").attr("selected", "selected");
  //     //    })
  //     //      (<any>$("#multiple-checkboxes")).multiselect('rebuild');
  //     //  }, 3000);
  //     // // multiproeditsecproject. placed here instead of mounted else dropdown wont fill after new project is searched 
  //     // // also use different id for each multiselect to avoid conflict 
  //     // var data = [];
  //     // console.log(resp.length);
  //     // for (var i = 1; i < resp.length; i++) { // note i started from 1 instead of 0 to exclude blank row
  //     //     var obj={label: resp[i].Str1, value: resp[i].ListID};
  //     //     data.push(obj);
  //     // }

  //     // (<any>$("#multiple-checkboxes")).multiselect('dataprovider', data);

  //     // let dt: any = [];

  //     // {ListID: 0, Str1: "", Str2: ""},

  //     // {ListID: 1, Str1: "Bridge Design", Str2: null},

  //     // {ListID: 2, Str1: "Bridge Inspection", Str2: null},

  //     // {ListID: 3, Str1: "Building Architectural Projects", Str2: null},

  //     // {ListID: 4, Str1: "Building Design", Str2: null},

  //     // {ListID: 5, Str1: "Building Inspection", Str2: null},

  //     // {ListID: 6, Str1: "Construction inspection of buildings", Str2: null},

  //     // {ListID: 7, Str1: "Construction Inspection of Roadways & Bridges", Str2: null},

  //     // {ListID: 8, Str1: "Construction management of buildings", Str2: null},

  //     // {ListID: 9, Str1: "Construction Management of Roadways & Bridges", Str2: null},

  //     // {ListID: 10, Str1: "Drainage Design", Str2: null}];

  //     // dt=[{
  //     //   id: 1,
  //     //   label: "David"
  //     // }, {
  //     //   id: 2,
  //     //   label: "Jhon"
  //     // }, {
  //     //   id: 3,
  //     //   label: "Lisa"
  //     // }, {
  //     //   id: 4,
  //     //   label: "Nicole"
  //     // }, {
  //     //   id: 5,
  //     //   label: "Danny"
  //     // }]


  //     // $.each(dt, function (i, option) {
  //     //   $('#multiple-checkboxes').append("<option value=" + dt[i].ListID + ">" + dt[i].Str1 + "</option>"); //append to select itself
  //     //   //  $("#multiproeditsecproject option[value='"+val+"']").attr("selected", "selected");
  //     // })
  //     // (<any>$("#multiple-checkboxes")).multiselect('rebuild');


  //   },
  //     err => {

  //       if (err.status === 422 || err.status === 400) {
  //         // alert(err.error.errors[0].msg);
  //         this.formErrors = err.error.errors;
  //       }
  //       else {
  //         alert(err.message);
  //       }
  //     });
  // }


}
