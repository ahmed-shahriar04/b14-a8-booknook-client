'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { signIn } from '../../lib/auth-client';
import toast from 'react-hot-toast';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    document.title = 'BookNook | Login';
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await signIn.email({
        email,
        password,
      });

      if (res.error) {
        setErrorMsg(res.error.message || 'Invalid email or password');
        toast.error(res.error.message || 'Login failed');
      } else {
        toast.success('Welcome back to BookNook!');
        router.push(callbackUrl);
      }
    } catch {
      setErrorMsg('Unexpected login error. Please try again.');
      toast.error('Unexpected login error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await signIn.social({
        provider: 'google',
        callbackURL: callbackUrl,
      });
    } catch {
      toast.error('Google sign in error');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-cream-200 shadow-sm">
        <div className="text-center mb-6">
          <span className="text-[11px] font-bold text-[#FF7A59] tracking-wider uppercase">
            WELCOME BACK
          </span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-forest-950 mt-1">
            Sign In to BookNook
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Access your borrowed books, contributions, and reader history.
          </p>
        </div>

        {/* Error notice */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-stone-700 font-semibold mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:border-forest-950 bg-cream-50/50"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-stone-700 font-semibold">Password</label>
              <button
                type="button"
                onClick={() => toast('Password reset link has been noted!')}
                className="text-[11px] text-stone-400 hover:text-forest-950 transition-colors"
              >
                Forget Password?
              </button>
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 focus:outline-none focus:border-forest-950 bg-cream-50/50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-forest-950 hover:bg-forest-900 text-white font-semibold py-3 rounded-full text-xs transition-all shadow-sm hover:shadow"
          >
            {loading ? 'Authenticating...' : 'Login'}
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

        {/* Register navigation link */}
        <p className="mt-6 text-center text-xs text-stone-500">
          Don&apos;t have an account yet?{' '}
          <Link href="/register" className="font-bold text-forest-950 hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-forest-950 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
