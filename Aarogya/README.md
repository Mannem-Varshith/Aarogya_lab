# M-Aarogya - Pathology Lab Management System

A comprehensive web application for managing pathology lab operations with role-based access for patients, doctors, and lab staff.

## Features

### 🔐 Authentication System
- **JWT-based authentication** with unique UUIDs for all users
- **Role-based access control** (Patient, Doctor, Lab)
- **Secure login and registration** with form validation
- **Mock API** for development and testing

### 👥 User Roles

#### Patient
- View personal lab reports and test results
- Download completed reports
- Book new tests
- Track health trends

#### Doctor
- Search and view patient information
- Access patient lab reports
- Review test results
- Analytics dashboard

#### Lab Staff
- Upload lab reports
- Manage test results
- View lab analytics
- Handle report processing

### 🎨 Modern UI/UX
- **Responsive design** with Tailwind CSS
- **Beautiful components** using Radix UI
- **Intuitive navigation** with role-based sidebars
- **Professional medical theme**

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Aarogya
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## Usage

### Demo Credentials

For testing purposes, use these credentials:

**Phone Number:** Any valid phone number  
**Password:** `password123`

### Navigation

1. **Home Page**: Click "Login" button to access authentication
2. **Login Page**: Select your role (Patient/Doctor/Lab) and enter credentials
3. **Registration**: Click "Sign up here" to create a new account
4. **Dashboard**: Role-specific dashboard with navigation sidebar

### Role-Specific Features

#### Patient Dashboard
- View recent lab reports
- Download completed reports
- Book new tests
- Track health statistics

#### Doctor Dashboard
- Search patients by name/phone
- View patient reports
- Access analytics
- Review test results

#### Lab Dashboard
- Upload new reports
- Manage pending tests
- View lab statistics
- Process test results

## File Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── LoginPage.jsx
│   │   └── RegistrationPage.jsx
│   ├── shared/
│   │   ├── Sidebar.jsx
│   │   └── Header.jsx
│   └── ui/ (Radix UI components)
├── pages/
│   ├── patient/
│   │   ├── PatientDashboard.jsx
│   │   └── ViewReports.jsx
│   ├── doctor/
│   │   ├── DoctorDashboard.jsx
│   │   └── SearchPatients.jsx
│   └── lab/
│       ├── LabDashboard.jsx
│       └── UploadReport.jsx
├── hooks/
│   └── useAuth.js
├── App.jsx
└── main.tsx
```

## Technology Stack

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Authentication**: JWT tokens
- **State Management**: React Context API

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Key Features Implemented

✅ **Complete Authentication System**
- JWT token management
- Role-based routing
- Secure login/logout

✅ **Responsive UI Components**
- Modern design system
- Mobile-friendly interface
- Professional medical theme

✅ **Role-Based Dashboards**
- Patient: Report viewing and management
- Doctor: Patient search and report access
- Lab: Report upload and management

✅ **Mock API System**
- Simulated backend responses
- Realistic data for testing
- Easy to replace with real API

## Future Enhancements

- [ ] Real backend API integration
- [ ] Database connectivity (MySQL)
- [ ] File upload functionality
- [ ] Real-time notifications
- [ ] Advanced analytics
- [ ] Mobile app support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact the development team.

---

**M-Aarogya** - Your trusted pathology lab management solution.