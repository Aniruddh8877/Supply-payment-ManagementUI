import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { PageNotFoundComponent } from './component/page-not-found/page-not-found.component';
import { AdminMasterComponent } from './admin/admin-master/admin-master.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { DesignationComponent } from './admin/designation/designation.component';
import { DepartmentComponent } from './admin/department/department.component';
import { StaffComponent } from './admin/staff/staff.component';
import { StaffLoginComponent } from './admin/staff-login/staff-login.component';
import { PageGroupComponent } from './admin/page-group/page-group.component';
import { PageComponent } from './admin/page/page.component';
import { MenuComponent } from './admin/menu/menu.component';
import { RoleComponent } from './admin/role/role.component';
import { RoleMenuComponent } from './admin/role-menu/role-menu.component';
import { StateComponent } from './admin/state/state.component';
import { CityComponent } from './admin/city/city.component';
import { ChangePasswordComponent } from './admin/change-password/change-password.component';
import { CompanyComponent } from './admin/company/company.component';
import { PartyDetailComponent } from './admin/party-detail/party-detail.component';
import { LocationComponent } from './admin/location/location.component';
import { CreditsDetailsComponent } from './admin/credits-details/credits-details.component';
import { OpeningBalanceComponent } from './admin/opening-balance/opening-balance.component';
import { PartySupplyItemComponent } from './admin/party-supply-item/party-supply-item.component';
import { PartyPaymentComponent } from './admin/party-payment/party-payment.component';
import { PartyLadgerHistoryComponent } from './admin/party-ladger-history/party-ladger-history.component';
import { PartyDueHistoryComponent } from './admin/party-due-history/party-due-history.component';
import { ProductCategoryComponent } from './admin/product-category/product-category.component';
import { ProductSizeComponent } from './admin/product-size/product-size.component';
import { ProductComponent } from './admin/product/product.component';

const routes: Routes = [
  { path: '', redirectTo: '/admin-login', pathMatch: 'full' },
  { path: 'admin-login', component: AdminLoginComponent },
  {
    path: 'admin',
    component: AdminMasterComponent,
    children: [
      { path: 'admin-dashboard', component: AdminDashboardComponent },
      { path: 'designation', component: DesignationComponent },
      { path: 'department', component: DepartmentComponent },
      { path: 'staff', component: StaffComponent },
      { path: 'staffLogin', component: StaffLoginComponent },
      { path: 'page-group', component: PageGroupComponent },
      { path: 'page', component: PageComponent },
      { path: 'menu', component: MenuComponent },
      { path: 'role', component: RoleComponent },
      { path: 'role-menu', component: RoleMenuComponent },
      { path: 'role-menu/:id', component: RoleMenuComponent },
      { path: 'state', component: StateComponent },
      { path: 'city', component: CityComponent },
      { path: 'change-password', component: ChangePasswordComponent },
      { path: 'company', component: CompanyComponent },
      { path: 'Party', component: PartyDetailComponent },
      { path: 'Location', component: LocationComponent },
      { path: 'credits', component: CreditsDetailsComponent },
      { path: 'opening-balance', component: OpeningBalanceComponent },
      { path: 'PartySupplyItem', component: PartySupplyItemComponent },
      { path: 'PartyPayment', component: PartyPaymentComponent },
      { path: 'PartyLadgerHistory', component: PartyLadgerHistoryComponent },
      { path: 'PartyDueHistory', component: PartyDueHistoryComponent },
      { path: 'ProductCategory', component: ProductCategoryComponent },
      { path: 'ProductSize', component: ProductSizeComponent },
      {path: 'Product',component:ProductComponent}
    ],
  },
  { path: 'page-not-found', component: PageNotFoundComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
