import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, User, Lock, Loader2, AlertCircle, CheckCircle, UserPlus } from 'lucide-react';
import { registerWithEmail, signInWithGoogle } from '../../services/authService';
import bgImage from '../../assets/IMG_0329-scaled-1.jpg';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;
    setError('');
    setLoading(true);

    try {
      await registerWithEmail(formData.email, formData.password, formData.role);
      setSent(true);
      setTimeout(() => {
        if (formData.role === 'staff') navigate('/staff/dashboard');
        else if (formData.role === 'admin') navigate('/admin/dashboard');
        else navigate('/student/dashboard');
      }, 2500);
    } catch (err) {
      console.error(err);
      setError('Registration failed. This email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      const user = await signInWithGoogle();
      // Redirect based on role
      if (user.role === 'student') navigate('/student/dashboard');
      else if (user.role === 'staff') navigate('/staff/dashboard');
      else if (user.role === 'admin') navigate('/admin/dashboard');
      else navigate('/login');
    } catch (err) {
      console.error("Google Signup Error:", err);
      setError('Google Signup failed. Please try again.');
    } finally {
      setGoogleLoading(false);
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
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 shadow-lg shadow-primary-200">
            U
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
          <p className="text-slate-500 mt-2">Sign up for the Student Results and Complaints Management System</p>
        </div>

        {sent ? (
          <div className="text-center py-8 animate-in fade-in slide-in-from-bottom-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Account Created!</h2>
            <p className="text-slate-500 mb-6">Your account has been successfully created. Redirecting to your dashboard...</p>
            <Loader2 className="w-6 h-6 text-primary-600 animate-spin mx-auto" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="label-text">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  className="input-field pl-11"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
            </div>

            <div>
              <label className="label-text">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="email"
                  className="input-field pl-11"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>

            <div>
              <label className="label-text">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="password"
                  className="input-field pl-11"
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <label className="label-text">Account Type</label>
              <select 
                className="input-field"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="student">Student</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-3 text-lg font-bold disabled:bg-primary-300 mt-4 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  <span>Create Account</span>
                </>
              )}
            </button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-slate-400 font-bold tracking-widest">Or sign up with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={googleLoading}
              className="w-full btn btn-secondary py-3 flex items-center justify-center gap-3 font-bold border-slate-200 hover:border-primary-200 hover:bg-primary-50 transition-all"
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
                  <span>Google Signup</span>
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-500">
            Already have an account? <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
