import { WorkReport } from './interfaces/work-report';
import { ConnectionService } from './../../services/connection.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-worked-hours-consult',
  templateUrl: './worked-hours-consult.component.html',
  styleUrls: ['./worked-hours-consult.component.scss']
})
export class WorkedHoursConsultComponent implements OnInit {

  public consultingHoursForm = new FormGroup({
    workerID: new FormControl('', Validators.required),
    weekNumber: new FormControl('', Validators.required)
  });
  public isReportSaving = false;
  public workreport: WorkReport;

  constructor(private connectionService: ConnectionService) { }

  ngOnInit(): void {
  }

  public sendform(): void {
    this.isReportSaving = true;
    this.connectionService.getHoursReport(this.consultingHoursForm.value.workerID,
      this.consultingHoursForm.value.weekNumber).then((response: any) => {
        this.workreport.dayHours = response.dayHours;
        this.workreport.nightHours = response.nightHours;
        this.workreport.sundayHours = response.sundayHours;
        this.workreport.extraDayHours = response.extraDayHours;
        this.workreport.extraNightHours = response.extraNightHours;
        this.workreport.extraSundayHours = response.extraSundayHours;
        this.workreport.workerID = response.idTechnical;
        this.workreport.weekNumber = response.weekNumber;
        this.isReportSaving = false;
      }).catch(() => {
        this.isReportSaving = false;
      });
  }
}
