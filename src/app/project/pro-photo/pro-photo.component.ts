// import { Component } from '@angular/core';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe, Location } from '@angular/common';// datepipe used to convert date format to show in html date element
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { DataTableDirective } from 'angular-datatables';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../../services/common.service';
import { ProjectService } from '../../services/project/project.service';

import { ProjectSearchService } from '../../services/project/project-search.service';
import { ProphotoService } from '../../services/project/prophoto.service';
import { Lightbox,LightboxConfig } from 'ngx-lightbox';
import { Observable, forkJoin, of } from 'rxjs';


@Component({
  selector: 'app-pro-photo',
  templateUrl: './pro-photo.component.html',
  styleUrls: ['./pro-photo.component.css']
})
export class ProPhotoComponent {


  constructor(private http: HttpClient,private projectSearchService: ProjectSearchService, private projectService: ProjectService, private proPhotoService: ProphotoService, public datePipe: DatePipe, private router: Router, public activatedRoute: ActivatedRoute, private commonService: CommonService, private _lightbox: Lightbox, private _lightboxConfig: LightboxConfig) {
  // override lightbox default config
  // _lightboxConfig.fadeDuration = 1;
  _lightboxConfig.showDownloadButton = true;
  _lightboxConfig.positionFromTop = 30;
  }



  // @Input() childempid:any;
  @Input() childprojectid: any; 
 // input childprojectno is used to get projectno and pass to backend to create project folder -->
  @Input() childprojectno: any; 

  // dtOptions: DataTables.Settings = {};
  dtOptions: any = {}; // any is used instead of DataTables.Settings else datatable export buttons wont show

  // To refresh datatable with search parameters without using destroy
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective; //used "!" to avoid initialization of variable. Also can use strict:false in tsconfig.json


  // CmbProPhoto: any = ([]);
  proPhotoData: any;// = []; // in angular should ([]) for array
  prophoto:any={};
  formErrors: any = [{}];
  loading2: boolean = false;
  componentLoaded = false;
// test:boolean=true;
  modalClicked = "editModal";

  dynamicimagepath:any='';
  onerrorimage:any=this.commonService.baseUrl+'/img/project/not_found.JPG';
  image:any;//({});
  imagesize:any; // for checking image filesize
  newaddedimagedata:any='';

  proPhotoFormGroup = new FormGroup({
    id: new FormControl(0),
    photoname: new FormControl('', [Validators.required]),
    // photoname: new FormControl(0, [Validators.required, Validators.min(1)]),

    // photoname: new FormControl(''),

    description: new FormControl(''),
    imagedata: new FormControl(''),
    createdate: new FormControl(''),
    createdby: new FormControl(0),
    discreatedby: new FormControl(''),
    lastmodifydate: new FormControl(''),
    lastmodifiedby: new FormControl(0),
    dislastmodifiedby: new FormControl(''),
    projectid: new FormControl(0),
    projectno: new FormControl(''),// newly added not in db for image folder name
    // image: new FormControl({}), // newly added not in db for image
    image: new FormControl(''), // newly added not in db for image

  });


  _albums: any = []; // albums for ngx-lightbox images filled in datatable subscribe
  clickedIndexOfDt: any = 0; // used to store row index of clicked row for showing first image of ngx-lightbox
  imagePathArray: any = []; // used for preload images

  // formdata= {
  //   PhotoName: '',
  //   ImageData: '',
  //   CreatedBy: 0,
  //   LastModifiedBy: 0,
  //   Description: '',
  //   ProjectID: 0,
  //   ID: 0,
  //   Image: {}, // extra field not in db for saving photofile in folder
  //   ProjectNo: '' // extra field not in db to use for photo path for field ImageData
  // };

  // set the getters for validation fields. convenient to use in html for validation
  get photoname() {
    return this.proPhotoFormGroup.get('photoname');
  }





  // *****************************************************************************************************
  // IMAGE RELATED using ngx-lightbox for gallery: https://www.npmjs.com/package/ngx-lightbox
  // ***************************************************************************************************** 

  openLightbox(index: number): void {
    // open lightbox
      if (this.proPhotoData.length>0) {
        this._lightbox.open(this._albums, index);
      }
  }


  closeLightbox(): void {
    // close lightbox programmatically
    this._lightbox.close();
  }








  // // image related **********************************
  // // https://codepen.io/Atinux/pen/qOvawK/
  onFileChange(e: any) {

    var files: any = e.target.files || e.dataTransfer.files;
    if (!files.length)
      return;
    this.createImage(files[0]);

    // var fileData:any = event.target.files[0];
    var fileData: any = e.target.files[0];
    this.image = fileData;




    this.imagesize = fileData.size;//2024(imagesize) to check image size for validation used in update and insert method
 

    // this.formdata.Image = event.target.files[0]; // save the image to formdata
    // this.proPhotoFormGroup.controls['image'].setValue(event.target.files[0]); // save the image to formdata
    this.proPhotoFormGroup.controls['image'].setValue(e.target.files[0]); // save the image to formdata
    
    this.loading2=false;//custom select file btn is turning loading2=true, so set to false here
  }



  createImage(file) {
    var image: any = new Image();
    var reader: any = new FileReader();
    // var vm = this;

    reader.onload = (e) => {
      // vm.image = e.target.result;
      this.image = e.target.result;
      this.dynamicimagepath = e.target.result;
    };
    reader.readAsDataURL(file);

    // adjust the div height after selecting new image
    // $(".imageloaderdiv").css("min-height", image.height + "px");

  }



  removeImage(e: any) {
    this.image = '';
    // this.formdata.Image = ''; // Added for addmode
    this.proPhotoFormGroup.controls['image'].setValue(''); // Added for addmode

    // this.imagefilename='';
    // this.formdata.ImageData = '';
    this.proPhotoFormGroup.controls['imagedata'].setValue('')

    // this.dynamicimagepath="";
    // this.dynamicimagepath = "images/prophoto/null.jpg"; // to hide background loader
    // this.dynamicimagepath = this.$host + "img/prophoto/null.jpg"; // to hide background loader
    this.dynamicimagepath = this.commonService.baseUrl+"/img/project/not_found.JPG"; // to hide background loader
    $("#ImageData").val(0); // to remove file name from file input
  }

      // now in backend for multer upload


      // // END image related ******************************************************************************





  ngOnInit() {
    // this.loadDatatableProTeam();

    // ngOnInit is called only once. So for all next calls Observable is used so that it can always listen
    // https://www.youtube.com/watch?v=b4zpvh_saic&list=PL1BztTYDF-QNrtkvjkT6Wjc8es7QB4Gty&index=65
    if (!this.componentLoaded) {
      this.loadDatatableProPhoto(); //loadDatatableProTeam() has to be called for first time only. Then refreshDatatableEmpDegree() is called everytime
      // this.componentLoaded = false;
      this.componentLoaded = true; //2023 to avoid duplicate datatable on load

    }


  }


// tab clicked in emp detail
prophototabClicked(){
  // alert();
  // only fill cmb when tab clicked to make faster
  // this.loadDatatableEmpDegree();
  // this.fillAllCmb();
}




  /* to remove "no matching records found" even if angular-datatable is not empty */
  // https://github.com/l-lin/angular-datatables/issues/1260
  ngAfterViewInit(): void {
    var that = this;
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.on('draw.dt', function () {
        if (that.proPhotoData.length > 0) {
          $('.dataTables_empty').remove(); // remove the empty message
        }

        if (that.proPhotoData.length > 0) {

          if (that.modalClicked=='addModal') {
            $("#prophotoimage").attr("src", that.commonService.baseUrl+"/img/prophoto/" + that.newaddedimagedata);//show the first image
          } 
          else if(that.modalClicked=='editModal') {
            $("#prophotoimage").attr("src", that.commonService.baseUrl+"/img/prophoto/" + that.proPhotoData[that.clickedIndexOfDt].ImageData);//show the first image
          }
          else{ // for delete
            $("#prophotoimage").attr("src", that.commonService.baseUrl+"/img/prophoto/" + that.proPhotoData[0].ImageData);//show the first image
          }

        }
        else {
          $("#prophotoimage").attr("src", that.commonService.baseUrl+"/img/prophoto/not_found.JPG");
        }

      });
    });
 
    
    // // ngOnInit is called only once. So for all next calls Observable is used so that it can always listen
    // // https://www.youtube.com/watch?v=b4zpvh_saic&list=PL1BztTYDF-QNrtkvjkT6Wjc8es7QB4Gty&index=65
    // // following observer code moved from ngOnInit() to here ngAfterViewInit()
    this.activatedRoute.paramMap.subscribe((param) => {
      this.childprojectid = param.get('id')
      if (!this.componentLoaded) { //2023 to avoid duplicate datatable on load
      this.refreshDatatableProPhoto();//// now calling from Pro-detail// refresh instance of angular-datatable
    }
    this.componentLoaded = false; //2023 to avoid duplicate datatable on load
    })


  }




  // Refresh/reload Angular-Datatable. Following method must be used to reload angular-datatable since ngOnInit() is used to initilize table 
  // https://l-lin.github.io/angular-datatables/#/advanced/custom-range-search
  refreshDatatableProPhoto() {
  
    // alert("desc");
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });

    // not needed since called in ngAfterViewInit() which runs after this
    if (this.proPhotoData.length > 0) {
      // $("#prophotoimage").attr("src", "/assets/images/project/" + this.proPhotoData[0].ImageData);//show the first image
      // now in backend for multer upload
      $("#prophotoimage").attr("src", this.commonService.baseUrl+"/img/prophoto/" + this.proPhotoData[0].ImageData);//show the first image

    }
    else {
      // $("#prophotoimage").attr("src", "/assets/images/project/not_found.JPG");
      // now in backend for multer upload
      $("#prophotoimage").attr("src", this.commonService.baseUrl+"/img/prophoto/not_found.JPG");
    }


  }





  loadDatatableProPhoto() {

    var that = this;

    this.dtOptions = {
      pagingType: 'full_numbers',
      processing: true,
      serverSide: true,// server side processing
      searching: false,
      lengthChange: false,
      // "bPaginate": false,
      // paging: false,
      // lengthMenu: [ 10, 35, 50, 75, 100 ],
      // dom: 'Blfrtip', //'Bfrtip', use l before f to show length with bottons
      // // //"any" is used in "dtOptions" instead of DataTables.Settings else datatable export buttons wont show
      // buttons: [
      //     'lengthChange','copy', 'csv', 'excel', 'pdf', 'print'
      // ],

      ajax: (dataTablesParameters: any, callback: any) => {
        this.http.post<any>(
          // 'http://localhost:5000/api/empdegree/empdegree-angular-datatable/' + 145 + '',
          // 'http://localhost:5000/api/empdegree/empdegree-angular-datatable',
          '' + that.commonService.baseUrl + '/api/prophoto/prophoto-angular-datatable',
          Object.assign(dataTablesParameters,
            {
              // token: '',
              // projectid: this.childprojectid,//this.id, 
              projectid: this.childprojectid,//this.id, TEST
            }),
          {
            // ** Header is now coming from Auth.Inceptor file
            // headers: {
            // Authorization: "Bearer " + localStorage.getItem("token"),
            // Accept: "application/json" //the token is a variable which holds the token
            // }
          },
        ).subscribe(resp => {
          this.proPhotoData = resp.data; //use .data after resp for post method




          // ******************************************************************************************
          // PHOTO RELATED 
          // ******************************************************************************************

          //  load the initial Photo before click in datatable to work. moved here from ngoninit to work
          if (this.proPhotoData.length > 0) {
            // this.dynamicimagepath = '' + this.commonService.baseUrl + '/img/prophoto/1990-0238/Photo1_1569500048.jpg'
            this.dynamicimagepath = '' + this.commonService.baseUrl + '/img/prophoto/' + this.proPhotoData[0].ImageData;
          }

          // Create  the Album for Lightbox gallery
          // ngx-lightbox https://www.npmjs.com/package/ngx-lightbox
          // for (let i = 1; i <= this.proPhotoData.length-1; i++) {
          this._albums=[];
          this.imagePathArray=[]; // to preload images

          for (let i = 0; i <= this.proPhotoData.length - 1; i++) {
            const src = this.commonService.baseUrl + '/img/prophoto/' + this.proPhotoData[i].ImageData;
            // const caption = 'Image ' + i + ' caption here';
            // const caption = this.proPhotoData[i].PhotoName + ',   Description: ' + this.proPhotoData[i].Description;
            const caption = this.proPhotoData[i].PhotoName;// + ',   Description: ' + this.proPhotoData[i].Description;
            const thumb = this.commonService.baseUrl + '/img/prophoto/' + this.proPhotoData[i].ImageData;
            const album = {
              src: src,
              caption: caption,
              thumb: thumb
            };
            this._albums.push(album);
            // make imagepath array to preload images
            //<!-- https://stackoverflow.com/questions/64197601/how-to-load-images-before-showing-an-angular-website -->
            this.imagePathArray.push(this.commonService.baseUrl + '/img/prophoto/' + this.proPhotoData[i].ImageData)

          }
          
          // console.log(this._albums);

          // ******************************************************************************************
          // End
          // ******************************************************************************************





          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            // data: []
            // //https://stackoverflow.com/questions/57849250/angular-datatables-server-side-processing-and-buttons-extension-data-is-empty
            data:  resp.data  // set data


          });
          
          // this.fillAllCmb();
          this.commonService.setButtonStatus(); // disable btn if no permission

        });
        
      },
 
      columnDefs: [
        // {
        // "orderable": true,
        // "targets": '_all',
        // },
        {
          "targets": 4, // center action column
          "className": "text-center",
          "orderable": false,
          // "width": "4%"
        },
      ],

      columns: [
        // { data: "ID", "visible": false },
        // { data: "ProjectID", "visible": false },
        // { data: "Photo", "visible": false },        
        // { data: "ImageData" , "visible": false},
        // { data: "PhotoName" },
        {
          render: (data: any, type: any, row: any) => {
            // return "<a style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);'  href='/Empdetail/" + row.empid + "'>" + row.firstname + "</a> ";
            return "<a style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >" + row.PhotoName + "</a> ";
          }, title: 'PhotoName',
        },
        {
          data: "Description", "mRender": function (data: any, type: any, row: any) {
            if (data.length > 60) {
              var trimmedString = data.substring(0, 60);
              return trimmedString + '...';
            } else {
              return data;
            }
          }, 
        }, 
        {
          render: (data: any, type: any, row: any) => {
            return this.datePipe.transform(row.CreateDate, "MM/dd/yyyy");
          }, title: 'CreateDate', width: "80px" 
        },
        { 
          render: (data: any, type: any, row: any) => {
            return this.datePipe.transform(row.LastModifyDate, "MM/dd/yyyy");
          }, title: 'LastModifyDate', width: "80px" 
        },
        {
          render: (data: any, type: any, row: any) => {
            // return "<a class='btn-detail' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Detail</a> | <a class='btn-edit' data-toggle='modal' data-target='#empeditmodal' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Edit</a> | <a class='btn-delete' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Delete</a>";
            return "<a class='btn-edit' data-toggle='modal' data-target='#empeditmodal' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Edit</a> | <a class='btn-delete' style='cursor: pointer;text-decoration:underline;color:rgb(9, 85, 166);' >Delete</a>";

          }, title: 'Action',width: "100px" 
        },

      ],


      // ** Calling angular method from within datatable. Routerlink is more smoth than a tag since it swith between components 
      // https://stackoverflow.com/questions/47529333/render-column-in-data-table-with-routerlink
      // https://l-lin.github.io/angular-datatables/#/advanced/row-click-event
      // https://datatables.net/reference/option/rowCallback
      // buttons in same column //https://datatables.net/forums/discussion/56914/rowcallback-mode-responsive
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        
        const self = this;

        // // Fix for col width: https://stackoverflow.com/questions/54612232/how-to-set-the-width-of-an-individual-column
        // setTimeout(()=>{
        //   let itemColumn:any = document.querySelector('#prodesc-item');
        //   itemColumn.setAttribute('style', 'width: 20% !important;');
        //   let actionColumn:any = document.querySelector('#prodesc-action');
        //   actionColumn.setAttribute('style', 'width: 14% !important;');
        // }, 200)


        // // Firstname col
        // jQuery('a:eq(0)', row).unbind('click');
        // jQuery('a:eq(0)', row).bind('click', () => { //in a:eq(0) "a" is used to specify the tag which will be clicked, and  :eq(0) is used to specify the col else whole row click will ire the event
        //   self.rowFirstNameClickHandler(data);
        // });

        // Firstname full column click
        jQuery('td:eq(0)',row).unbind('click');
        jQuery( 'td:eq(0)',row).bind('click', () => { //in a:eq(0) "a" is used to specify the tag which will be clicked, and  :eq(0) is used to specify the col else whole row click will ire the event
          self.rowFirstNameClickHandler(data,index);
        });


        // // Detail col, Note: put a "," after "a" tag for the second column"
        // jQuery('a,:eq(5)', row).unbind('click');
        // jQuery('a,:eq(5)', row).bind('click', () => { //in a:eq(0) "a" is used to specify the tag which will be clicked, and  :eq(0) is used to specify the col else whole row click will ire the event
        //   self.rowFirstNameClickHandler(data);
        // });

        // Action column with 3 "a" tags in same column  // https://datatables.net/forums/discussion/56914/rowcallback-mode-responsive
        const eltdetail = $('td', row).find('a.btn-detail');
        if (eltdetail) {
          eltdetail.unbind('click');
          eltdetail.bind('click', () => {
            this.rowDetailClickHandler(data);
          });
        }
        const eltedit = $('td', row).find('a.btn-edit');
        if (eltedit) {
          eltedit.unbind('click');
          eltedit.bind('click', () => {
            this.rowEditClickHandler(data,index);
          });
          
        }
        const eltdelete = $('td', row).find('a.btn-delete');
        if (eltdelete) {
          eltdelete.unbind('click');
          eltdelete.bind('click', () => {
            // this.rowDeleteClickHandler(data);
            this.rowDeleteClickHandler(data);

          });
        }
        return row;
      },
    };
  }


// Action column handlers connecting to angular methods directly from within jquatu table
rowFirstNameClickHandler(data:any,rowindex:any) {
  // this.router.navigate(['/Empdetail/' + data.EmpID]);
  // alert(data.ImageData)
  // $("#prophotoimage").attr("src","/assets/images/project/"+data.ImageData);
  // now in backend for multer upload
  $("#prophotoimage").attr("src",this.commonService.baseUrl+"/img/prophoto/" + data.ImageData);
  this.clickedIndexOfDt = rowindex; // set the clickedIndexOfDt to show the clicked row photo in lightbox

  // this.dynamicimagepath = this.commonService.baseUrl + "/img/project/" + data.ImageData; //used to show img in edit modal
  // alert(this.dynamicimagepath);
}


rowDetailClickHandler(data:any) {
  // alert("Detail Handler: "+data.firstname+"");
  // this.router.navigate(['/Empdetail/' + data.ID]); //TODO
  //  this.showProDescriptionDetailModal(data.ID);
}
rowEditClickHandler(data:any,rowindex:any) {
  // alert("Edit Handler: "+data.firstname+"");
    // this.showProDescriptionEditModal(data.ID) // for edit pass only data instead of data.empid
    // if (this.commonService.user_role === 'guest') { 
    //   alert("Need permission.");
    // }
    // else{
    //   this.showProDescriptionEditModal(data.ID) 
    // }
    if (this.commonService.checkEditRole()) {
      this.showProPhotoEditModal(data.ID)    
     }

     $("#prophotoimage").attr("src",this.commonService.baseUrl+"/img/prophoto/" + data.ImageData);
     this.dynamicimagepath = this.commonService.baseUrl + "/img/prophoto/" + data.ImageData; //used to show img in edit modal
     this.clickedIndexOfDt = rowindex; // set the clickedIndexOfDt to be used for return to same row after edit

}
rowDeleteClickHandler(data:any) {
  // alert("Delete Handler: "+data.firstname+"");
  // this.deleteProDescription(data.ID);
  // if (this.commonService.user_role === 'guest' || this.commonService.user_role === 'user' ) {
  //   alert("Need permission.");
  // }
  // else {
  //   this.deleteProDescription(data.ID);
  // }
  if (this.commonService.checkDeleteRole()) {
    // this.deleteProPhoto(data.ID);
    this.deleteProPhoto(data.ID); // need ProjectNo and PhotoName to delete uploaded file
    return;
  }
}



clearForm() {
  this.proPhotoFormGroup.controls['id'].setValue(0);
  this.proPhotoFormGroup.controls['photoname'].setValue('');
  // this.proPhotoFormGroup.controls['photoname'].setValue(0);

  this.proPhotoFormGroup.controls['description'].setValue(''); 
  this.proPhotoFormGroup.controls['imagedata'].setValue('');  
  // this.proPhotoFormGroup.controls['createdate'].setValue(''); 
  // this.proPhotoFormGroup.controls['lastmodifydate'].setValue('');
  this.proPhotoFormGroup.controls['createdby'].setValue(0);
  this.proPhotoFormGroup.controls['lastmodifiedby'].setValue(0);
  this.proPhotoFormGroup.controls['projectid'].setValue(0);//(this.childprojectid);
  // $("#imageloaderdiv").prop("src",this.commonService.frontendUrl+"/assets/images/project/not_found.JPG");
  
}





showProPhotoEditModal(e:any){

  this.clearForm(); //clear the form of previous edit data
  this.modalClicked = "editModal"
  this.loading2 = true;
      
  $('#btnproPhotoEditModalShow').click();
  this.proPhotoService.getProPhoto(e).subscribe(resp => {

    //this.editData = resp; //use .data after resp for post method. Now using FormFroup to put data
    // **FormFroup and FormControl is used to pass value to edit form instead of [(ngModel)]
    // this.empid=resp.empid; // to pass to child modal if used

    // this.empid = resp.EmpID; // to pass to child modal if used

    // this.empDegreeFormGroup.patchValue(resp); 
    // OR
    
    this.proPhotoFormGroup.controls['id'].setValue(resp.ID);
    this.proPhotoFormGroup.controls['projectid'].setValue(resp.ProjectID);//(this.childprojectid);
    this.proPhotoFormGroup.controls['photoname'].setValue(resp.PhotoName);//(this.childprojectid);
    this.proPhotoFormGroup.controls['projectno'].setValue(resp.ProjectNo); // not in db for photo folder name
    this.proPhotoFormGroup.controls['description'].setValue(resp.Description);
    this.proPhotoFormGroup.controls['imagedata'].setValue(resp.ImageData);
    this.proPhotoFormGroup.controls['createdate'].setValue(resp.CreateDate); // auto generated in backend using moment
    this.proPhotoFormGroup.controls['lastmodifydate'].setValue(resp.LastModifyDate);// auto generated in backend using moment
    this.proPhotoFormGroup.controls['createdby'].setValue(resp.CreatedBy);
    this.proPhotoFormGroup.controls['lastmodifiedby'].setValue(resp.LastModifiedBy);
    this.proPhotoFormGroup.controls['discreatedby'].setValue(resp.disCreatedBy);
    this.proPhotoFormGroup.controls['dislastmodifiedby'].setValue(resp.disLastModifiedBy);


    let x=this.proPhotoFormGroup.controls['createdate'].value;
    var formattedDate1 = this.datePipe.transform(x, "MM-dd-yyyy");//output : 2018-02-13
    this.proPhotoFormGroup.controls['createdate'].setValue(formattedDate1);
    var formattedDate2 = this.datePipe.transform(resp.LastModifyDate, "MM-dd-yyyy");//output : 2018-02-13
    this.proPhotoFormGroup.controls['lastmodifydate'].setValue(formattedDate2);


    // this.proPhotoFormGroup.controls['image'].setValue(resp.Image);
    // note: Dates are auto generated in backend using moment
    this.loading2 = false;
  },
    err => {
      // For Validation errors
      if (err.status === 422 || err.status === 400) {
        // alert(err.error.errors[0].msg);
        this.formErrors = err.error.errors;
      }
      else {
        alert(err.message);
      }
    });

}





  showProPhotoAddModal() {

    if (!this.commonService.checkAddRole()) {
      return;
    }


    // this.clearForm(); //clear the form of previous edit data
    this.dynamicimagepath = '';
    // $("#imageloaderdiv").attr("src",'');


      this.modalClicked = "addModal";
      // $('#btnProTeamEditModalShow').click(); 
      $('#btnproPhotoEditModalShow').click(); 
      // $("#prophotoimage").attr("src","/assets/images/project/not_found.JPG");



      // Now maxid is generated in backend
      // Get the maxid
      //***************************** */
      // let maxid = 0;
      // this.proPhotoService.getMaxProPhotoID().subscribe(resp => {
  
      //   maxid = resp[0].maxprophotoid;

  
        //**employeeFormGroup control within the subscribe so tha values are set after maxid is retrieved from database  */
        // clear form group since same group is used for edit and add
        // Now formgroup is used instead of data object to pass value
        this.proPhotoFormGroup.reset(); // to clear the previous validations
        // Manualy set default values since reset() will will turn values to null: // https://stackoverflow.com/questions/51448764/why-are-formgroup-controls-null-after-formgroup-reset
        // this.employeeFormGroup.controls['empid'].setValue(0);
  
        let projectno: any = '';
        if (this.proPhotoData.length > 0) {
          projectno = this.proPhotoData[0].ProjectNo;
        }
        else {
          projectno = '';
        }

        // this.proPhotoFormGroup.controls['id'].setValue(maxid + 1);
        this.proPhotoFormGroup.controls['id'].setValue(0);
        this.proPhotoFormGroup.controls['projectid'].setValue(this.childprojectid);//(this.childprojectid);
        this.proPhotoFormGroup.controls['photoname'].setValue('');//(this.childprojectid);
        // this.proPhotoFormGroup.controls['photoname'].setValue(0);//(this.childprojectid);

        this.proPhotoFormGroup.controls['projectno'].setValue(projectno); // not in db for photo folder name
        this.proPhotoFormGroup.controls['description'].setValue('');
        this.proPhotoFormGroup.controls['imagedata'].setValue('');
        this.proPhotoFormGroup.controls['createdate'].setValue(''); // note: Dates are auto generated in backend using moment
        this.proPhotoFormGroup.controls['lastmodifydate'].setValue(''); // note: Dates are auto generated in backend using moment
        this.proPhotoFormGroup.controls['createdby'].setValue(0);
        this.proPhotoFormGroup.controls['lastmodifiedby'].setValue(0);

        // this.proPhotoFormGroup.controls['image'].setValue('');
        // note: Dates are auto generated in backend using moment
        
      // },
  
      //   err => {
      //     // For Validation errors
      //     if (err.status === 422 || err.status === 400) {
      //       // alert(err.error.errors[0].msg);
      //       this.formErrors = err.error.errors;
      //     }
      //     else {
      //       alert(err.message);
      //     }
      //   });
  }



  // called form save clicked to detect any new errors on save click.
  clearFormErrors() {
    this.formErrors = [{}];

  }



  saveProPhoto() {

    //   // check internet connection first
    //   var onlineOffline = navigator.onLine;
    //   if (onlineOffline===false) {
    //     alert("no internet connection");
    //     return;
    //   }
    if (this.modalClicked == "editModal") {
      this.updateProPhoto();
    }
    if (this.modalClicked == "addModal") {
      this.addProPhoto();
    }
  }







  updateProPhoto() {
    // **FormFroup and FormControl is used to pass value to save form instead of [(ngModel)]

    this.loading2 = true;

    if (this.proPhotoFormGroup.invalid) {
      this.loading2 = false;
      return;
    }

 



  // 2024 client side image size validation. 'imagesize' value is set in onFileChange() method
    if (this.imagesize/1024>1000) {
      alert("Image size should be less than 1MB");
      this.loading2 = false;
      return;
    }


    let src: any = $('#imageloader').prop('src')

    // alert(src);
    // return;
    // if (src == 'http://localhost:4200/assets/images/project/not_found.JPG') {
      if (src == this.commonService.frontendUrl+"/assets/images/project/not_found.JPG") {
       
      alert("Please select an image.");
      this.loading2 = false;
      return;
    }


    // **IMPORTANT: files cannot be uloaded Without using FormData(js class)
    // var form = $("#empform").get(0); // get the form to pass into formData constructor 
    var fd:any = new FormData();


    // fd.append("PhotoName", this.formdata.PhotoName);
    // fd.append("PhotoName", this.proPhotoFormGroup.controls['photoname'].value);
    fd.append("PhotoName", this.proPhotoFormGroup.controls['photoname'].value);

    fd.append("Description", this.proPhotoFormGroup.controls['description'].value);//.proPhotoFormGroup.controls['description'].value);
    fd.append("ImageData", this.proPhotoFormGroup.controls['imagedata'].value);
    fd.append("CreateData", this.proPhotoFormGroup.controls['createdate'].value);
    fd.append("LastModifiedBy", this.proPhotoFormGroup.controls['lastmodifiedby'].value);
    fd.append("CreatedBy", this.proPhotoFormGroup.controls['createdby'].value);
    fd.append("ProjectID", this.proPhotoFormGroup.controls['projectid'].value);
    // fd.append("ProjectNo", this.proPhotoFormGroup.controls['projectno'].value);
    fd.append("ProjectNo", this.childprojectno);
    fd.append("ID", this.proPhotoFormGroup.controls['id'].value);
    
    // createdate: new FormControl(''),
    // lastmodifydate: new FormControl(''),

    var fileInput: any = this.proPhotoFormGroup.controls['image'].value;
    // fd.append('Image', fileInput);
    // if ($("#ImageData").val()!="") {
    if (this.proPhotoFormGroup.controls['image'].value !== "null") {
      // formData.append('Image', fileInput, imagename);
      fd.append('Image', fileInput);
    }
// console.log(fd)
    // this.proPhotoService.updateProPhoto(this.proPhotoFormGroup.value).subscribe(resp => {
    this.proPhotoService.updateProPhoto(fd).subscribe(resp => {

      
      // $("#empeditmodal").modal("hide");
      $("#btnproPhotoEditCloseModal").click();
      // this.refreshEmployeeDatatable();
      // this.refreshEmpDetail.next('somePhone'); //calling  loadEmpDetail() from parent component
      this.refreshDatatableProPhoto();
      // this.dynamicimagepath = '' + this.commonService.baseUrl + '/img/prophoto/' + this.proPhotoData[this.clickedIndexOfDt].ImageData;
      // $("#prophotoimage").attr("src", this.commonService.baseUrl+"/img/prophoto/" + this.proPhotoData[this.clickedIndexOfDt].ImageData);//show the first image

      this.loading2 = false;



    },
      err => {
        // console.log(error.error.errors[0].param); //working
        // console.log(error.error.errors[0].msg); //working
        this.loading2 = false;

        // Form backend Validation errors
        if (err.status === 422 || err.status === 400) {
          this.formErrors = err.error.errors;// alert(err.error.errors[0].msg);
        }
        else {
          alert(err.error.text);
          // console.log(err.error)
        }

      });


  }








  addProPhoto() {

    this.loading2 = true;

    // 2024 client side image size validation. 'imagesize' value is set in onFileChange() method
    if (this.imagesize/1024>1000) {
      alert("Image size should be less than 1MB");
      this.loading2 = false;
      return;
    }

        // **IMPORTANT: files cannot be uloaded Without using FormData(js class)
    // var form = $("#empform").get(0); // get the form to pass into formData constructor 
    var fd:any = new FormData();


    //  fd.append("PhotoName", this.formdata.PhotoName);
    fd.append("PhotoName", this.proPhotoFormGroup.controls['photoname'].value);
    fd.append("Description", this.proPhotoFormGroup.controls['description'].value);//.proPhotoFormGroup.controls['description'].value);
    fd.append("ImageData", this.proPhotoFormGroup.controls['imagedata'].value);
    fd.append("LastModifiedBy", this.proPhotoFormGroup.controls['lastmodifiedby'].value);
    fd.append("CreatedBy", this.proPhotoFormGroup.controls['createdby'].value);
    fd.append("ProjectID", this.proPhotoFormGroup.controls['projectid'].value);
    // fd.append("ProjectNo", this.proPhotoFormGroup.controls['projectno'].value);
    // input childprojectno is used to get projectno and pass to backend to create project folder -->
    fd.append("ProjectNo", this.childprojectno);
    fd.append("ID", this.proPhotoFormGroup.controls['id'].value);


    var fileInput: any = this.proPhotoFormGroup.controls['image'].value;
    // fd.append('Image', fileInput);
    // if ($("#ImageData").val()!="") {
    if (this.proPhotoFormGroup.controls['image'].value !== "null") {
      // formData.append('Image', fileInput, imagename);
      fd.append('Image', fileInput);
    }
    // console.log(this.proPhotoData)
    // // alert(this.proPhotoData.ProjectNo);
    // return;
    this.proPhotoService.addProPhoto(fd).subscribe(resp => {

      
      // $("#empeditmodal").modal("hide");
      $("#btnproPhotoEditCloseModal").click();
      // this.refreshEmpDetail.next('somePhone'); //calling  loadEmpDetail() from parent component
      
      this.refreshDatatableProPhoto();
      this.loading2 = false;
      // show newly added img not working
      // this.dynamicimagepath = '' + this.commonService.baseUrl + '/img/prophoto/' + resp.ImageData;
      // $("#prophotoimage").prop("src", this.commonService.baseUrl+"/img/prophoto/" + resp.ImageData);//show the first image
// this.clickedIndexOfDt=7;
this.newaddedimagedata=resp.ImageData;


    },
      err => {

        this.loading2 = false;
        // Form backend Validation errors
        if (err.status === 422 || err.status === 400) {
          this.formErrors = err.error.errors;// alert(err.error.errors[0].msg);
        }
        else {
          alert(err.message);
        }

      });



  }






//   updateProPhoto-vue() {
//  // this.loading2=true // using spinner for photo

//  var s1 = 'admin' // Blocked for test //this.$usertype;
//  var s2 = "admin";
//  if (s1.trim() !== s2.trim()) { // trim should be used for js string compare for any white space
//    alert("You don't have permission to run this operation");
//    // $("#globalunauthorisedmsg").modal("show");
//    return;
//  }

//  // client side image size validation
//  var imgpath = document.getElementById('ImageData');
//  if (!imgpath.value == "") {
//    var img = imgpath.files[0].size;
//    var imgsize = img / 1024;
//    if (imgsize > 1000) {
//      alert("Image size should be less than 1MB");
//      return;
//    }
//  }

//  // wait spinner for uploading image
//  $("#spinnerprophoto").fadeIn("slow");

//  let apiurl = ''; // used for add/update api in same method

//  if (this.addmode) {
//    // apiurl="apiprophotoadddata/";
//    apiurl = this.$host + "api/prophoto/";
//  } else {
//    // apiurl="apiprophotoupdatedata/";
//    apiurl = this.$host + "api/prophoto/update/";
//  }

//  // **IMPORTANT: files cannot be uloaded Without using FormData(js class)
//  // var form = $("#empform").get(0); // get the form to pass into formData constructor 
//  var fd = new FormData();

//  fd.append("PhotoName", this.formdata.PhotoName);
//  fd.append("ProjectID", this.formdata.ProjectID);
//  fd.append("ID", this.formdata.ID);

//  //  Foreign key is used in main table for List items col which has to set to null(instead of 0) 
//  //  ONDELETE(when a list item row id deleted) as per mysql. 
//  //  But null cannot be inserted in int field so 0 is set here
//  //  In Employee FormData is used instead of this.formdata for Image. But FormData sends null as string 'null'
//  //  So for Employee where FormData is used null value has to be converted to '' before sending to controller
//  //  Sending a value of '' will store NULL in the field if default value for the field is NULL
//  if (this.formdata.CreatedBy == null) { this.formdata.CreatedBy = ''; }
//  if (this.formdata.LastModifiedBy == null) { this.formdata.LastModifiedBy = ''; }
//  if (this.formdata.ImageData == null) { this.formdata.ImageData = ''; }
//  if (this.formdata.Description == null) { this.formdata.Description = ''; }

//  fd.append("CreatedBy", this.formdata.CreatedBy);
//  fd.append("LastModifiedBy", this.formdata.LastModifiedBy);
//  fd.append("Description", this.formdata.Description);
//  fd.append("ImageData", this.formdata.ImageData);

//  // extra field needed for photo path not in db table, get ProjectNo val from parent using $parent
//  fd.append('ProjectNo', this.$parent.project.ProjectNo);

//  // var imagename = $("#EmployeeID").val() + ".jpg";
//  // var fileInput = this.formdata.Image;//document.getElementById("ImageData").files[0];
//  var fileInput = this.formdata.Image;

//  // if ($("#ImageData").val()!="") {
//  if (this.formdata.Image !== "null") {
//    // formData.append('Image', fileInput, imagename);
//    fd.append('Image', fileInput);
//  }

//  // axios.post(apiurl, this.formdata).then(response => {
//  this.$axios.post(apiurl, fd).then(response => {

//    // $("#prophotomodal").modal("hide");

//    iziToast.success({
//      title: "Successful",
//      position: "topRight",
//      message: "Saved project photo successfully"
//    });

//    $('#proPhotoTable').DataTable().ajax.reload(); // refresh parent table

//    // to select edited row after edit but looses after table ajax.reload
//    // var r=this.rowindex;
//    // $("#proPhotoTable").find("tbody tr:eq("+r+")").trigger("click");   


//    // fill and update imagegallerylist to use for photogallery next prev
//    // rowindex of the added/updated row is set in prodetail photolinktab() method fro proper next and prev
//    this.fillimagegallerylist();


//    // // in both add and edit show the edited/added phpto in tab
//    // // this.$parent.imagepath="images/prophoto/"+response.data;
//    // $('.imagetabdiv').css("background-image", "url(images/prophoto/"+response.data+"");// for crossfader set div background image
//    // // set the parent imagepath to use it for image gallery on image tab pane click
//    // this.$parent.imagepath="images/prophoto/"+response.data;
//    // // this.imagepathforgallery="images/prophoto/"+response.data;

//    var self = this
//    // For NODE
//    // in both add and edit show the edited/added phpto in tab
//    // this.$parent.imagepath="images/prophoto/"+response.data;
//    $('.imagetabdiv').css("background-image", "url(" + self.$host + "img/prophoto/" + response.data + "");// for crossfader set div background image
//    // set the parent imagepath to use it for image gallery on image tab pane click
//    this.$parent.imagepath = this.$host + "img/prophoto/" + response.data;
//    // this.imagepathforgallery="images/prophoto/"+response.data;


//    this.addmode = true; //now done in onmodalhide(), still used here
//    $("#prophotomodal").modal("hide");
//    $("#spinnerprophoto").fadeOut("slow");

//  })

//    .catch((err) => {

//      // Validation errors
//      if (err.response.status === 422 || err.response.status === 400) {
//        this.formErrors = err.response.data.errors;
//        // this.isFormError = true;
//        var arr = Object.keys(this.formErrors);
//        var height = arr.length * 33;
//        $("#prophototoperrbar").css("height", height + "px");
//      }

//      // For no token(401) or token failed varification(403)
//      else if (err.response.status === 401 || err.response.status === 403) {
//        this.formErrors = err.message
//        $("#prophototoperrbar").css({ "height": 60 + "px", "padding": 10 + "px" });
//      }

//      // Other errors including sql errors(500-internal server error)
//      else {
//        this.formErrors = err.message + ". Please check network connection.";
//        $("#prophototoperrbar").css({ "height": 60 + "px", "padding": 10 + "px" });
//      }

//      // this.loading2 = false;
//      $("#spinnerprophoto").fadeOut("slow");

//    }); // end catch  

//   }








  deleteProPhoto(id: any) {

    if (confirm('Are you sure you want to delete this record?')) {
      // Delete it!
    } else {
      // Do nothing!
      return;
    }
    this.modalClicked=""; // 2024 used for condition in ngafterviewinit
    // this.proPhotoService.deleteProPhoto(id).subscribe(resp => {

    // this.proPhotoService.deleteProPhoto(id,"1990-0238/Photo8.jpg").subscribe(resp => {
      // let x:any={"id":id,"imagedata":imagedata}
      this.proPhotoService.deleteProPhoto(id).subscribe(resp => {

      // $("#empeditmodal").modal("hide");
      // this.refreshEmployeeDatatable();
      // this.router.navigateByUrl('Employee') //navigate to AngularDatatable
      this.refreshDatatableProPhoto();  // to refresh datatable after delete

    },
      err => {
        // For Validation errors
        if (err.status === 422 || err.status === 400) {
          // alert(err.error.errors[0].msg);
          this.formErrors = err.error.errors;
        }
        else {
          alert(err.message);
        }
      });

    // if (!this.errors) {
    //   //route to new page
    // }

  }




    // Fill all combos in one function using forkJoin of rxjx
    // Fill all combos in one function using forkJoin of rxjx
    // fillAllCmb() {
    //   this.loading2=true;
    //   forkJoin([

    //     this.projectSearchService.getCmbProPhoto(), //observable 8
    //     // this.projectSearchService.getCmbEmpMain(), //observable 3
    //   // ]).subscribe(([CmbProPhoto,CmbEmpMain]) => {
    //   ]).subscribe(([CmbProPhoto]) => {
    //     // When Both are done loading do something
    //     this.CmbProPhoto = CmbProPhoto;
    //     // this.CmbEmpMain = CmbEmpMain;
    //     this.loading2=false;

    //   }, err => {
    //     alert(err.message);
    //     // alert("Problem filling Employee combos");
    //   });
    //   // if (!this.errors) {
    //   //   //route to new page
    //   // }

    // }






}

