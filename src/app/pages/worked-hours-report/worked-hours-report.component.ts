import { ConnectionService } from './../../services/connection.service';
import { WorkedDay } from './interfaces/worked-day';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-worked-hours-report',
  templateUrl: './worked-hours-report.component.html',
  styleUrls: ['./worked-hours-report.component.scss']
})
export class WorkedHoursReportComponent implements OnInit {

  public workedHoursForm = new FormGroup({
    workerID: new FormControl('', Validators.required),
    jobID: new FormControl('', Validators.required),
    jobStartDate: new FormControl('', Validators.required),
    jobEndDate: new FormControl('', Validators.required)
  });
  private workedDays: WorkedDay[] = [];
  private dayHours = 0;
  private nightHours = 0;
  private sundayHours = 0;
  public isReportSaving = false;

  constructor(private connectionService: ConnectionService) { }

  ngOnInit(): void {
    this.workedHoursForm.controls.jobEndDate.valueChanges.subscribe((value) => {
      if (this.workedHoursForm.controls.jobStartDate.value) {
        if (value && value <= this.workedHoursForm.controls.jobStartDate.value) {
          this.workedHoursForm.controls.jobEndDate.setErrors({ oldDate: true });
        } else {
          this.workedHoursForm.controls.jobEndDate.setErrors(null);
        }
      }
    });

    this.workedHoursForm.controls.jobStartDate.valueChanges.subscribe((value) => {
      if (this.workedHoursForm.controls.jobEndDate.value) {
        if (value && value >= this.workedHoursForm.controls.jobEndDate.value) {
          this.workedHoursForm.controls.jobEndDate.setErrors({ oldDate: true });
        } else {
          this.workedHoursForm.controls.jobEndDate.setErrors(null);
        }
      }
    });
  }

  public sendform(): void {
    this.isReportSaving = true;
    this.calculateServiceHours(new Date(this.workedHoursForm.value.jobStartDate),
      new Date(this.workedHoursForm.value.jobEndDate));
    this.connectionService.sendHoursReport({
      idReport: this.workedHoursForm.value.jobID,
      idTechnical: this.workedHoursForm.value.workerID,
      workedDays: this.workedDays
    }).then(() => {
      this.isReportSaving = false;
      this.workedHoursForm.controls.jobStartDate.reset();
      this.workedHoursForm.controls.jobEndDate.reset();
      this.workedDays = [];
    }).catch(() => {
      this.isReportSaving = false;
      this.workedHoursForm.controls.jobStartDate.reset();
      this.workedHoursForm.controls.jobEndDate.reset();
      this.workedDays = [];
    });
  }

  private addWorkedDay(startDate: Date, endDate): void {
    this.workedDays.push({
      weekNumber: this.getDateWeek(startDate),
      dayHours: Number(this.dayHours.toFixed(1)),
      nightHours: Number(this.nightHours.toFixed(1)),
      sundayHours: Number(this.sundayHours.toFixed(1)),
      startDate,
      endDate
    });
    this.dayHours = 0;
    this.nightHours = 0;
    this.sundayHours = 0;
  }

  private calculateServiceHours(startDate: Date, endDate: Date): void {
    if (startDate.getFullYear() === endDate.getFullYear() &&
        startDate.getMonth() === endDate.getMonth() &&
        startDate.getDate() === endDate.getDate()) {
          this.calculateServiceHoursPerDay(startDate, endDate);
    } else {
      this.calculateServiceHoursPerDay(startDate, this.getLastDayHour(startDate));
      startDate.setDate(startDate.getDate() + 1);
      startDate.setHours(0, 0, 0);
      while (startDate.getDate() !== endDate.getDate()) {
        this.calculateServiceHoursPerDay(startDate, this.getLastDayHour(startDate));
        startDate.setDate(startDate.getDate() + 1);
        startDate.setHours(0, 0, 0);
      }
      this.calculateServiceHoursPerDay(startDate, endDate);
    }
  }

  private calculateServiceHoursPerDay(startDate: Date, endDate: Date): void {
    let tempDate: Date;
    if (startDate.getHours() === endDate.getHours()) {
      this.setWorkedMinutes(startDate, false, endDate);
    } else {
      if (startDate.getMinutes() !== 0) {
        tempDate = new Date(startDate);
        this.setWorkedMinutes(startDate, true);
      }
      this.setWorkedTimeBetweenTwoHours(startDate.getHours(), endDate.getHours(), startDate.getDay());
      if (endDate.getMinutes() !== 0) {
        this.setWorkedMinutes(endDate, false);
      }
    }
    this.addWorkedDay(tempDate ? tempDate : startDate, endDate);
  }

  private setWorkedTimeBetweenTwoHours(startHour: number, endHour: number, currentDay: number): void {
    for (let i = startHour; i < endHour; i++) {
      switch (this.getHourType(i, currentDay)) {
        case 'S':
          this.sundayHours++;
          break;
        case 'D':
          this.dayHours++;
          break;
        case 'N':
          this.nightHours++;
          break;
      }
    }
  }

  private setWorkedMinutes(date: Date, isInitialMinutes: boolean, hourFractionDate?: Date): void {
    let minutes: number;
    if (hourFractionDate) {
      minutes = (hourFractionDate.getMinutes() - date.getMinutes()) / 60;
    } else {
      minutes = isInitialMinutes ? (60 - date.getMinutes()) / 60 : date.getMinutes() / 60;
    }
    switch (this.getHourType(date.getHours(), date.getDay())) {
      case 'S':
        this.sundayHours = this.sundayHours + minutes;
        break;
      case 'D':
        this.dayHours = this.dayHours + minutes;
        break;
      case 'N':
        this.nightHours = this.nightHours + minutes;
        break;
    }
    if (isInitialMinutes) {
      date.setHours(date.getHours() + 1);
    }
  }

  private getHourType(hour: number, currentDay: number): string {
    if (currentDay === 0) {
      return 'S';
    } else {
      if (hour >= 7 && hour <= 19) {
        return 'D';
      } else {
        return 'N';
      }
    }
  }

  private getLastDayHour(date: Date): Date {
    const lastDayHour = new Date(date.getTime());
    lastDayHour.setHours(23, 59, 59);
    return lastDayHour;
  }

  private getDateWeek(date: Date): number {
    const tempDate = new Date(date);
    tempDate.setHours(0, 0, 0, 0);
    tempDate.setDate(tempDate.getDate() + 3 - (tempDate.getDay() + 6) % 7);
    const week1 = new Date(tempDate.getFullYear(), 0, 4);
    return 1 + Math.round(((tempDate.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  }
}
