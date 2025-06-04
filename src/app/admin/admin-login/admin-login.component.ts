import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../utils/app.service';
import { ConstantData } from '../../utils/constant-data';
import { LocalService } from '../../utils/local.service';
import { Status } from '../../utils/enum';
import { RequestModel } from 'src/app/utils/interface';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  dataLoading: boolean;
  submitted: boolean;
  Staff: any = {};
  imageUrl=this.service.getImageUrl();
  constructor(
    private toastr: ToastrService,
    private service: AppService,
    private localService: LocalService,
    private router: Router) { }

  ngOnInit(): void {
    this.getCompanyList();
  }

  
  Company: any = {};
  getCompanyList() {
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Status: Status.Active })).toString()
    }
    this.dataLoading = true
    this.service.getCompanyList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.Company = response.CompanyList[0];
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
    }))
  }

  resetForm(form?: NgForm) {
    if (form != null)
      form.reset();
    this.Staff = {};
    this.submitted = false;
  }

  staffLogin(form: NgForm) {
    this.submitted = true;
    if (form.invalid) {
      this.toastr.error("Fill all the Required Fields.", "Invailid Form")
      this.dataLoading = false;
      return;
    }

    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.Staff)).toString()
    }

    this.dataLoading = true;
    this.service.StaffLogin(request).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.toastr.success("Login Successful.")
        this.submitted = false;
        this.localService.setEmployeeDetail(response.UserDetail)
        this.router.navigate(['/admin/admin-dashboard']);
      } else {
        this.toastr.error(response.Message);
        this.dataLoading = false;
      }
    }, (err => {
      this.toastr.error("Error Occured while fetching data.");
      this.dataLoading = false;
    }));
  }
}
