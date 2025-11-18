import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Search, Bell, User, Menu } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.jsx';

export function Header({ onMenuToggle, showMenuButton = false }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-6">
      {/* Left side */}
      <div className="flex items-center space-x-4">
        {showMenuButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="md:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
        )}
        
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

      {/* Center - Search */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search reports, patients..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-3">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
            3
          </span>
        </Button>

        {/* User Menu */}
        {user && (
          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900"
            >
              <User className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
