import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  private readonly HOST_API = environment.HOST_API;
  private readonly sendReportEnpoint = '/report/add';
  private readonly getReportEnpoint = '/report/';
  private headers: HttpHeaders = new HttpHeaders();

  constructor(private http: HttpClient) {
    this.headers = this.headers.append('Content-Type', 'application/json');
  }

  public sendHoursReport(params: any) {
    return this.http.post(this.HOST_API + this.sendReportEnpoint, params, { headers: this.headers }).toPromise();
  }

  public getHoursReport(workedID: string, weekNumber: string) {
    return this.http.get(this.HOST_API + this.getReportEnpoint + workedID + '/' + weekNumber).toPromise();
  }
}
