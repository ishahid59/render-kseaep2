// import { Component } from '@angular/core';
// import { Component } from '@angular/core';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../../services/common.service';
// import { EmployeeService } from '../../services/employee/employee.service';
import { ProjectService } from '../../services/project/project.service';
// import { ProdacService } from '../../services/project/prodac.service';
import { ProownercontactService } from '../../services/project/proownercontact.service';

import { DatePipe, Location } from '@angular/common';// datepipe used to convert date format to show in html date element
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, forkJoin, of } from 'rxjs';
import { ProjectSearchService } from '../../services/project/project-search.service';
import { error } from 'jquery';

@Component({
  selector: 'app-pro-ownercontact',
  templateUrl: './pro-ownercontact.component.html',
  styleUrls: ['./pro-ownercontact.component.css']
})
export class ProOwnercontactComponent {



  constructor(private http: HttpClient,private projectsearchservice: ProjectSearchService, private projectService: ProjectService, private proOwnercontactService: ProownercontactService, public datePipe: DatePipe, private router: Router, public activatedRoute: ActivatedRoute, private commonService: CommonService) {
  }


  // @Input() childempid:any;
  @Input() childprojectid: any;



}
