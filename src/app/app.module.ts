import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BoldReportViewerModule } from '@boldreports/angular-reporting-components';

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
import { UserComponent } from './user/user.component';
import { ListItemsComponent } from './list-items/list-items.component';
import { ListItemsHomeComponent } from './list-items-home/list-items-home.component';
// import { ProEditModalComponent } from './pro-edit-modal/pro-edit-modal.component';
// import { HashLocationStrategy, LocationStrategy,PathLocationStrategy } from '@angular/common'; //LocationStrategy is used to refresh page after deployment

// Report viewer
import '@boldreports/javascript-reporting-controls/Scripts/bold.report-viewer.min';

// data-visualization
import '@boldreports/javascript-reporting-controls/Scripts/data-visualization/ej.bulletgraph.min';
import '@boldreports/javascript-reporting-controls/Scripts/data-visualization/ej.chart.min';
// import { ReportResumeComponent } from './report/employee/report-resume/report-resume.component';
import { ReportComponent } from './report/report.component';

import { LightboxModule } from 'ngx-lightbox';
import { ReportHomeComponent } from './report-home/report-home.component';
import { EmpExpsummaryComponent } from './employee/emp-expsummary/emp-expsummary.component';
import { EmpPrevemploymentComponent } from './employee/emp-prevemployment/emp-prevemployment.component';
import { EmpTrainingComponent } from './employee/emp-training/emp-training.component';
import { EmpDisciplinesf330Component } from './employee/emp-disciplinesf330/emp-disciplinesf330.component';
import { ProOwnercontactComponent } from './project/pro-ownercontact/pro-ownercontact.component';
import { ProClientcontactComponent } from './project/pro-clientcontact/pro-clientcontact.component';
import { EmpMembershipComponent } from './employee/emp-membership/emp-membership.component';
import { ProAddressComponent } from './project/pro-address/pro-address.component';
import { CaoComponent } from './cao/cao/cao.component';
import { ComComponent } from './com/com/com.component';
import { CaoContactComponent } from './cao/cao-contact/cao-contact.component';
import { CaoEditModalComponent } from './cao/cao-edit-modal/cao-edit-modal.component';
import { ComEditModalComponent } from './com/com-edit-modal/com-edit-modal.component';

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
    UserComponent,
    ListItemsComponent,
    ListItemsHomeComponent,    
    // ReportResumeComponent, 
    ReportComponent,
    ReportHomeComponent,
    EmpExpsummaryComponent,
    EmpPrevemploymentComponent,
    EmpTrainingComponent,
    EmpDisciplinesf330Component,
    ProOwnercontactComponent,
    ProClientcontactComponent,
    EmpMembershipComponent,
    ProAddressComponent,
    CaoComponent,
    ComComponent,
    CaoContactComponent,
    CaoEditModalComponent,
    ComEditModalComponent
    ,    

    // ProEditModalComponent,
    
  ],
  imports: [
    BrowserModule,
    DataTablesModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BoldReportViewerModule,
    LightboxModule

  ],
  providers: [AuthInterceptorProvider,DatePipe], // datepipe used to convert date format to show in html date element
  //LocationStrategy is used to refresh page after deployment with htaccess file
  // providers: [AuthInterceptorProvider,DatePipe,{provide: LocationStrategy, useClass: HashLocationStrategy} ], // datepipe used to convert date format to show in html date element
  bootstrap: [AppComponent]
})
export class AppModule { }
