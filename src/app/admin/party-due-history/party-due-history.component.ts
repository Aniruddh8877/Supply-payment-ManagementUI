import { Component } from '@angular/core';
import { ConstantData } from 'src/app/utils/constant-data';
import { } from 'src/app/utils/load-data.service';
import { ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../utils/app.service';
import { PaymentMode, Status } from '../../utils/enum';
import { LoadDataService } from '../../utils/load-data.service';
import { ActionModel, RequestModel, StaffLoginModel } from '../../utils/interface';
import { LocalService } from '../../utils/local.service';
import { Router } from '@angular/router';
declare var $: any
declare var toastr: any;

@Component({
  selector: 'app-party-due-history',
  templateUrl: './party-due-history.component.html',
  styleUrls: ['./party-due-history.component.css']
})
export class PartyDueHistoryComponent {
  PageSize = ConstantData.PageSizes;
  itemPerPage: number = this.PageSize[0];
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  p: number = 1;
  ListParty: any = {};
  dataLoading: boolean = false
  CityList: any = []
  PartyDueHistoryList: any = [];
  PartyDueHistory: any = {};
  isSubmitted = false
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  action: ActionModel = {} as ActionModel;
  StateList: any[] = [];
  filterState: any[] = [];
  StatusList = this.loadData.GetEnumList(Status);
  LocationList: any = [];
  selectedLocationId: number = 0;
  selectedLocationName: string = '';




  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  onTableDataChange(p: any) {
    this.p = p
  }

  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private loadData: LoadDataService,
    private localService: LocalService,
    private router: Router
  ) { }
  ngOnInit(): void {

    // console.log(this.staffLogin);
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.GetParyDueHistorylist(this.LocationList.LocationId);
    // this.GetParyDueHistorylist(); 
    this.resetForm();
    this.getLocationList(this.LocationList.LocationId);

  }


  validiateMenu() {
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Url: this.router.url, StaffLoginId: this.staffLogin.StaffLoginId })).toString()
    }
    this.dataLoading = true
    this.service.validiateMenu(request).subscribe((response: any) => {
      this.action = this.loadData.validiateMenu(response, this.toastr, this.router)
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }



  @ViewChild('formPartyDueHistory') formPartyDueHistory: NgForm;

  resetForm() {
    this.PartyDueHistory = {};
    if (this.formPartyDueHistory) {
      this.formPartyDueHistory.control.markAsPristine();
      this.formPartyDueHistory.control.markAsUntouched();
    }
    this.isSubmitted = false
    this.PartyDueHistory.Status = 1
  }

  filterPartyList(value: any) {
    if (value) {
      const filterValue = value.toLowerCase();
      this.filterState = this.StateList.filter((option: any) => option.StateName.toLowerCase().includes(filterValue));
    } else {
      this.filterState = this.StateList;
    }
  }

  afterStateSelected(event: any) {
    this.PartyDueHistory.PaymentDetailId = event.option.id;
  }

  AllCreditAmount: any = {};
  AllDebitAmount: any = {};
  AllBalanceDue: any = {};

  GetParyDueHistorylist(locationId?: number) {
    let filterObj: any = {};
    if (locationId && locationId > 0) {
      filterObj.LocationId = locationId;
    }
    const obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(filterObj)).toString()
    };
    this.dataLoading = true;
    this.service.GetParyDueHistorylist(obj).subscribe(
      (r1) => {
        const response = r1 as any;
        if (response.Message === ConstantData.SuccessMessage) {
          this.PartyDueHistoryList = response.PartyDueHistoryList;
          this.AllCreditAmount = response.AllCreditAmount;
          this.AllDebitAmount = response.AllDebitAmount;
          this.AllBalanceDue = response.AllBalanceDue;
          this.filterState = this.StateList;
          console.log(this.PartyDueHistoryList);
        } else {
          this.toastr.error(response.Message);
        }
        this.dataLoading = false;
      },
      (err) => {
        this.toastr.error("Error while fetching records");
        this.dataLoading = false;
      }
    );
  }


  clearParty() {
    this.selectedLocationId = 0;
    this.selectedLocationName = '';
    this.GetParyDueHistorylist(); // fetch all data
  }



  getLocationList(data: any) {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ data })).toString()
    }
    this.dataLoading = true
    this.service.getLocationList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.LocationList = response.LocationList;
        this.filterState = this.StateList;
        console.log("this is location list for location", this.LocationList);
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }



  onLocationChange(name: string) {
    const selected = this.LocationList.find((loc: any) => loc.LocationName === name);
    this.selectedLocationId = selected ? selected.LocationId : 0;
  }



}
