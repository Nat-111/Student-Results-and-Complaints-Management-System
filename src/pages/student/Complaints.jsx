import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { submitComplaint } from '../../services/complaintService';
import { useAuth } from '../../context/AuthContext';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

const Complaints = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    category: 'Missing Result'
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await submitComplaint({
        ...formData,
        studentId: user.uid,
        studentName: user.displayName || user.email,
      });
      setSubmitted(true);
      setFormData({ subject: '', description: '', category: 'Missing Result' });
    } catch (err) {
      console.error(err);
      setError('Failed to submit complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="ml-64 pt-16">
        <Navbar />
        <main className="p-8">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900">Submit a Complaint</h1>
              <p className="text-slate-500">Have an issue with your results? Let us know.</p>
            </div>

            {submitted ? (
              <div className="card p-10 text-center animate-in zoom-in duration-300">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={32} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Complaint Submitted Successfully!</h2>
                <p className="text-slate-500 mb-6">We have received your complaint. You can track its status in the "Track Status" section.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="btn btn-primary"
                >
                  Submit Another Complaint
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="card p-8 space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="label-text">Complaint Category</label>
                  <select 
                    className="input-field"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option>Missing Result</option>
                    <option>Grade Dispute</option>
                    <option>Wrong Course Info</option>
                    <option>Technical Issue</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="label-text">Subject</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="e.g. Missing grade for BCIT 305"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  />
                </div>

                <div>
                  <label className="label-text">Description</label>
                  <textarea 
                    className="input-field min-h-[150px] resize-none" 
                    placeholder="Provide detailed information about your issue..."
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn btn-primary w-full py-3 flex items-center justify-center gap-2"
                >
                  {loading ? 'Submitting...' : (
                    <>
                      <Send size={18} />
                      <span>Submit Complaint</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Complaints;
