import React, { useState, useEffect } from 'react';
import { GraduationCap, MessageSquare, Clock, CheckCircle, Loader2 } from 'lucide-react';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { getResults } from '../../services/resultService';
import { getComplaints } from '../../services/complaintService';
import { useAuth } from '../../context/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const [resultsData, complaintsData] = await Promise.all([
          getResults(user.uid),
          getComplaints(user.uid)
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
  }, [user]);

  const stats = [
    { 
      title: 'Courses Completed', 
      value: results.length.toString(), 
      icon: GraduationCap, 
      color: 'blue' 
    },
    { 
      title: 'Total Complaints', 
      value: complaints.length.toString(), 
      icon: MessageSquare, 
      color: 'purple' 
    },
    { 
      title: 'Pending Issues', 
      value: complaints.filter(c => c.status === 'Pending').length.toString(), 
      icon: Clock, 
      color: 'yellow' 
    },
    { 
      title: 'Resolved', 
      value: complaints.filter(c => c.status === 'Resolved').length.toString(), 
      icon: CheckCircle, 
      color: 'green' 
    },
  ];

  const columns = [
    { header: 'Course Name', accessor: 'courseName' },
    { header: 'Code', accessor: 'courseCode' },
    { header: 'Grade', accessor: 'grade', render: (row) => (
      <span className="font-bold text-primary-600">{row.grade}</span>
    )},
    { header: 'Semester', accessor: 'semester' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="md:ml-64 pt-16 transition-all duration-300">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="p-4 md:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Student Dashboard</h1>
            <p className="text-slate-500">Welcome back, {user?.displayName || 'Student'}! Here's your real-time academic overview.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map((stat, i) => (
              <Card key={i} {...stat} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Recent Results</h2>
                <button className="text-sm font-semibold text-primary-600 hover:underline">View All</button>
              </div>
              <Table 
                columns={columns} 
                data={results.slice(0, 5)} 
                loading={loading}
                emptyMessage="No results found yet. Check back once staff uploads them."
              />
            </div>

            <div className="lg:col-span-1">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Updates</h2>
              <div className="space-y-4">
                {complaints.length > 0 ? complaints.slice(0, 3).map((c) => (
                  <div key={c.id} className="p-4 bg-white border border-slate-200 rounded-xl">
                    <p className="text-sm font-semibold text-slate-900">{c.subject}</p>
                    <p className="text-xs text-slate-500 mt-1">Status: {c.status}</p>
                    {c.staffResponse && (
                      <p className="text-[10px] text-primary-600 mt-2 italic font-medium">Resp: {c.staffResponse.slice(0, 50)}...</p>
                    )}
                  </div>
                )) : (
                  <div className="p-8 text-center bg-white border border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm">
                    No recent activity.
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
