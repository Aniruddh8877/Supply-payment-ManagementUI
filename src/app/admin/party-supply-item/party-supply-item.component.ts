import { Component } from '@angular/core';
import { ConstantData } from 'src/app/utils/constant-data';
import { } from 'src/app/utils/load-data.service';
import { ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../utils/app.service';
import { Status } from '../../utils/enum';
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
  selector: 'app-party-supply-item',
  templateUrl: './party-supply-item.component.html',
  styleUrls: ['./party-supply-item.component.css'],
})
export class PartySupplyItemComponent {
  dataLoading: boolean = false;
  CityList: any = [];
  PartySupplyItemList: any = [];
  PartySupplyItem: any = {};
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
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  AllStatusList = Status;
  PartyList: any = [];
  PartySupplyItemListAll: any;
  filterPartyName: any;
  PaymentDate: any = {};
  ProductCategoryList: any = [];
  filteredPackageList: any = [];
  Product: any = [];
  ProductList: any = [];
  filteredProductList: any = [];
  ProductItem: any;
  ProductsizeList: any = [];
  ProductSizeItem: any = [];
  filteredProductSizeList: any = [];
  SelectProductItemList: any=[];
  // data:any={};

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
    this.getPartySupplyItemList();
    this.getProductCategoryList();

    this.getPartyList();
    //this.getStatusList();
    // this.getStateList();
    this.resetForm();
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

  @ViewChild('formPartySupplyItem') formPartySupplyItem: NgForm;

  resetForm() {
    this.PartySupplyItem = {};
    if (this.formPartySupplyItem) {
      this.formPartySupplyItem.control.markAsPristine();
      this.formPartySupplyItem.control.markAsUntouched();
    }
    this.isSubmitted = false;
    this.PartySupplyItem.Status = 1;
  }



  filterPartySupplyItemList(value: any) {
    if (value) {
      const filterValue = value.toLowerCase();
      this.filterPartyName = this.PartyList.filter((option: any) =>
        option.PartyName.toLowerCase().includes(filterValue)
      );
    } else {
      this.filterPartyName = this.PartyList;
    }
  }

  afterPartySupplyItemSelected(event: any) {
    this.PartySupplyItem.PartyId = event.option.id;
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

  getProductCategoryList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString(),
    };
    this.dataLoading = true;
    this.service.getProductCategoryList(obj).subscribe(
      (r1) => {
        let response = r1 as any;
        if (response.Message == ConstantData.SuccessMessage) {
          this.ProductCategoryList = response.ProductCategoryList;
          this.filterState = this.StateList;
          console.log(this.ProductCategoryList);

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



  getPartySupplyItemList() {

    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    }
    this.dataLoading = true;
    this.service.getPartySupplyItemList(obj).subscribe(
      (r1) => {
        let response = r1 as any;
        if (response.Message == ConstantData.SuccessMessage) {
          this.PartySupplyItemList = response.PartySupplyItemList;
          // console.log(this.PartySupplyItemList);

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



  savePartySupplyItem() {
    this.isSubmitted = true
    this.formPartySupplyItem.control.markAllAsTouched();
    if (this.formPartySupplyItem.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return;
    }
    this.dataLoading = true;
    // this.PartySupplyItemList.
    this.PartySupplyItem.UpdatedBy = this.staffLogin.StaffLoginId;
    this.PartySupplyItem.CreatedBy = this.staffLogin.StaffLoginId;
    this.PartySupplyItem.SupplyDate = this.loadData.loadDateTime(this.PartySupplyItem.SupplyDate);
    this.PaymentDate = Date.now;
    var data = {
      GetPartySupplyItem: this.PartySupplyItem,
      GetPartyPaymentDetail: this.PartySupplyItem,
      GetSupplyItemDetails : this.SelectProductItemList,
    }
    console.log(data);
    
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(data)).toString()
    }
    this.service.SavePartySupplyItem(obj).subscribe(rl => {
      let response = rl as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.PartySupplyItem.PartySupplyItemId > 0) {
          this.toastr.success("Debit Updated successfully")
          document.getElementById("modalClose")?.click();
        }
        else {
          this.toastr.success("Debit Add successfully")
        }
        this.resetForm();
        this.getPartySupplyItemList();
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


  deletePartySupplyItem(obj: any) { }


  editPartySupplyItem(obj: any) {
    this.resetForm();
    this.PartySupplyItem = obj;
  }

  clearTransportSupplier() {
    this.PartySupplyItemList = this.PartySupplyItemListAll;
    this.PartySupplyItemList.PartySupplyItemId = null;
    this.PartySupplyItemList.PackageName = '';
  }

  filterpackageList(value: string) {
    const filterValue = value?.toLowerCase() || '';
    this.filteredPackageList = this.ProductCategoryList.filter(
      (option: any) =>
        option.ProductCategoryName?.toLowerCase().includes(filterValue)
    );
  }

  afterPackageSelected(event: any) {
    const selectedName = event.option.value;
    const selected = this.ProductCategoryList.find(
      (x: any) => x.ProductCategoryName === selectedName
    );

    if (selected) {
      this.Product = {
        ...this.Product,
        ...selected
      };
    }
    console.log(this.Product.ProductCategoryId);

    this.getProductList(this.Product.ProductCategoryId)
    this.getProductSizeList(this.Product.ProductCategoryId)

  }
 resetCategoryForm(){
  this.Product ={
    ProductCategoryName : "",
    ProductSizeName : "",
    ProductItemName : "",
    Quantity : "",

  }
 }

  PackageClear() {
    this.resetCategoryForm();
    this.filteredPackageList = [...this.ProductCategoryList];
  }




  getProductList(data: any) {

    var ProductCategoryId = data;

    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ ProductCategoryId })).toString(),
    };
    this.dataLoading = true;
    this.service.getProductListByCategory(obj).subscribe(
      (r1) => {
        let response = r1 as any;
        if (response.Message == ConstantData.SuccessMessage) {
          this.ProductList = response.ProductList;
          this.filterState = this.StateList;
          console.log(this.ProductsizeList);
          

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

  filterProductList(value: string) {
    const filterValue = value?.toLowerCase() || '';
    this.filteredProductList = this.ProductList.filter(
      (option: any) =>
        option.ProductName?.toLowerCase().includes(filterValue)
    );
  }

  afterProductSelected(event: any) {
    const selectedName = event.option.value;
    const selected = this.ProductList.find(
      (x: any) => x.ProductName === selectedName
    );

    if (selected) {
      this.ProductItem = {
        ...this.ProductItem,
        ...selected
      };
    }

    this.Product.ProductId = selected.ProductId;
  }

  ProductClear() {
    // this.resetPackageForm();
    // this.filteredPackageList = [...this.ProductCategoryList];
  }



  getProductSizeList(data: any) {

    var ProductCategoryId = data;
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ ProductCategoryId })).toString(),
    };
    this.dataLoading = true;
    this.service.getProductSizeByCategoryList(obj).subscribe(
      (r1) => {
        let response = r1 as any;
        if (response.Message == ConstantData.SuccessMessage) {
          this.ProductsizeList = response.ProductSizeByCategoryList;
          this.filterState = this.StateList;
          console.log(this.ProductsizeList);

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

  filterProductSizeList(value: string) {
    const filterValue = value?.toLowerCase() || '';
    this.filteredProductSizeList = this.ProductsizeList.filter(
      (option: any) =>
        option.ProductSizeName?.toLowerCase().includes(filterValue)
    );
  }

  afterProductSizeSelected(event: any) {
    const selectedName = event.option.value;
    const selected = this.ProductsizeList.find(
      (x: any) => x.ProductSizeName === selectedName
    );

    if (selected) {
      this.ProductSizeItem = {
        ...this.ProductSizeItem,
        ...selected
      };
      
    }
    this.Product.ProductSizeId = selected.ProductSizeId;

  }

  ProductSizeClear() {
    // this.resetPackageForm();
    // this.filteredPackageList = [...this.ProductCategoryList];
  }




 addProductItem() {
      this.SelectProductItemList.push(this.Product);
    }

  RemoveProduct(index: number) {
    if (confirm('Are you sure you want to remove this package?')) {
      this.SelectProductItemList.splice(index, 1);
      
    }
  }
}
