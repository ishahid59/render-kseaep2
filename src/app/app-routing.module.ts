import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmployeeComponent } from './employee/employee/employee.component';
import { JquerydatatableComponent } from './jquerydatatable/jquerydatatable.component';
import { LoginComponent } from './login/login.component';
import { IsAuthenticatedGuard } from './is-authenticated.guard';
import { HomeComponent } from './home/home.component';
import { EmpDetailComponent } from './employee/emp-detail/emp-detail.component';
import { ProjectDetailComponent } from './project/project-detail/project-detail.component';
import { CaoDetailComponent } from './cao/cao-detail/cao-detail.component';
import { ComDetailComponent } from './com/com-detail/com-detail.component';

import { EmployeeSearchComponent } from './employee/employee-search/employee-search.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UserComponent } from './user/user.component';
import { ProjectComponent } from './project/project/project.component';
import { ProjectSearchComponent } from './project/project-search/project-search.component';
import { ListItemsComponent } from './list-items/list-items.component';
import { ListItemsHomeComponent } from './list-items-home/list-items-home.component';
import { CaoComponent } from './cao/cao/cao.component';
import { ComComponent } from './com/com/com.component';
import { ProposalComponent } from './proposal/proposal/proposal.component';

import { EmpResumetextSearchComponent } from './employee/emp-resumetext-search/emp-resumetext-search.component';
import { EmpResumeprojectsSearchComponent } from './employee/emp-resumeprojects-search/emp-resumeprojects-search.component';

import { ProPdstextSearchComponent } from './project/pro-pdstext-search/pro-pdstext-search.component';



// import { ReportResumeComponent } from './report/employee/report-resume/report-resume.component';
import { ReportComponent } from './report/report.component';

import { ReportHomeComponent } from './report-home/report-home.component';

UserComponent
// import { AboutComponent } from './about/about.component';
// import { ContactComponent } from './contact/contact.component';


// https://www.youtube.com/watch?v=Nehk4tBxD4o&t=504s

const routes: Routes = [ 
  {path:'', redirectTo: "Login",pathMatch:'full'},
  {path:'Login', component:LoginComponent},
  // {path:'', component:LoginComponent},
  {path:'Home', component: HomeComponent,canActivate:[IsAuthenticatedGuard]},
  {path:'Employee', component: EmployeeComponent,canActivate:[IsAuthenticatedGuard]},
  {path:'EmployeeSearch', component: EmployeeSearchComponent,canActivate:[IsAuthenticatedGuard]},
  {path:'Project', component: ProjectComponent,canActivate:[IsAuthenticatedGuard]},
  {path:'ProjectSearch', component: ProjectSearchComponent,canActivate:[IsAuthenticatedGuard]}, 
  {path:'Cao', component: CaoComponent,canActivate:[IsAuthenticatedGuard]},
  {path:'Com', component: ComComponent,canActivate:[IsAuthenticatedGuard]},
  {path:'Proposal', component: ProposalComponent,canActivate:[IsAuthenticatedGuard]},

  {path:'EmpResumetextSearch', component: EmpResumetextSearchComponent,canActivate:[IsAuthenticatedGuard]},
  {path:'EmpResumeprojectsSearch', component: EmpResumeprojectsSearchComponent,canActivate:[IsAuthenticatedGuard]},
  {path:'ProPdstextSearchComponent', component: ProPdstextSearchComponent,canActivate:[IsAuthenticatedGuard]},



  {path:'JqueryDatatable', component: JquerydatatableComponent,canActivate:[IsAuthenticatedGuard]},
  {path:'User', component: UserComponent,canActivate:[IsAuthenticatedGuard]},
  {path:'Empdetail/:id', component: EmpDetailComponent,canActivate:[IsAuthenticatedGuard]},
  {path:'Projectdetail/:id', component: ProjectDetailComponent,canActivate:[IsAuthenticatedGuard]},
  {path:'Caodetail/:id', component: CaoDetailComponent,canActivate:[IsAuthenticatedGuard]},
  {path:'Comdetail/:id', component: ComDetailComponent,canActivate:[IsAuthenticatedGuard]},

  {path:'ListItems', component: ListItemsComponent,canActivate:[IsAuthenticatedGuard]},
  {path:'ListItemsHome', component: ListItemsHomeComponent,canActivate:[IsAuthenticatedGuard]},
  // {path:'ReportResume', component: ReportResumeComponent,canActivate:[IsAuthenticatedGuard]},
  // {path:'ReportResume/:id/:id', component: ReportResumeComponent,canActivate:[IsAuthenticatedGuard]},
  {path:'Report', component: ReportComponent,canActivate:[IsAuthenticatedGuard]},
  {path:'ReportHome', component: ReportHomeComponent,canActivate:[IsAuthenticatedGuard]},


  // page not found route.  wild card route must go last 
  {path:'**', component:PageNotFoundComponent},
 
  // {path:'About', component: AboutComponent},
  // {path:'Contact', component: ContactComponent},
];


// https://stackoverflow.com/questions/44912771/load-a-page-outside-the-router-outlet-in-angular-4
// const routes: Routes = [
//   { path: '', component: LoginComponent },
//   {
//     path: 'home', component: HomeComponent,
//     children: [
//       { path: 'AngularDatatable', component: EmployeeComponent, canActivate: [IsAuthenticatedGuard] },
//       { path: 'JqueryDatatable', component: JquerydatatableComponent, canActivate: [IsAuthenticatedGuard] },
//     ]
//   }
// ];


// 2022 to avoid # set "useHash: false" but browser refresh will return 404 after deploymwnt.
// Solution: In render deployment under "Redirects/Rewrites" for the service set "Rewrite" rule. Source: "/*", Destination: "/index.html"
// https://render.com/docs/redirects-rewrites
@NgModule({
  // imports: [RouterModule.forRoot(routes)], // Default is hash:false. Refresh wont work in deployment
  imports: [RouterModule.forRoot(routes, { useHash: false })], //https://stackoverflow.com/questions/65828232/how-can-i-prevent-404-not-found-error-in-angular-when-i-refresh-page
  exports: [RouterModule]
})
export class AppRoutingModule { }
