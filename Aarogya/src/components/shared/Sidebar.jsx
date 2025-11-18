import React from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { 
  Home, 
  FileText, 
  Search, 
  Upload, 
  Settings, 
  LogOut, 
  User,
  Stethoscope,
  Building2,
  Calendar,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.jsx';

export function Sidebar({ currentPage, onPageChange }) {
  const { user, logout } = useAuth();

  const getNavigationItems = () => {
    if (!user) return [];

    const commonItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
    ];

    switch (user.role) {
      case 'patient':
        return [
          ...commonItems,
          { id: 'reports', label: 'My Reports', icon: FileText },
          { id: 'book-test', label: 'Book Test', icon: Calendar },
        ];
      case 'doctor':
        return [
          ...commonItems,
          { id: 'search-patients', label: 'Search Patients', icon: Search },
          { id: 'reports', label: 'Patient Reports', icon: FileText },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        ];
      case 'lab':
        return [
          ...commonItems,
          { id: 'upload-report', label: 'Upload Report', icon: Upload },
          { id: 'reports', label: 'All Reports', icon: FileText },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        ];
      default:
        return commonItems;
    }
  };

  const navigationItems = getNavigationItems();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'patient':
        return <User className="w-5 h-5" />;
      case 'doctor':
        return <Stethoscope className="w-5 h-5" />;
      case 'lab':
        return <Building2 className="w-5 h-5" />;
      default:
        return <User className="w-5 h-5" />;
    }
  };

  const getRoleColor = () => {
    switch (user?.role) {
      case 'patient':
        return 'text-blue-600 bg-blue-50';
      case 'doctor':
        return 'text-green-600 bg-green-50';
      case 'lab':
        return 'text-purple-600 bg-purple-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="w-64 bg-white shadow-lg h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">M-Aarogya</h1>
            <p className="text-xs text-gray-500">Pathology Lab</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      {user && (
        <div className="p-4 border-b">
          <Card className="p-3">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getRoleColor()}`}>
                {getRoleIcon()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user.role}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start ${
                isActive 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => onPageChange(item.id)}
            >
              <IconComponent className="w-4 h-4 mr-3" />
              {item.label}
            </Button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-700 hover:bg-gray-100"
          onClick={() => onPageChange('settings')}
        >
          <Settings className="w-4 h-4 mr-3" />
          Settings
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:bg-red-50 mt-2"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
}
