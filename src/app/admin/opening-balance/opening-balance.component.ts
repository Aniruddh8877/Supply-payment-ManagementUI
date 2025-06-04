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
  selector: 'app-opening-balance',
  templateUrl: './opening-balance.component.html',
  styleUrls: ['./opening-balance.component.css']
})
export class OpeningBalanceComponent {
  dataLoading: boolean = false
  isSubmitted = false
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = true;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  StatusList = this.loadData.GetEnumList(Status);
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  AllStatusList = Status;
  BalanceList: any = []
  Balance: any = {}
  PartyList: any;
  PartyListall: any;

  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private loadData: LoadDataService,
    private localService: LocalService,
    private router: Router
  ) { }

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  onTableDataChange(p: any) {
    this.p = p
  }


  ngOnInit(): void {

    console.log(this.staffLogin);
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getBalanceList();
    this.getPartyList();
    // this.getStatusList();
    // this.getStateList();
    this.resetForm();
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

  @ViewChild('formBalance') formBalance: NgForm;
  resetForm() {
    this.BalanceList = {
      BalanceAccountId: 0,
      BalanceName: '',
      Debit: 0,
      Credit: 0,
      OpeningDate: null,
      Status: 1
      // include other required fields with default values
    };
  }

  filterBalanceList(value: any) {
    if (value) {
      const filterValue = value.toLowerCase();
      this.filterBalanceList = this.BalanceList.filter((option: any) => option.StateName.toLowerCase().includes(filterValue));
    } else {
      this.filterBalanceList = this.BalanceList;
    }
  }

  afterBalanceSelected(event: any) {
    this.BalanceList.LocationId = event.option.id;
  }


  getBalanceList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    }
    this.dataLoading = true
    this.service.getBalanceList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.BalanceList = response.BalanceList;
        this.filterBalanceList = this.BalanceList;
        console.log("this is booking list for location", this.BalanceList);
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  saveBalance() {
    this.formBalance.control.markAllAsTouched();
    if (this.formBalance.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
    this.dataLoading = true;
    this.BalanceList.OpeningDate = this.loadData.loadDateTime(this.BalanceList.OpeningDate);
    this.BalanceList.CreatedBy = this.staffLogin.StaffId;
    var data = {
      GetBalanceAccount: this.BalanceList,
      GetPartyPaymentDetail: this.BalanceList
    }
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(data)).toString()
    }
    console.log(data);

    this.service.SaveBalance(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.Balance.BalanceAccountId > 0) {
          this.toastr.success("Balance Updated successfully")
          document.getElementById("modalClose")?.click();
        } else {
          this.toastr.success("Balance Add successfully")
        }
        this.resetForm();
        this.getBalanceList();
      } else {
        this.toastr.error(response.Message)
        this.dataLoading = false;
      }
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }



  deleteBalance(obj: any) {

    if (confirm("Are your sure you want to delete this recored")) {
      var request: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(obj)).toString()
      }
      this.dataLoading = true;
      this.service.DeleteBalance(request).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getBalanceList()
        } else {
          this.toastr.error(response.Message)
          this.dataLoading = false;
        }
      }, (err => {
        this.toastr.error("Error occured while deleteing the recored")
        this.dataLoading = false;
      }))
    }
  }

  getPartyList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    }
    this.dataLoading = true
    this.service.getPartyList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.PartyListall = response.PartyList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }



  editBalance(obj: any) {
    this.resetForm()
    this.BalanceList = obj
  }

  filterPartyList(value: string) {
    if (value) {
      const filterValue = value.toLowerCase();
      this.PartyList = this.PartyListall.filter((option: any) =>
        option.PartyName.toLowerCase().includes(filterValue)
      );
    } else {
      this.PartyList = this.PartyListall;
    }
  }

  afterPartyNameSelected(event: any) {
    const selectedParty = this.PartyList.find(
      (x: any) => x.PartyName === event.option.value
    );

    if (selectedParty) {
      this.BalanceList.PartyId = selectedParty.PartyId;
      this.BalanceList.PartyName = selectedParty.PartyName;
    }
  }


  clearTransportSupplier() {
    this.PartyList = this.PartyListall;
    this.BalanceList.PackageCollectionId = null;
    this.BalanceList.PackageName = '';
  }
}
