import React, { useState } from 'react';
import { Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth.jsx';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ServicesSection } from './components/ServicesSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { AboutSection } from './components/AboutSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { Footer } from './components/Footer';
import LoginModal from './components/auth/LoginModal';
import RegistrationModal from './components/auth/RegistrationModal';
import { PatientDashboard } from './pages/patient/PatientDashboard';
import { DoctorDashboard } from './pages/doctor/DoctorDashboard';
import { LabDashboard } from './pages/lab/LabDashboard';
import { ViewReports } from './pages/patient/ViewReports';
import { SearchPatients } from './pages/doctor/SearchPatients';
import { UploadReport } from './pages/lab/UploadReport';
import { Sidebar } from './components/shared/Sidebar';
import { Header as DashboardHeader } from './components/shared/Header';

// Types
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<'patient' | 'doctor' | 'lab'>;
}

// Protected Route Component
const ProtectedRoute: React.FC<ProtectedRouteProps & { onOpenLogin?: () => void }> = ({ children, allowedRoles = [], onOpenLogin }) => {
  const { user, isAuthenticated, loading } = useAuth();
  
  console.log('ProtectedRoute check:', { isAuthenticated, user, allowedRoles, loading });
  
  // Wait for authentication check to complete
  if (loading) {
    console.log('Authentication still loading...');
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    console.log('User not authenticated, opening login modal');
    if (onOpenLogin) {
      onOpenLogin();
    }
    return <Navigate to="/?login=true" replace />;
  }
  
  if (allowedRoles.length > 0 && user?.role && !allowedRoles.includes(user.role)) {
    console.log('User role not allowed, redirecting to home');
    return <Navigate to="/" replace />;
  }
  
  console.log('Access granted to protected route');
  return <>{children}</>;
};

// Layout components
const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showSidebar, setShowSidebar] = React.useState(false);
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar currentPage="dashboard" onPageChange={() => {}} />
      <div className="flex-1 flex flex-col">
        <DashboardHeader onMenuToggle={() => setShowSidebar(!showSidebar)} showMenuButton={true} />
        {children}
      </div>
    </div>
  );
};

// Home Page Component
const HomePage: React.FC<{ onOpenLogin: () => void; onOpenRegister: () => void }> = ({ onOpenLogin, onOpenRegister }) => {
  const [searchParams] = useSearchParams();
  
  // Open modal if login/register query param is present
  React.useEffect(() => {
    if (searchParams.get('login') === 'true') {
      onOpenLogin();
    } else if (searchParams.get('register') === 'true') {
      onOpenRegister();
    }
  }, [searchParams, onOpenLogin, onOpenRegister]);
  
  return (
    <div className="min-h-screen bg-background">
      <Header onLoginClick={onOpenLogin} onRegisterClick={onOpenRegister} />
      <main className="pt-0">
        <HeroSection />
        <ServicesSection />
        <HowItWorksSection />
        <AboutSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
};

// Main Routes Component
const AppRoutes: React.FC<{ onOpenLogin: () => void; onOpenRegister: () => void }> = ({ onOpenLogin, onOpenRegister }) => {
  return (
    <Routes>
      <Route path="/" element={<HomePage onOpenLogin={onOpenLogin} onOpenRegister={onOpenRegister} />} />
      <Route path="/login" element={<Navigate to="/?login=true" replace />} />
      <Route path="/register" element={<Navigate to="/?register=true" replace />} />
      <Route path="/admin/*" element={<Navigate to="/admin/login" replace />} />
      
      {/* Patient Routes */}
      <Route
        path="/patient-dashboard"
        element={
          <ProtectedRoute allowedRoles={['patient']} onOpenLogin={onOpenLogin}>
            <DashboardLayout>
              <PatientDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient-reports"
        element={
          <ProtectedRoute allowedRoles={['patient']} onOpenLogin={onOpenLogin}>
            <DashboardLayout>
              <ViewReports />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      
      {/* Doctor Routes */}
      <Route
        path="/doctor-dashboard"
        element={
          <ProtectedRoute allowedRoles={['doctor']} onOpenLogin={onOpenLogin}>
            <DashboardLayout>
              <DoctorDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor-search"
        element={
          <ProtectedRoute allowedRoles={['doctor']} onOpenLogin={onOpenLogin}>
            <DashboardLayout>
              <SearchPatients />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      
      {/* Lab Routes */}
      <Route
        path="/lab-dashboard"
        element={
          <ProtectedRoute allowedRoles={['lab']} onOpenLogin={onOpenLogin}>
            <DashboardLayout>
              <LabDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/lab-upload"
        element={
          <ProtectedRoute allowedRoles={['lab']} onOpenLogin={onOpenLogin}>
            <DashboardLayout>
              <UploadReport />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

// App Component
const App: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const handleOpenLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleCloseLogin = () => {
    setIsLoginModalOpen(false);
  };

  const handleOpenRegister = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const handleCloseRegister = () => {
    setIsRegisterModalOpen(false);
  };

  return (
    <AuthProvider>
      <>
        <AppRoutes onOpenLogin={handleOpenLogin} onOpenRegister={handleOpenRegister} />
        <LoginModal 
          open={isLoginModalOpen} 
          onClose={handleCloseLogin}
          onOpenRegister={handleOpenRegister}
          brandName="Aarogya 24/7"
        />
        <RegistrationModal 
          open={isRegisterModalOpen} 
          onClose={handleCloseRegister}
          onOpenLogin={handleOpenLogin}
          brandName="Aarogya 24/7"
        />
      </>
    </AuthProvider>
  );
};

export default App;
