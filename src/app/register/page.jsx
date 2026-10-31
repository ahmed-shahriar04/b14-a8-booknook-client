'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { signUp, signIn } from '../../lib/auth-client';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    photoURL: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    document.title = 'BookNook | Register';
  }, []);

  // Strict Password Validation per spec:
  // - Uppercase letter
  // - Lowercase letter
  // - Minimum 6 characters
  const validatePassword = (pass) => {
    if (pass.length < 6) {
      return 'Password length must be at least 6 characters.';
    }
    if (!/[A-Z]/.test(pass)) {
      return 'Password must contain at least one uppercase letter (A-Z).';
    }
    if (!/[a-z]/.test(pass)) {
      return 'Password must contain at least one lowercase letter (a-z).';
    }
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setErrorMsg(passwordError);
      return toast.error(passwordError);
    }

    setLoading(true);

    try {
      const res = await signUp.email({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        image: formData.photoURL || '',
      });

      if (res.error) {
        setErrorMsg(res.error.message || 'Registration failed');
        toast.error(res.error.message || 'Registration failed');
      } else {
        toast.success('Registration successful! Please log in to continue.');
        // Per requirement #84: Navigate to Login page
        router.push('/login');
      }
    } catch {
      setErrorMsg('Unexpected error during registration. Please try again.');
      toast.error('Unexpected error during registration');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await signIn.social({
        provider: 'google',
        callbackURL: '/',
      });
    } catch {
      toast.error('Google sign in error');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-cream-200 shadow-sm">
        <div className="text-center mb-6">
          <span className="text-[11px] font-bold text-[#FF7A59] tracking-wider uppercase">
            JOIN OUR LIBRARY
          </span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-forest-950 mt-1">
            Create an Account
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Start cataloguing, borrowing, and reviewing books today.
          </p>
        </div>

        {/* Error message box */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4 text-xs">
          <div>
            <label className="block text-stone-700 font-semibold mb-1">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Davis Workman"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:border-forest-950 bg-cream-50/50"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-semibold mb-1">Email Address *</label>
            <input
              type="email"
              required
              placeholder="you@domain.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:border-forest-950 bg-cream-50/50"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-semibold mb-1">Photo URL (Optional)</label>
            <input
              type="url"
              placeholder="https://example.com/avatar.jpg"
              value={formData.photoURL}
              onChange={(e) => setFormData({ ...formData, photoURL: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:border-forest-950 bg-cream-50/50"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-semibold mb-1">Password *</label>
            <input
              type="password"
              required
              placeholder="Min 6 chars, 1 uppercase, 1 lowercase"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:border-forest-950 bg-cream-50/50"
            />
            <p className="text-[10px] text-stone-400 mt-1">
              Must include at least 6 characters, 1 uppercase & 1 lowercase letter.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-forest-950 hover:bg-forest-900 text-white font-semibold py-3 rounded-full text-xs transition-all shadow-sm hover:shadow"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        {/* Social Login Button (Google only per spec) */}
        <div className="mt-6">
          <div className="relative flex items-center justify-center mb-4">
            <div className="border-t border-cream-200 w-full"></div>
            <span className="bg-white px-3 text-[11px] text-stone-400 uppercase tracking-wider">
              Or continue with
            </span>
            <div className="border-t border-cream-200 w-full"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-2.5 rounded-full border border-cream-300 hover:bg-cream-50 text-forest-950 font-semibold text-xs transition-colors"
          >
            <FontAwesomeIcon icon={faGoogle} className="text-red-500" />
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Login navigation link */}
        <p className="mt-6 text-center text-xs text-stone-500">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-forest-950 hover:underline">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
}

