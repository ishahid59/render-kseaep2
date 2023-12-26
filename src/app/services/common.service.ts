import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// must use @Injectable with providedIn: 'root' to use in other components
@Injectable({
  providedIn: 'root'
})

export class CommonService {

  // test:string='';

  myGlobalVar;
  myfirstname: string = '';

   baseUrl:string="https://aepnode2.onrender.com"
 //  baseUrl: string = "http://localhost:5000";


  user_role: any = '';
  user_roles: any = [];

  listtablename:any='';
  dislisttablename:any='';


  

  constructor() {
    this.myGlobalVar = true;
    // alert("My intial global variable value is: " + this.myGlobalVar);
  }

  setMyGV(val: boolean) {
    this.myGlobalVar = val;
  }

  getMyGV(val: boolean) {
    return this.myGlobalVar;
  }




  // ***************************************************************************************
  // CHECKING ROLES
  // ***************************************************************************************
  checkEditRole() {
    if (this.user_role === 'guest') {
      alert("Need permission.");
      return false;
    }
    else {
      return true;
    }
  }
  checkAddRole() {
    if (this.user_role === 'guest' || this.user_role === 'user' ) {      
      alert("Need permission.");
      return false;
    }
    else {
      return true;
    }
  }
  checkDeleteRole() {
    if (this.user_role === 'guest' || this.user_role === 'user' ) {   
      alert("Need permission.");
      return false;
    }
    else {
      return true;
    }
  }

 // ***************************************************************************************
 // ***************************************************************************************



  // server code

// // Get userrole by ID, Not using
// Router.get('/userrole/:id', async function (req, res) {
//   try {
//       let pool = await sql.connect(mssqlconfig)
//       let result = await pool.request()
//          .query(`SELECT * FROM UAccess_Control WHERE ID=${req.param("id")}`)
//       res.send(result.recordset);
//   } catch (err) {
//       return res.status(400).send("MSSQL ERROR: " + err);
//   }
// });




  // getuserroles($userid) {
  //   this.$axios.get(this.$host + "api/userrole/" + $userid).then(response => {
  //     // console.log(response.data.length);
  //     var i = 0;
  //     for (let i = 0; i < response.data.length; i++) {
  //       // const element = response.data[i];

  //       if (response.data[i].modulename == "employee") {
  //         // this.$employee["view"] = response.data[i].view;
  //         // this.$employee["add"] = response.data[i].add;
  //         // this.$employee["edit"] = response.data[i].edit;
  //         // this.$employee["delete"] = response.data[i].delete;
  //         // this.$employee["search"] = response.data[i].search;
  //         // this.$employee=this.employee;
  //         // this.employee.view = response.data[i].view;
  //         // this.employee.add = response.data[i].add;
  //         // this.employee.edit = response.data[i].edit;
  //         // this.employee.delete = response.data[i].delete;
  //         // this.employee.search = response.data[i].search;

  //         localStorage.setItem("empview", response.data[i].view);
  //         localStorage.setItem("empadd", response.data[i].add);
  //         localStorage.setItem("empedit", response.data[i].edit);
  //         localStorage.setItem("empdelete", response.data[i].delete);
  //         localStorage.setItem("empsearch", response.data[i].search);
  //       }
  //       if (response.data[i].modulename == "project") {
  //         localStorage.setItem("projectview", response.data[i].view);
  //         localStorage.setItem("projectadd", response.data[i].add);
  //         localStorage.setItem("projectedit", response.data[i].edit);
  //         localStorage.setItem("projectdelete", response.data[i].delete);
  //         localStorage.setItem("projectsearch", response.data[i].search);
  //       }
  //       if (response.data[i].modulename == "listitems") {
  //         localStorage.setItem("listitemsview", response.data[i].view);
  //         localStorage.setItem("listitemsadd", response.data[i].add);
  //         localStorage.setItem("listitemsedit", response.data[i].edit);
  //         localStorage.setItem("listitemsdelete", response.data[i].delete);
  //         localStorage.setItem("listitemssearch", response.data[i].search);
  //       }
  //     }

  //     // console.log(response.data);
  //     // this.userroles["empview"]=response.data[0].permission;
  //     // this.userroles["empedit"]=response.data[1].permission;
  //     // this.userroles["empdelete"]=response.data[2].permission;
  //     // this.userroles["empadd"]=response.data[3].permission;
  //     // console.log( this.userroles["empview"]);
  //     // console.log( this.userroles["empedit"]);
  //     // console.log( this.userroles["empdelete"]);
  //     // console.log( this.userroles["empadd"]);
  //     // console.log( this.userroles);
  //   });
  // },









}