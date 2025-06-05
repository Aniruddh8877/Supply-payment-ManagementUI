import { Component } from '@angular/core';
import { ConstantData } from 'src/app/utils/constant-data';
import { } from 'src/app/utils/load-data.service';
import { ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../utils/app.service';
import { PaymentMode, Status } from '../../utils/enum';
import { LoadDataService } from '../../utils/load-data.service';
import {
  ActionModel,
  RequestModel,
  StaffLoginModel,
} from '../../utils/interface';
import { LocalService } from '../../utils/local.service';
import { Router } from '@angular/router';
declare var $: any;
declare var toastr: any;
@Component({
  selector: 'app-party-payment',
  templateUrl: './party-payment.component.html',
  styleUrls: ['./party-payment.component.css']
})
export class PartyPaymentComponent {
  dataLoading: boolean = false;
  CityList: any = [];
  PartyPaymentList: any = [];
  PartyPayment: any = {};
  PartyPaymentDetail: any = {};

  isSubmitted = false;
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  StateList: any[] = [];
  filterState: any[] = [];
  StatusList = this.loadData.GetEnumList(Status);
  PaymentModeList=this.loadData.GetEnumList(PaymentMode)
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  AllPaymentModeList =PaymentMode;
  AllStatusList = Status;
  PartyList: any = [];
 PartyPaymentListAll: any;
  filterPartyName: any;
  PaymentDate: any = {};


  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  onTableDataChange(p: any) {
    this.p = p;
  }
  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private loadData: LoadDataService,
    private localService: LocalService,
    private router: Router
  ) { }


  ngOnInit(): void {
    console.log(this.staffLogin);
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    
    this.resetForm();
    this.getPartyList();
    this.getPartyPaymentList();  
  }


  validiateMenu() {
    var request: RequestModel = {
      request: this.localService
        .encrypt(
          JSON.stringify({
            Url: this.router.url,
            StaffLoginId: this.staffLogin.StaffLoginId,
          })
        )
        .toString(),
    };
    this.dataLoading = true;
    this.service.validiateMenu(request).subscribe(
      (response: any) => {
        this.action = this.loadData.validiateMenu(
          response,
          this.toastr,
          this.router
        );
        this.dataLoading = false;
      },
      (err) => {
        this.toastr.error('Error while fetching records');
        this.dataLoading = false;
      }
    );
  }

  @ViewChild('formPartyPayment') formPartyPayment: NgForm;

  resetForm() {
    this.PartyPayment = {};
    if (this.formPartyPayment) {
      this.formPartyPayment.control.markAsPristine();
      this.formPartyPayment.control.markAsUntouched();
    }
    this.isSubmitted = false;
    this.PartyPayment.Status = 1;
  }


  filterPartyPaymentList(value: any) {
    if (value) {
      const filterValue = value.toLowerCase();
      this.filterPartyName = this.PartyList.filter((option: any) =>
        option.PartyName.toLowerCase().includes(filterValue)
      );
    } else {
      this.filterPartyName = this.PartyList;
    }
  }

  afterPartyPaymentSelected(event: any) {
    this.PartyPayment.PartyId = event.option.id;
  }
  getStatusList() {

    var obj = {}
    this.dataLoading = true
    this.service.getStatusList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.StatusList = response.StatusList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  getPaymentModeList(){
     var obj = {}
    this.dataLoading = true
    this.service.getPaymentModeList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.PaymentModeList = response.PaymentModeList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  getPartyList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString(),
    };
    this.dataLoading = true;
    this.service.getPartyList(obj).subscribe(
      (r1) => {
        let response = r1 as any;
        if (response.Message == ConstantData.SuccessMessage) {
          this.PartyList = response.PartyList;
          console.log(this.PartyList);

        } else {
          this.toastr.error(response.Message);
        }
        this.dataLoading = false;
      },
      (err) => {
        this.toastr.error('Error while fetching records');
        this.dataLoading = false;
      }
    );
  }

  getPartyPaymentList(){

    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    }
    this.dataLoading = true;
    this.service.getPartyPaymentList(obj).subscribe(
      (r1) => {
        let response = r1 as any;
        if (response.Message == ConstantData.SuccessMessage) {
          this.PartyPaymentList = response.PartyPaymentList;
          console.log(this.PartyPaymentList,"kshflkdshflkdshflk");

        } else {
          this.toastr.error(response.Message);
        }
        this.dataLoading = false;
      },
      (err) => {
        this.toastr.error('Error while fetching records');
        this.dataLoading = false;
      }
    );
  }


  savePartyPayment() {
    this.isSubmitted = true
    this.formPartyPayment.control.markAllAsTouched();
    if (this.formPartyPayment.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return;
    }
    this.dataLoading = true;
    // this.PartyPaymentList.
    this.PartyPayment.UpdatedBy = this.staffLogin.StaffLoginId;
    this.PartyPayment.CreatedBy = this.staffLogin.StaffLoginId;
    this.PartyPayment.PaymentDate = this.loadData.loadDateTime(this.PartyPayment.PaymentDate);
    this.PaymentDate = Date.now;
    this.PartyPaymentDetail.Credit
    var data = {
      GetPartyPayment: this.PartyPayment,
      GetPartyPaymentDetail: this.PartyPayment
    }
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(data)).toString()
    }
    this.service.SavePartyPayment(obj).subscribe(rl => {
      let response = rl as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.PartyPayment.PartyPaymentId > 0) {
          this.toastr.success(" Credit Updated successfully")
          document.getElementById("modalClose")?.click();
        }
        else {
          this.toastr.success(" Credit Add successfully")
        }
        this.resetForm();
        this.getPartyPaymentList();
      }
      else {
        this.toastr.error(response.Message)
        this.dataLoading = false;
      }
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }


  deletePartyPayment(obj: any) {

  }


  editPartyPayment(obj: any) {
    this.resetForm();
    this.PartyPayment = obj;
  }

  clearTransportSupplier() {
    this.PartyPaymentList = this.PartyPaymentListAll;
    this.PartyPaymentList.PartyPaymentId = null;
    this.PartyPaymentList.PackageName = '';
  }

}
