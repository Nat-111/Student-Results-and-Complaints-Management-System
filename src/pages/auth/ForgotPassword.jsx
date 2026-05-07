import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Loader2, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { resetPassword } from '../../services/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError('Failed to send reset link. Check your email address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
        <div className="mb-8">
          <Link to="/login" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-primary-600 mb-6 transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Back to Login
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Forgot Password?</h1>
          <p className="text-slate-500 mt-2">Enter your email to receive a password reset link.</p>
        </div>

        {success ? (
          <div className="text-center py-4 animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Check Your Email</h2>
            <p className="text-slate-500 mb-8">We've sent a password reset link to <span className="font-semibold">{email}</span></p>
            <Link to="/login" className="btn btn-primary w-full">Return to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="label-text">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="email"
                  className="input-field pl-11"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-3 text-lg font-bold disabled:bg-primary-300"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Sending Link...
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
