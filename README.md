# UPSA Student Result and Complaint Management System

A production-ready React application built with Vite, Tailwind CSS, and Firebase.

## 🚀 Getting Started

### 1. Prerequisites
- Node.js installed
- A Firebase project set up

### 2. Installation
```bash
npm install
```

### 3. Setup Firebase
The application is pre-configured with the provided Firebase credentials in `src/services/firebase.js`.
Ensure you have enabled:
- **Email/Password Authentication** in Firebase Auth.
- **Cloud Firestore** with the following collections:
  - `users`: Store user profiles with a `role` field (`student`, `staff`, or `admin`).
  - `results`: Store student result records.
  - `complaints`: Store student complaints.

### 4. Run the App
```bash
npm run dev
```

## 📁 Project Structure
- `src/components`: Reusable UI components (Table, Modal, Card, etc.)
- `src/pages`: Role-based pages for Students, Staff, and Admins.
- `src/services`: Firebase interaction logic.
- `src/context`: Authentication state management.
- `src/routes`: Role-based routing logic.

## 🛠 Features
- **Role-based Access**: Restricted routes for students, staff, and admins.
- **Result Management**: Staff can add/edit/delete results; students can view them.
- **Complaint System**: Students can submit and track complaints; staff can respond.
- **Admin Dashboard**: Analytics and system activity monitoring.
- **Modern UI**: Clean, responsive design using Tailwind CSS.
