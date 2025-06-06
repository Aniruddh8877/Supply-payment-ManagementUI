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
  selector: 'app-party-ladger-history',
  templateUrl: './party-ladger-history.component.html',
  styleUrls: ['./party-ladger-history.component.css']
})
export class PartyLadgerHistoryComponent {

  ListParty: any = {};
  dataLoading: boolean = false
  CityList: any = []
  PartyPaymentDetailList: any = [];
  PartyPaymentDetail: any = {};
  isSubmitted = false
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  StateList: any[] = [];
  filterState: any[] = [];
  StatusList = this.loadData.GetEnumList(Status);
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  AllStatusList = Status;
  PartyList: any = [];
  PaymentModeList = this.loadData.GetEnumList(PaymentMode);
  AllPaymentModeList = PaymentMode;
  filterModel: any;
  AmountPaymentStatusList: any;
  PartyDetalis: any = {};
  CreditDebitAmt: any={};

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
    this.getPartyList(this.PartyDetalis.PartyId);
    // console.log(this.staffLogin);
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    // this.GetPartyPaymentDetailList();
    this.resetForm();
    this.getPartyList(this.PartyDetalis.PartyId);
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


  @ViewChild('formPartyLadgeHistroy') formPartyLadgeHistroy: NgForm;

  resetForm() {
    this.PartyPaymentDetail = {};
    if (this.formPartyLadgeHistroy) {
      this.formPartyLadgeHistroy.control.markAsPristine();
      this.formPartyLadgeHistroy.control.markAsUntouched();
    }
    this.isSubmitted = false
    this.PartyPaymentDetail.Status = 1
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
    this.PartyPaymentDetail.PaymentDetailId = event.option.id;
  }



  GetPartyPaymentDetailList(PartyId:any) {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({PartyId})).toString()
    }
    this.dataLoading = true
    this.service.GetPartyPaymentDetailList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.PartyPaymentDetailList = response.PartyPaymentDetailList;
        this.CreditDebitAmt.Debit = response.DebitAmount;
        this.CreditDebitAmt.Credit = response.CreditAmount;
        this.CreditDebitAmt.Due = this.CreditDebitAmt.Debit - this.CreditDebitAmt.Credit ;
        

        
        this.filterState = this.StateList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }


  getPartyList(PartyId: any) {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ PartyId })).toString(),
    };
    this.dataLoading = true;

    this.service.getPartyList(obj).subscribe(
      (r1) => {
        let response = r1 as any;
        if (response.Message == ConstantData.SuccessMessage) {
          this.PartyList = response.PartyList;
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
  filterpatientList(value: string) {
    const filterValue = value?.toLowerCase() || '';

    this.ListParty = this.PartyList.filter(
      (option: any) =>
        option.PartyName?.toLowerCase().includes(filterValue) ||
        option.PartyCode?.toLowerCase().includes(filterValue) ||
        option.MobileNo?.toLowerCase().includes(filterValue)
    );
  }


  afterPartySelected(event: any) {
    const selectedName = event.option.value;
    const selected = this.PartyList.find(
      (x: any) => x.PartyName === selectedName
    );
    this.PartyDetalis = { ...selected };
  }
  clearParty() {
    this.ListParty = this.PartyList;
    // this.Patient.PackageCollectionId = null;
    this.PartyDetalis.PartyName = '';
  }


 

// getPaymentList() {
//   if (this.filterModel.StartFrom) {
//     this.filterModel.StartFrom = this.loadData.loadDateYMD(this.filterModel.StartFrom);
//   }
//   if (this.filterModel.EndFrom) {
//     this.filterModel.EndFrom = this.loadData.loadDateYMD(this.filterModel.EndFrom);
//   }

//   const requestPayload = JSON.stringify(this.filterModel);
//   const data = {
//     requestPayload,
//     Page: this.p,
//     PageSize: this.itemPerPage
//   };

//   const obj: RequestModel = {
//     request: this.localService.encrypt(JSON.stringify(data)).toString(),
//   };
// }




}
