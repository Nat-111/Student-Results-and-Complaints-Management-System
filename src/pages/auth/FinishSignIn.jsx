import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { completeSignInWithLink } from '../../services/authService';

const FinishSignIn = () => {
  const [status, setStatus] = useState('processing'); // processing, success, error, needs-email
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleCompleteSignIn = useCallback(async (emailToUse) => {
    setStatus('processing');
    try {
      const user = await completeSignInWithLink(emailToUse, window.location.href);
      setStatus('success');
      
      // Clear storage
      window.localStorage.removeItem('emailForSignIn');
      window.localStorage.removeItem('pendingRole');
      window.localStorage.removeItem('pendingName');

      // Immediate redirect for "automatic" feel
      if (user.role === 'student') navigate('/student/dashboard');
      else if (user.role === 'staff') navigate('/staff/dashboard');
      else if (user.role === 'admin') navigate('/admin/dashboard');
      else navigate('/login');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setError(err.message || 'Failed to complete sign-in.');
    }
  }, [navigate]);

  useEffect(() => {
    const finalizeLogin = async () => {
      try {
        const storedEmail = window.localStorage.getItem('emailForSignIn');
        
        if (storedEmail) {
          await handleCompleteSignIn(storedEmail);
        } else {
          setStatus('needs-email');
        }
      } catch (err) {
        console.error(err);
        setStatus('error');
        setError(err.message || 'Failed to complete sign-in. The link may have expired.');
      }
    };

    finalizeLogin();
  }, [handleCompleteSignIn]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center border border-slate-100">
        {status === 'processing' && (
          <div className="space-y-6">
            <Loader2 className="animate-spin text-primary-600 mx-auto" size={48} />
            <h1 className="text-2xl font-bold text-slate-900">Finalizing Sign-In</h1>
            <p className="text-slate-500">Please wait while we verify your secure link...</p>
          </div>
        )}

        {status === 'needs-email' && (
          <div className="space-y-6 animate-in zoom-in duration-300">
            <h1 className="text-2xl font-bold text-slate-900">One Last Step</h1>
            <p className="text-slate-500">Please confirm your email address to complete the secure sign-in.</p>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleCompleteSignIn(email);
              }}
              className="space-y-4"
            >
              <input 
                type="email" 
                className="input-field" 
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary w-full py-3">
                Complete Sign-In
              </button>
            </form>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6 animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={40} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Authenticated!</h1>
            <p className="text-slate-500">Taking you to your dashboard now...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6 animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={40} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Sign-In Failed</h1>
            <p className="text-slate-500">{error}</p>
            <button 
              onClick={() => navigate('/login')}
              className="btn btn-primary w-full"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinishSignIn;
