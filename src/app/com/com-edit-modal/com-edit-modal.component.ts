// import { Component } from '@angular/core';
import { Component, Input, Output, EventEmitter } from '@angular/core';


import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../../services/common.service';
// import { EmployeeService } from '../../services/employee/employee.service';
import { ComService } from '../../services/com/com.service';

import { DatePipe } from '@angular/common';// datepipe used to convert date format to show in html date element
import { Router } from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';
import { EmployeeSearchService } from '../../services/employee/employee-search.service';
import { ProjectSearchService } from '../../services/project/project-search.service';


@Component({
  selector: 'app-com-edit-modal',
  templateUrl: './com-edit-modal.component.html',
  styleUrls: ['./com-edit-modal.component.css']
})


export class ComEditModalComponent {


  constructor(private http: HttpClient,private proSearchService: ProjectSearchService,private empSearchService: EmployeeSearchService, private comservice: ComService,public datePipe: DatePipe,private router: Router,private commonService: CommonService) {
  }
 

  //TODO for project
  @Input() empid: any = null;





  formErrors:any=[{}];
  loading2:boolean=false;
  modalClicked="editModal";



  showChildModal() {
    // alert("edit");
    $('#btnComEditModalShow').click();
    this.modalClicked="editModal";
    this.showComEditModal();
  }


  showComEditModal() {


  }







}
