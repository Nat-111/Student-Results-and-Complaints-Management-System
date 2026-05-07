import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, AlertCircle, Headphones, LogIn } from 'lucide-react';
import { loginWithEmail, signInWithGoogle, signInWithGoogleRedirect } from '../../services/authService';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import bgImage from '../../assets/IMG_0329-scaled-1.jpg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const navigate = useNavigate();
  const { role, isAuthenticated } = useAuth();

  // If already logged in, redirect immediately
  React.useEffect(() => {
    if (isAuthenticated && role) {
      if (role === 'staff') navigate('/staff/dashboard');
      else if (role === 'admin') navigate('/admin/dashboard');
      else navigate('/student/dashboard');
    }
  }, [isAuthenticated, role, navigate]);

  const handleLoginSuccess = (user) => {
    // Direct and immediate navigation
    if (user.role === 'staff') navigate('/staff/dashboard');
    else if (user.role === 'admin') navigate('/admin/dashboard');
    else navigate('/student/dashboard'); // Default to student
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setError('');
    setLoading(true);
    try {
      await loginWithEmail(email, password);
    } catch (err) {
      console.error("Login Error:", err);
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      const user = await signInWithGoogle();
      handleLoginSuccess(user);
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      if (err.code === 'auth/popup-blocked') {
        setError('Popup blocked. Click "Redirect" below.');
      } else {
        setError(err.message || 'Login failed. Ensure localhost is authorized in Firebase.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleRedirectSignIn = async () => {
    setError('');
    try {
      await signInWithGoogleRedirect();
    } catch (err) {
      console.error(err);
      setError('Redirect failed.');
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 shadow-lg">
            U
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Sign In</h1>
          <p className="text-slate-500 mt-2">Access your student or staff portal</p>
        </div>

        <div className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm">
              <AlertCircle size={20} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full btn btn-secondary py-3.5 flex items-center justify-center gap-3 font-bold border-slate-200 hover:border-primary-200 hover:bg-primary-50 transition-all shadow-sm"
          >
            {googleLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5.04c1.94 0 3.51.68 4.79 1.97l3.58-3.58C18.16 1.28 15.3 0 12 0 7.33 0 3.3 2.69 1.3 6.65l4.23 3.29C6.54 7.2 9.06 5.04 12 5.04z" />
                  <path fill="#FBBC05" d="M22.67 12.5c0-.85-.08-1.68-.21-2.5H12v4.8h6.01c-.26 1.37-1.04 2.53-2.21 3.31l4.23 3.29c2.47-2.28 3.87-5.64 3.87-8.9z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-4.23-3.29c-1.1.74-2.51 1.18-3.7 1.18-2.94 0-5.46-2.16-6.47-5.06l-4.23 3.29C3.3 21.31 7.33 24 12 24z" />
                  <path fill="#4285F4" d="M5.53 13.92C5.27 13.17 5.12 12.35 5.12 11.5s.15-1.67.41-2.42L1.3 5.79C.47 7.45 0 9.4 0 11.5s.47 4.05 1.3 5.71l4.23-3.29z" />
                </svg>
                <span>Sign in with Google</span>
              </>
            )}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-slate-400 font-bold tracking-widest">Or Email & Password</span></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="email"
                className="input-field pl-11"
                placeholder="name@upsa.edu.gh"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="password"
                className="input-field pl-11"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-3 font-bold flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <LogIn size={20} />}
              <span>Login</span>
            </button>
          </form>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-500">
            Need an account? <Link to="/signup" className="text-primary-600 font-semibold hover:underline">Sign Up</Link>
          </p>
          <button onClick={() => setIsContactModalOpen(true)} className="mt-6 text-xs font-medium text-slate-400 hover:text-slate-600 flex items-center justify-center gap-2 mx-auto">
            <Headphones size={14} />
            <span>Contact Support</span>
          </button>
        </div>

        <Modal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} title="Support">
          <div className="space-y-4">
            <p className="text-sm text-slate-600">Contact IT Support for access issues.</p>
            <div className="p-4 bg-slate-50 rounded-xl"><p className="text-sm font-semibold">it.support@upsa.edu.gh</p></div>
            <button onClick={() => setIsContactModalOpen(false)} className="w-full btn btn-primary py-2.5">Close</button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Login;
