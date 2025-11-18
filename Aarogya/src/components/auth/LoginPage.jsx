import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, User, Stethoscope, Building2, Eye, EyeOff, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.jsx';

export function LoginPage() {
  const [activeTab, setActiveTab] = useState('patient');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await login(phone, password, activeTab);
      if (result.success) {
        const userRole = result.user?.role || activeTab;
        setTimeout(() => {
          window.location.href = `/${userRole}-dashboard`;
        }, 100);
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const roleConfig = {
    patient: {
      title: 'Patient',
      icon: User,
    },
    doctor: {
      title: 'Doctor',
      icon: Stethoscope,
    },
    lab: {
      title: 'Lab',
      icon: Building2,
    },
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
      {/* Change is on this line below */}
      <Card className="mx-auto w-full max-w-[18rem] rounded-2xl shadow-xl border-none overflow-hidden">
        {/* Branding Header */}
        <div
          className="w-full py-7 px-0 relative text-center flex flex-col justify-center items-center"
          style={{
            backgroundColor: '#1a233a',
            backgroundImage:
              "url('data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'60\' height=\'60\' viewBox=\'0 0 60 60\'%3e%3cpath d=\'M 50 10 h-40 v 40 h 40 z M 50 10 h 5 M 10 50 v 5 M 10 10 v-5 h-5\' fill=\'none\' stroke-linecap=\'round\' stroke=%2300c6a2 stroke-width=\'1.5\' stroke-opacity=\'0.15\'/%3e%3ccircle cx=\'30\' cy=\'30\' r=\'3\' fill=%2300c6a2 fill-opacity=\'0.15\'/%3e%3c/svg%3e')",
            backgroundRepeat: 'repeat',
            backgroundSize: '60px 60px',
          }}
        >
          <Shield className="mx-auto w-11 h-11 text-white mb-2 drop-shadow-lg" />
          <span className="text-white text-2xl font-extrabold tracking-wide mb-1">M-Aarogya</span>
          <span className="text-blue-100 font-medium text-xs mb-1">Your Health, Our Priority. Securely.</span>
        </div>
        <form onSubmit={handleLogin} autoComplete="on">
          <CardContent className="p-8 flex flex-col gap-5">
            <div className="text-center mb-2">
              <CardTitle className="text-2xl font-bold mb-0">Welcome Back</CardTitle>
              <div className="text-sm text-muted-foreground ">Sign in to your account to continue</div>
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
            {/* Phone Input */}
            <div>
              <Label htmlFor="phone" className="mb-1 text-gray-700 block">Phone Number</Label>
              <div className="relative flex items-center">
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-11 border outline-none rounded-lg text-base focus:border-[var(--medical-green)] focus-visible:ring-[var(--medical-green)]"
                  autoComplete="tel"
                  inputMode="numeric"
                  aria-required="true"
                  required
                />
              </div>
            </div>
            {/* Password Input */}
            <div>
              <Label htmlFor="password" className="mb-1 text-gray-700 block">Password</Label>
              <div className="relative flex items-center">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-11 h-11 border outline-none rounded-lg text-base focus:border-[var(--medical-green)] focus-visible:ring-[var(--medical-green)]"
                  autoComplete="current-password"
                  aria-required="true"
                  required
                />
                <button
                  type="button"
                  tabIndex={0}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[var(--medical-navy)] px-1"
                  onClick={() => setShowPassword((s) => !s)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {/* Error message and Forgot password */}
              <div className="flex flex-col sm:flex-row justify-end items-end gap-y-1 mt-1">
                {error && (
                  <Alert variant="destructive" className="p-2 pl-3 mb-1 w-full text-left">
                    <AlertDescription className="text-xs">{error}</AlertDescription>
                  </Alert>
                )}
                <a
                  href="#"
                  className="text-xs text-[var(--medical-green)] font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--medical-green)] rounded"
                  aria-label="Forgot password"
                >
                  Forgot Password?
                </a>
              </div>
            </div>
            {/* Sign in Button */}
            <Button
              type="submit"
              className="w-full h-11 rounded-lg text-base font-semibold bg-[var(--medical-green)] hover:bg-[var(--primary)] transition duration-150 flex items-center justify-center"
              aria-label="Sign in"
              disabled={loading}
            >
              {loading ? (<><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Signing in...</>) : 'Sign In'}
            </Button>
          </CardContent>
        </form>
        <CardFooter className="flex flex-col items-center justify-center py-4">
          <span className="text-sm text-gray-500">Don't have an account?{' '}
            <a href="/register" className="font-semibold text-[var(--medical-green)] hover:underline">Sign up here</a>
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}