// import { Component } from '@angular/core';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../../services/common.service';
import { EmployeeService } from '../../services/employee/employee.service';
import { CaoService } from '../../services/cao/cao.service';


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
import { CaoEditModalComponent } from '../cao-edit-modal/cao-edit-modal.component';


@Component({
  selector: 'app-cao',
  templateUrl: './cao.component.html',
  styleUrls: ['./cao.component.css']
})

export class CaoComponent {


  constructor(private http: HttpClient, private caoservice: CaoService,public datePipe: DatePipe,private router: Router,private commonService: CommonService) {
  }




  // dtOptions: DataTables.Settings = {};
  dtOptions: any = {}; // any is used instead of DataTables.Settings else datatable export buttons wont show

  // To refresh datatable with search parameters without using destroy
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective; //used "!" to avoid initialization of variable. Also can use strict:false in tsconfig.json


  // table data
  myData: any = ([]); // in angular should ([]) for array
  empid: any = 0; // to pass to child modal if used
  cmbJobtitle: any = ([]);
  cmbRegistration: any = ([]);

 






}
