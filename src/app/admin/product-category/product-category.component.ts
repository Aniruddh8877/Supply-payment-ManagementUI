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
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css']
})
export class ProductCategoryComponent {
  sortKey: string = '';
  reverse: boolean = false;
  p: number = 1;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  dataLoading: boolean = false;
  action: ActionModel = {} as ActionModel;
  ProductCategory: any = {};
isSubmitted = false;
  StateList: any[] = [];
  filterState: any[] = [];
  StatusList = this.loadData.GetEnumList(Status);
 AllStatusList = Status;
ProductCategoryList:any=[];
  PageSize = ConstantData.PageSizes;
  Search: string = '';
  itemPerPage: number = this.PageSize[0];
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

  @ViewChild('formProductCategroy') formProductCategroy: NgForm;
  resetForm() {
    this.ProductCategory = {};
    if (this.formProductCategroy) {
      this.formProductCategroy.resetForm();
    }
    this.isSubmitted = false;
    this.ProductCategory.Status = 1;
  }
 filterProductCategoryList(value: any) {
    if (value) {
      const filterValue = value.toLowerCase();
      this.filterState = this.StateList.filter((option: any) =>
        option.StateName.toLowerCase().includes(filterValue)
      );
    } else {
      this.filterState = this.StateList;
    }
  }

  afterProductCategorySelected(event: any) {
    this.ProductCategory.ProductCategoryId = event.option.id;
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

  SaveProductCategory() {
    this.formProductCategroy.control.markAllAsTouched();
    if (this.formProductCategroy.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
    this.dataLoading = true;
   // this.Party.CreatedOn = new Date();
  //  console.log(this.ProductCategory);
   
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.ProductCategory)).toString()
    }
    this.service.SaveProductCategory(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.ProductCategory.ProductCategoryId > 0) {
          this.toastr.success("Party Updated successfully")
          document.getElementById("modalClose")?.click();
        } else {
          this.toastr.success("Party Add successfully")
        }
        console.log(this.ProductCategory);
        
        this.resetForm()
        this.getProductCategoryList()
      } else {
        this.toastr.error(response.Message)
        this.dataLoading = false;
      }
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }

DeleteProductCategory(obj: any) {
    console.log(obj);
    
    if (confirm('Are your sure you want to delete this recored')) {
      var request: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(obj)).toString(),
      };
      this.dataLoading = true;
      this.service.DeleteProductCategory(request).subscribe((r1) => {
          let response = r1 as any;
          if (response.Message == ConstantData.SuccessMessage) {
            this.toastr.success('Record Deleted successfully');
            this.getProductCategoryList();
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



  editProductCategory(obj: any) {
    this.resetForm();
    this.ProductCategory = obj;
  }











}
