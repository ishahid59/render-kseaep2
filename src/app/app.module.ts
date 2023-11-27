import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { DataTablesModule } from "angular-datatables";
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {EmployeeComponent} from './employee/employee/employee.component';
import {ReactiveFormsModule} from '@angular/forms'
import { AppRoutingModule } from './app-routing.module';
import { JquerydatatableComponent } from './jquerydatatable/jquerydatatable.component';
import { LoginComponent } from './login/login.component';
import { NavigationComponent } from './navigation/navigation.component';
import { DatePipe } from '@angular/common';
import { AuthInterceptorProvider } from './auth.interceptor';
import { HomeComponent } from './home/home.component';
import { EmpDetailComponent } from './employee/emp-detail/emp-detail.component';
import { EmpDegreeComponent } from './employee/emp-degree/emp-degree.component';
import { EmpRegComponent } from './employee/emp-reg/emp-reg.component';
import { EmpEditModalComponent } from './employee/emp-edit-modal/emp-edit-modal.component';
import { EmployeeSearchComponent } from './employee/employee-search/employee-search.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProjectComponent } from './project/project/project.component';
import { ProjectSearchComponent } from './project/project-search/project-search.component';
import { ProjectEditModalComponent } from './project/project-edit-modal/project-edit-modal.component';
import { ProjectDetailComponent } from './project/project-detail/project-detail.component';
// import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { ProTeamComponent } from './project/pro-team/pro-team.component';
import { ProProfilecodeComponent } from './project/pro-profilecode/pro-profilecode.component';
import { ProDacComponent } from './project/pro-dac/pro-dac.component';
import { ProDescriptionComponent } from './project/pro-description/pro-description.component';
import { ProPhotoComponent } from './project/pro-photo/pro-photo.component';
import { EmpProjectsComponent } from './employee/emp-projects/emp-projects.component';
// import { ProEditModalComponent } from './pro-edit-modal/pro-edit-modal.component';
// import { HashLocationStrategy, LocationStrategy,PathLocationStrategy } from '@angular/common'; //LocationStrategy is used to refresh page after deployment

@NgModule({
  declarations: [
    AppComponent,
    EmployeeComponent,
    JquerydatatableComponent,
    LoginComponent,
    NavigationComponent,
    HomeComponent,
    EmpDetailComponent,
    EmpDegreeComponent,
    EmpRegComponent,
    EmpEditModalComponent,
    EmployeeSearchComponent,
    PageNotFoundComponent,
    ProjectComponent,
    ProjectSearchComponent,
    ProjectEditModalComponent,
    ProjectDetailComponent,
    ProTeamComponent,
    ProProfilecodeComponent,
    ProDacComponent,
    ProDescriptionComponent,
    ProPhotoComponent,
    EmpProjectsComponent,    
    
    // ProEditModalComponent,
    
  ],
  imports: [
    BrowserModule,
    DataTablesModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,

  ],
  providers: [AuthInterceptorProvider,DatePipe], // datepipe used to convert date format to show in html date element
  //LocationStrategy is used to refresh page after deployment with htaccess file
  // providers: [AuthInterceptorProvider,DatePipe,{provide: LocationStrategy, useClass: HashLocationStrategy} ], // datepipe used to convert date format to show in html date element
  bootstrap: [AppComponent]
})
export class AppModule { }
