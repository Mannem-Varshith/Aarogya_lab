import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, User, Stethoscope, Building2, Shield, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.jsx';

export function RegistrationPage() {
  const [activeTab, setActiveTab] = useState('patient');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    specialization: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { register } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const userData = {
        role: activeTab,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        ...(activeTab === 'doctor' && { specialization: formData.specialization }),
        ...(activeTab === 'lab' && { address: formData.address }),
      };

      const result = await register(userData);
      if (result.success) {
        setSuccess(true);
        const userRole = result.user?.role || activeTab;
        setTimeout(() => {
          window.location.href = `/${userRole}-dashboard`;
        }, 2000);
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const roleConfig = {
    patient: { title: 'Patient', icon: User },
    doctor: { title: 'Doctor', icon: Stethoscope },
    lab: { title: 'Lab', icon: Building2 },
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
        <Card className="w-full max-w-sm rounded-2xl shadow-xl border-none">
          <div
            className="w-full py-7 relative text-center flex flex-col justify-center items-center"
            style={{
              backgroundColor: '#1a233a',
              backgroundImage:
                "url('data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'60\' height=\'60\' viewBox=\'0 0 60 60\'%3e%3cpath d=\'M 50 10 h-40 v 40 h 40 z M 50 10 h 5 M 10 50 v 5 M 10 10 v-5 h-5\' fill=\'none\' stroke-linecap=\'round\' stroke=%2300c6a2 stroke-width=\'1.5\' stroke-opacity=\'0.15\'/%3e%3ccircle cx=\'30\' cy=\'30\' r=\'3\' fill=%2300c6a2 fill-opacity=\'0.15\'/%3e%3c/svg%3e')",
              backgroundRepeat: 'repeat',
              backgroundSize: '60px 60px',
            }}
          >
            <Shield className="mx-auto w-11 h-11 text-white mb-2" />
            <span className="text-white text-2xl font-extrabold tracking-wide mb-1">M-Aarogya</span>
            <span className="text-blue-100 font-medium text-xs">Your Health, Our Priority. Securely.</span>
          </div>
          <CardContent className="py-8 px-7 text-center">
            <CheckCircle className="w-14 h-14 text-green-600 mx-auto mb-3" />
            <h2 className="text-2xl font-bold mb-1">Registration Successful!</h2>
            <p className="text-muted-foreground">Redirecting to your dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4 xl:px-[400px]">
      <Card className="w-full max-w-[18rem] rounded-2xl shadow-xl border-none overflow-hidden">
        {/* Branding Header */}
        <div
          className="w-full py-7 relative text-center flex flex-col justify-center items-center"
          style={{
            backgroundColor: '#1a233a',
            backgroundImage:
              "url('data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'60\' height=\'60\' viewBox=\'0 0 60 60\'%3e%3cpath d=\'M 50 10 h-40 v 40 h 40 z M 50 10 h 5 M 10 50 v 5 M 10 10 v-5 h-5\' fill=\'none\' stroke-linecap=\'round\' stroke=%2300c6a2 stroke-width=\'1.5\' stroke-opacity=\'0.15\'/%3e%3ccircle cx=\'30\' cy=\'30\' r=\'3\' fill=%2300c6a2 fill-opacity=\'0.15\'/%3e%3c/svg%3e')",
            backgroundRepeat: 'repeat',
            backgroundSize: '60px 60px',
          }}
        >
          <Shield className="mx-auto w-11 h-11 text-white mb-2" />
          <span className="text-white text-2xl font-extrabold tracking-wide mb-1">M-Aarogya</span>
          <span className="text-blue-100 font-medium text-xs">Your Health, Our Priority. Securely.</span>
        </div>

        <form onSubmit={handleSubmit} autoComplete="on">
          <CardContent className="py-7 px-7 xl:px-[400px] flex flex-col gap-5">
            <div className="text-center mb-1">
              <h2 className="text-2xl font-bold">Create Account</h2>
              <p className="text-sm text-muted-foreground">Join our platform to get started</p>
            </div>

            {/* Role Tabs */}
            <div className="flex justify-center w-full gap-2 mb-1">
              {Object.entries(roleConfig).map(([role, { title, icon: Icon }]) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setActiveTab(role)}
                  className={`flex-1 flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold justify-center border transition 
                    ${activeTab === role
                      ? 'bg-[var(--medical-green)] text-white border-[var(--medical-green)] shadow'
                      : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'}
                  `}
                  tabIndex={activeTab === role ? 0 : -1}
                  role="tab"
                  aria-selected={activeTab === role}
                >
                  <Icon className="w-5 h-5" /> {title}
                </button>
              ))}
            </div>

            {/* Fields */}
            <div className={`${activeTab ? 'block' : 'hidden'} space-y-4`}>
              <div>
                <Label htmlFor="name" className="mb-1 text-gray-700 block">Full Name</Label>
                <Input id="name" name="name" type="text" placeholder="Enter your full name" value={formData.name} onChange={handleInputChange} required className="h-11" />
              </div>

              <div>
                <Label htmlFor="phone" className="mb-1 text-gray-700 block">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" placeholder="Enter your phone number" value={formData.phone} onChange={handleInputChange} autoComplete="tel" inputMode="numeric" required className="h-11" />
              </div>

              <div>
                <Label htmlFor="email" className="mb-1 text-gray-700 block">Email Address</Label>
                <Input id="email" name="email" type="email" placeholder="Enter your email" value={formData.email} onChange={handleInputChange} autoComplete="email" required className="h-11" />
              </div>

              {activeTab === 'doctor' && (
                <div>
                  <Label htmlFor="specialization" className="mb-1 text-gray-700 block">Specialization</Label>
                  <Input id="specialization" name="specialization" type="text" placeholder="e.g., Pathology, Cardiology" value={formData.specialization} onChange={handleInputChange} required className="h-11" />
                </div>
              )}

              {activeTab === 'lab' && (
                <div>
                  <Label htmlFor="address" className="mb-1 text-gray-700 block">Lab Address</Label>
                  <Input id="address" name="address" type="text" placeholder="Enter lab address" value={formData.address} onChange={handleInputChange} required className="h-11" />
                </div>
              )}

              <div>
                <Label htmlFor="password" className="mb-1 text-gray-700 block">Password</Label>
                <div className="relative">
                  <Input id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Create a password" value={formData.password} onChange={handleInputChange} autoComplete="new-password" required className="h-11 pr-11" />
                  <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[var(--medical-navy)]" onClick={() => setShowPassword(s => !s)}>
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="mb-1 text-gray-700 block">Confirm Password</Label>
                <div className="relative">
                  <Input id="confirmPassword" name="confirmPassword" type={showConfirm ? 'text' : 'password'} placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleInputChange} autoComplete="new-password" required className="h-11 pr-11" />
                  <button type="button" aria-label={showConfirm ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[var(--medical-navy)]" onClick={() => setShowConfirm(s => !s)}>
                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" disabled={loading} className="w-full h-11 rounded-lg text-base font-semibold bg-[var(--medical-green)] hover:bg-[var(--primary)] transition duration-150 flex items-center justify-center">
                {loading ? (<><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Creating Account...</>) : 'Create Account'}
              </Button>
            </div>
          </CardContent>
        </form>
        <CardFooter className="flex flex-col items-center justify-center py-4">
          <span className="text-sm text-gray-500">Already have an account?{' '}
            <a href="/login" className="font-semibold text-[var(--medical-green)] hover:underline">Sign in here</a>
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}
