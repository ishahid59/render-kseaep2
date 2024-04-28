// import { Component } from '@angular/core';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../../services/common.service';
// import { EmployeeService } from '../../services/employee/employee.service';
import { ProjectService } from '../../services/project/project.service';
// import { ProdacService } from '../../services/project/prodac.service';
import { ProclientcontactService } from '../../services/project/proclientcontact.service';

import { DatePipe, Location } from '@angular/common';// datepipe used to convert date format to show in html date element
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, forkJoin, of } from 'rxjs';
import { ProjectSearchService } from '../../services/project/project-search.service';
import { error } from 'jquery';

@Component({
  selector: 'app-pro-clientcontact',
  templateUrl: './pro-clientcontact.component.html',
  styleUrls: ['./pro-clientcontact.component.css']
})
export class ProClientcontactComponent {


  constructor(private http: HttpClient,private projectsearchservice: ProjectSearchService, private projectService: ProjectService, private proClientcontactService: ProclientcontactService, public datePipe: DatePipe, private router: Router, public activatedRoute: ActivatedRoute, private commonService: CommonService) {
  }


  // @Input() childempid:any;
  @Input() childprojectid: any;


}
