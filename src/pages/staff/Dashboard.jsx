import React, { useState, useEffect } from 'react';
import { Users, FileText, MessageSquare, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { getResults } from '../../services/resultService';
import { getComplaints } from '../../services/complaintService';

const StaffDashboard = () => {
  const [results, setResults] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resultsData, complaintsData] = await Promise.all([
          getResults(), // Fetch ALL results for staff
          getComplaints() // Fetch ALL complaints for staff
        ]);
        setResults(resultsData);
        setComplaints(complaintsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { 
      title: 'Total Records', 
      value: results.length.toLocaleString(), 
      icon: FileText, 
      color: 'blue' 
    },
    { 
      title: 'New Complaints', 
      value: complaints.filter(c => c.status === 'Pending').length.toString(), 
      icon: MessageSquare, 
      color: 'yellow' 
    },
    { 
      title: 'In Progress', 
      value: complaints.filter(c => c.status === 'In Progress').length.toString(), 
      icon: AlertCircle, 
      color: 'blue' 
    },
    { 
      title: 'Success Rate', 
      value: complaints.length > 0 ? `${Math.round((complaints.filter(c => c.status === 'Resolved').length / complaints.length) * 100)}%` : '0%', 
      icon: Users, 
      color: 'green' 
    },
  ];

  const columns = [
    { header: 'Student Name', accessor: 'studentName' },
    { header: 'Subject', accessor: 'subject' },
    { header: 'Category', accessor: 'category' },
    { header: 'Status', render: (row) => (
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
        row.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
        row.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
      }`}>
        {row.status}
      </span>
    )},
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="md:ml-64 pt-16 transition-all duration-300">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="p-4 md:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Staff Management Console</h1>
            <p className="text-slate-500">Global overview of student results and active grievances.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map((stat, i) => (
              <Card key={i} {...stat} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Recent Complaints</h2>
                <button onClick={() => navigate('/staff/handle-complaints')} className="btn btn-secondary text-sm">View All</button>
              </div>
              <Table 
                columns={columns} 
                data={complaints.slice(0, 5)} 
                loading={loading}
                emptyMessage="No pending complaints to handle right now."
              />
            </div>

            <div className="lg:col-span-1">
              <div className="card p-6 bg-slate-900 text-white">
                <h3 className="font-bold text-lg mb-2">Quick Actions</h3>
                <p className="text-slate-400 text-sm mb-6">Manage records and resolve issues from here.</p>
                <div className="space-y-3">
                  <button 
                    onClick={() => navigate('/staff/manage-results')}
                    className="w-full bg-primary-600 text-white font-bold py-3 rounded-xl hover:bg-primary-500 transition-colors"
                  >
                    Upload New Results
                  </button>
                  <button 
                    onClick={() => navigate('/staff/handle-complaints')}
                    className="w-full bg-slate-800 text-white font-bold py-3 rounded-xl hover:bg-slate-700 transition-colors"
                  >
                    Review Complaints
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StaffDashboard;
