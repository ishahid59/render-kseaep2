import { Component } from '@angular/core';
import { CommonService } from '../services/common.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list-items-home',
  templateUrl: './list-items-home.component.html',
  styleUrls: ['./list-items-home.component.css']
})
export class ListItemsHomeComponent {

  constructor( private commonService: CommonService,private router: Router) {
  }
 
  ngOnInit() {
    // this.loadDatatableUser();

    // this hapens when loged in as admin and page is refreshed. In this case the user_role is not yet stored
    // in the common services so to avoid error diverted to Home page
    // Also when a non admin user types the url for user(enter/page refreshed) will be diverted to homepage
    if (this.commonService.user_role=='') {
      this.router.navigate(['/Home/']);
      return;
    } 
  }

  setListTableName(listTableName:any,disListTableName:any){
    // alert();
    this.commonService.listtablename=listTableName;
    this.commonService.dislisttablename=disListTableName;
    // this.listitemscomponent.refreshDatatableListItems();
    $("#refreshDatatableListItems").click();
  }



}
