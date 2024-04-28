// import { Component } from '@angular/core';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../../services/common.service';
import { EmployeeService } from '../../services/employee/employee.service';
import { EmpmembershipService } from '../../services/employee/empmembership.service';
import { DatePipe } from '@angular/common';// datepipe used to convert date format to show in html date element
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, forkJoin, of } from 'rxjs';
import { EmployeeSearchService } from '../../services/employee/employee-search.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-emp-membership',
  templateUrl: './emp-membership.component.html',
  styleUrls: ['./emp-membership.component.css']
})
export class EmpMembershipComponent {


  constructor(private http: HttpClient, private authService: AuthService, private empSearchService: EmployeeSearchService, private empService: EmployeeService,private empMembershipService: EmpmembershipService, public datePipe: DatePipe, private router: Router,public activatedRoute: ActivatedRoute,private commonService: CommonService) {
  }



  @Input() childempid:any;

}