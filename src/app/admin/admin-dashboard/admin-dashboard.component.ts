import { Component } from '@angular/core';
import { ConstantData } from 'src/app/utils/constant-data';
import { } from 'src/app/utils/load-data.service';
import { ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../utils/app.service';
import { Status } from '../../utils/enum';
import { LoadDataService } from '../../utils/load-data.service';
import { ActionModel, RequestModel, StaffLoginModel } from '../../utils/interface';
import { LocalService } from '../../utils/local.service';
import { Router } from '@angular/router';

declare var $: any
declare var toastr: any;

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  dataLoading: boolean = false;
  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private loadData: LoadDataService,
    private localService: LocalService,
    private router: Router
  ) {

  }

  dashboardSummary = {
    TodaySupply: 10,
    TodayPayment: 10,
    WeeklySupply: 10,
    WeeklyPayment: 10,
    MonthlySupply: 10,
    MonthlyPayment: 10,
  };

  ngOnInit() {

    this.getDashboardData();
    // interval(60000).subscribe(() => this.getDashboardData()); // Refresh every 1 min


  }


  getDashboardData() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    }
  this.dataLoading = false;

    this.service.getDashboardSummary(obj).subscribe(r1 => {
      this.dataLoading = false;

      let response = r1 as any
      if (response.Message === ConstantData.SuccessMessage) {
        this.dashboardSummary = {
          TodaySupply: response.TodaySupply,
          TodayPayment: response.TodayPayment,
          WeeklySupply: response.WeeklySupply,
          WeeklyPayment: response.WeeklyPayment,
          MonthlySupply: response.MonthlySupply,
          MonthlyPayment: response.MonthlyPayment,
        };


      }
    })
  }

}
