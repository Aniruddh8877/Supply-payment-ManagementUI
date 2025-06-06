# Angular Company Payment & Supply Management System

## 🧾 Project Overview

This is a comprehensive **Company Payment and Supply Management System** built using **Angular**. It facilitates real-time management of company financials, item supply tracking, party opening balances, ledger details, staff/admin modules, and location-wise data segregation.

This project is ideal for businesses needing a streamlined system to manage company transactions, supplies, and stakeholder records with clear segregation of roles and operations.

---

## 🚀 Tech Stack

- **Frontend:** Angular 15+
- **UI Frameworks:** Bootstrap 5, Angular Material, Tailwind CSS
- **Backend:** ASP.NET Web API (integrated via HTTP services)
- **Database:** Microsoft SQL Server
- **Authentication:** Role-based access (Admin/Staff)
- **Utilities:**  ngx-toastr, Reactive Forms, ngx-pagination

---

## 📦 Features

### 🔐 User Management
- Admin & Staff roles with secure login
- Role-based access control
- Staff creation and management

### 🧾 Party Master
- Add/update party records
- Maintain party type and contact details
- Set and update party opening balances

### 📘 Ledger Management
- Real-time Party Ledger updates
- Debit/Credit transaction tracking
- Downloadable & printable ledger views
- Filter by date and transaction type

### 📦 Supply Item Module
- Add/update items
- Track supply transactions (inward/outward)
- View inventory levels

### 💵 Payment Module
- Record payments by party
- View past payment history
- Support for various payment modes
- Payment date, amount, and remarks logging

### 📍 Location Master
- Add/edit location data (City, State, Country)
- Assign locations to parties and staff

### 📆 Date-wise Reporting
- Custom date range filtering
- Generate summary views
- Export data if needed (CSV, PDF – future scope)

### 📊 Dashboard (Optional)
- KPIs and visual charts (supply flow, total dues, etc.)
- Quick actions & status overview

---

## 🛠 Setup Instructions

### Prerequisites
- Node.js (v16+)
- Angular CLI (`npm install -g @angular/cli`)
- .NET Framework/Core backend running (if API required)
- SQL Server

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/Aniruddh8877/Supply-payment-ManagementUI.git
   cd company-management-system
