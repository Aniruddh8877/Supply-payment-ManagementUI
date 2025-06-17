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
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {

  sortKey: string = '';
  reverse: boolean = false;
  p: number = 1;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  dataLoading: boolean = false;
  action: ActionModel = {} as ActionModel;
  Product: any = {};
  isSubmitted = false;
  StateList: any[] = [];
  filterState: any[] = [];
  StatusList = this.loadData.GetEnumList(Status);
  AllStatusList = Status;
  ProductList: any = [];
  PageSize = ConstantData.PageSizes;
  Search: string = '';
  itemPerPage: number = this.PageSize[0];
  ProductCategoryList:any=[];

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
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getProductList();
    this.getProductCategoryList();
    this.resetForm();
  }

  validiateMenu() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Url: this.router.url, StaffLoginId: this.staffLogin.StaffLoginId })).toString()
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
  @ViewChild('formProduct') formProduct: NgForm;
  resetForm() {
    // this.Product = {};
    // if (this.formProduct) {
    //   this.formProduct.resetForm();
    // }
    this.isSubmitted = false;
    this.Product.Status = "1";
  }
  reseteditForm() {
    this.Product = {};
    if (this.formProduct) {
      this.formProduct.resetForm();
    }
    this.isSubmitted = false;
    this.Product.Status = 1;
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

   filterProductList(value: any) {
    if (value) {
      const filterValue = value.toLowerCase();
      this.filterState = this.StateList.filter((option: any) =>
        option.StateName.toLowerCase().includes(filterValue)
      );
    } else {
      this.filterState = this.StateList;
    }
  }

  afterProductSelected(event: any) {
    this.Product.ProductId = event.option.id;
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

 getProductList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString(),
    };
    this.dataLoading = true;
    this.service.getProductList(obj).subscribe(
      (r1) => {
        let response = r1 as any;
        if (response.Message == ConstantData.SuccessMessage) {
          this.ProductList = response.ProductList;
          this.filterState = this.StateList;
          console.log(this.ProductList);

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

 SaveProduct() {
    this.formProduct.control.markAllAsTouched();
    if (this.formProduct.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
    this.dataLoading = true;
    // this.Party.CreatedOn = new Date();
    //  console.log(this.ProductCategory);

    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.Product)).toString()
    }
    console.log(this.Product);
    
    this.service.SaveProduct(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.Product.ProductId > 0) {
          this.toastr.success("Product Updated successfully")
          document.getElementById("modalClose")?.click();
        } else {
          this.toastr.success("Product Add successfully")
        }
        console.log(this.Product);

        this.resetForm()
        this.getProductList()
      } else {
        this.toastr.error(response.Message)
        this.dataLoading = false;
      }
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }

DeleteProduct(obj: any) {
    console.log(obj);

    if (confirm('Are your sure you want to delete this recored')) {
      var request: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(obj)).toString(),
      };
      this.dataLoading = true;
      this.service.DeleteProduct(request).subscribe((r1) => {
        let response = r1 as any;
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success('Record Deleted successfully');
          this.getProductList();
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



  editProduct(obj: any) {
    this.resetForm();
    this.Product = obj;
  }


































































































































}
