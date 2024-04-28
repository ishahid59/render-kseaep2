import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../common.service';

@Injectable({
  providedIn: 'root'
})
export class EmpprevemploymentService {
  
        // http://localhost:5000  http://localhost:5000
        constructor(private http: HttpClient, private commonService: CommonService) {
        }




}
