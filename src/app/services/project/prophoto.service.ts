import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../common.service';

@Injectable({
  providedIn: 'root'
})
export class ProphotoService {

  constructor(private http: HttpClient, private commonService: CommonService) {
    
   }




}
