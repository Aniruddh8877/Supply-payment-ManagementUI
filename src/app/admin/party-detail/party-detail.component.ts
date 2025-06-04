import { Component, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../utils/app.service';
import { ConstantData } from '../../utils/constant-data';
import { NgForm } from '@angular/forms';
import { LocalService } from '../../utils/local.service';
import { LoadDataService } from '../../utils/load-data.service';
import { Status } from '../../utils/enum';
import { ActionModel, RequestModel, StaffLoginModel } from '../../utils/interface';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-party-detail',
  templateUrl: './party-detail.component.html',
  styleUrls: ['./party-detail.component.css'],
})
export class PartyDetailComponent {
  dataLoading: boolean = false;
  CityList: any = [];
  Party: any = {};
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
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  AllStatusList = Status;
  PartyList: any = [];

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
  ) {}

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getPartyList();
    // this.getStateList();
    this.getLocationList();
    this.resetForm();
  }

  validiateMenu() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Url: this.router.url,StaffLoginId:this.staffLogin.StaffLoginId })).toString()
    }
    this.dataLoading = true
    this.service.validiateMenu(obj).subscribe((response: any) => {
      this.action = this.loadData.validiateMenu(response, this.toastr, this.router)
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }


  
  @ViewChild('formParty') formParty: NgForm;
  resetForm() {
    this.Party = {};
    if (this.formParty) {
   this.formParty.resetForm();
    }
    this.isSubmitted = false;
    this.Party.Status = 1;
  }

  filterPartyList(value: any) {
    if (value) {
      const filterValue = value.toLowerCase();
      this.filterState = this.StateList.filter((option: any) =>
        option.StateName.toLowerCase().includes(filterValue)
      );
    } else {
      this.filterState = this.StateList;
    }
  }

  afterStateSelected(event: any) {
    this.Party.Partyid = event.option.id;
  }

  getStatusList() {
    var obj = {};
    this.dataLoading = true;
    this.service.getStatusList(obj).subscribe(
      (r1) => {
        let response = r1 as any;
        if (response.Message == ConstantData.SuccessMessage) {
          this.StatusList = response.StatusList;
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
          this.filterState = this.StateList;
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

 saveParty() {
    this.formParty.control.markAllAsTouched();
    if (this.formParty.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
    this.dataLoading = true;
    this.Party.CreatedBy = this.staffLogin.StaffId;
    this.Party.CreatedOn = new Date();
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.Party)).toString()
    }
    this.service.saveParty(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.Party.PartyId > 0) {
          this.toastr.success("Party Updated successfully")
          document.getElementById("modalClose")?.click();
        } else {
          this.toastr.success("Party Add successfully")
        }
        console.log(this.Party);
        
        this.resetForm()
        this.getPartyList()
      } else {
        this.toastr.error(response.Message)
        this.dataLoading = false;
      }
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }


  // saveParty() {
  //   this.formParty.control.markAllAsTouched();
  //   if (this.formParty.invalid) {
  //     this.toastr.error('Fill all the required fields !!');
  //     return;
  //   }
  //   this.Party.CreatedBy = this.staffLogin.StaffId;
  //   // this.Party.CreatedOn =
  //   this.dataLoading = true;
  //   console.log(this.Party);
  //   this.getPartyList();
  //   var obj: RequestModel = {
  //     request: this.localService.encrypt(JSON.stringify(this.Party)).toString(),
  //   };
  //   this.service.saveParty(obj).subscribe(
  //     (r1) => {
  //       let response = r1 as any;
  //       if (response.Message == ConstantData.SuccessMessage) {
  //         console.log('enter through success message');

  //         if (this.Party.PartyId > 0) {
  //           console.log('enter through party.Partyid>0');
  //           this.toastr.success('Party Updated successfully');
  //           document.getElementById('modalClose')?.click();
  //         } else {
  //           this.toastr.success('Party Add successfully');
  //         }
  //         this.resetForm();

  //         this.getPartyList();
  //       } else {
  //         this.toastr.error('this is', response.Message);
  //         this.dataLoading = false;
  //       }
  //     },
  //     (err) => {
  //       this.toastr.error('Error occured while submitting data');
  //       this.dataLoading = false;
  //     }
  //   );
  // }

  deleteParty(obj: any) {
    if (confirm('Are your sure you want to delete this recored')) {
      var request: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(obj)).toString(),
      };
      this.dataLoading = true;
      this.service.deleteParty(request).subscribe(
        (r1) => {
          let response = r1 as any;
          if (response.Message == ConstantData.SuccessMessage) {
            this.toastr.success('Record Deleted successfully');
            this.getPartyList();
          } else {
            this.toastr.error(response.Message);
            this.dataLoading = false;
          }
        },
        (err) => {
          this.toastr.error('Error occured while deleteing the recored');
          this.dataLoading = false;
        }
      );
    }
  }

  editParty(obj: any) {
    this.resetForm();
    this.Party = obj;
  }

  LocationList: any = [];
  getLocationList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString(),
    };
    this.dataLoading = true;
    this.service.getLocationList(obj).subscribe(
      (r1) => {
        let response = r1 as any;
        if (response.Message == ConstantData.SuccessMessage) {
          this.LocationList = response.LocationList;
          console.log('this is location list from party', this.LocationList);
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
}
