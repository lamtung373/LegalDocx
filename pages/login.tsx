import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FileText, Eye, EyeOff, Shield } from 'lucide-react';
import { Button, Input, Alert } from '@/components/UI';
import { isValidEmail } from '@/lib/utils';

interface LoginForm {
  email: string;
  password: string;
}

interface LoginError {
  field?: keyof LoginForm;
  message: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<LoginForm>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<LoginError[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if user is already logged in
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        router.push('/dashboard');
      }
    } catch (error) {
      // User not logged in, stay on login page
    }
  };

  const validateForm = (): boolean => {
    const newErrors: LoginError[] = [];

    if (!form.email.trim()) {
      newErrors.push({ field: 'email', message: 'Email là bắt buộc' });
    } else if (!isValidEmail(form.email)) {
      newErrors.push({ field: 'email', message: 'Email không hợp lệ' });
    }

    if (!form.password.trim()) {
      newErrors.push({ field: 'password', message: 'Mật khẩu là bắt buộc' });
    } else if (form.password.length < 6) {
      newErrors.push({ field: 'password', message: 'Mật khẩu phải có ít nhất 6 ký tự' });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors([]);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful
        router.push('/dashboard');
      } else {
        // Login failed
        setErrors([{ message: data.message || 'Đăng nhập thất bại' }]);
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors([{ message: 'Có lỗi xảy ra. Vui lòng thử lại.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof LoginForm) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
    
    // Clear field-specific errors
    setErrors(prev => prev.filter(error => error.field !== field));
  };

  const getFieldError = (field: keyof LoginForm): string | undefined => {
    return errors.find(error => error.field === field)?.message;
  };

  const getGeneralError = (): string | undefined => {
    return errors.find(error => !error.field)?.message;
  };

  if (!mounted) {
    return <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo and Title */}
        <div className="flex justify-center">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Hệ thống Công chứng
              </h1>
              <p className="text-sm text-gray-600">Bình Dương</p>
            </div>
          </div>
        </div>

        <h2 className="mt-8 text-center text-3xl font-extrabold text-gray-900">
          Đăng nhập vào hệ thống
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Hoặc{' '}
          <Link 
            href="/register" 
            className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
          >
            đăng ký tài khoản mới
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-200">
          {/* General Error Alert */}
          {getGeneralError() && (
            <div className="mb-6">
              <Alert type="error" onClose={() => setErrors([])}>
                {getGeneralError()}
              </Alert>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={handleInputChange('email')}
              error={getFieldError('email')}
              placeholder="name@company.com"
              autoComplete="email"
              required
            />

            {/* Password Field */}
            <div className="relative">
              <Input
                label="Mật khẩu"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleInputChange('password')}
                error={getFieldError('password')}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Ghi nhớ đăng nhập
                </label>
              </div>

              <div className="text-sm">
                <Link 
                  href="/forgot-password" 
                  className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
                >
                  Quên mật khẩu?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={loading}
            >
              Đăng nhập
            </Button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">Tài khoản demo:</p>
              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex items-center justify-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span><strong>Admin:</strong> admin@notary.vn / password</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span><strong>User:</strong> user1@notary.vn / password</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            © 2025 Hệ thống Công chứng Bình Dương. Phiên bản 2.0
          </p>
        </div>
      </div>
    </div>
  );
}
