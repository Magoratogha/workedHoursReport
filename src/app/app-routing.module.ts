import { WorkedHoursConsultComponent } from './pages/worked-hours-consult/worked-hours-consult.component';
import { WorkedHoursReportComponent } from './pages/worked-hours-report/worked-hours-report.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: 'report', component: WorkedHoursReportComponent },
  { path: 'consult', component: WorkedHoursConsultComponent },
  { path: '**', redirectTo: '/report', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
