import { useState, useEffect } from 'react';
import { Users, MessageSquare, CheckCircle, Activity, TrendingUp, Loader2 } from 'lucide-react';
import Card from '../../components/Card';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import api from '../../services/api';

const AdminDashboard = () => {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats/');
        setStatsData(response.data);
      } catch (err) {
        console.error("Failed to load admin stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { title: 'Total Students', value: statsData?.total_students || 0, icon: Users, color: 'blue' },
    { title: 'Total Staff', value: statsData?.total_staff || 0, icon: Activity, color: 'purple' },
    { title: 'Total Complaints', value: statsData?.total_complaints || 0, icon: MessageSquare, color: 'yellow' },
    { title: 'Resolved Complaints', value: statsData?.resolved_complaints || 0, icon: CheckCircle, color: 'green' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="md:ml-64 pt-16 transition-all duration-300">
        <Navbar />
        <main className="p-4 md:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Administrative Overview</h1>
            <p className="text-slate-500">Monitor system-wide activity and academic performance metrics.</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-primary-600" size={32} />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, i) => (
                  <Card key={i} {...stat} />
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1">
                      <Activity size={12} /> Live
                    </span>
                  </div>
                  <div className="space-y-6">
                    {statsData?.recent_complaints && statsData.recent_complaints.length > 0 ? (
                      statsData.recent_complaints.map((comp) => (
                        <div key={comp.id} className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                            <TrendingUp size={18} className="text-slate-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-slate-900">Complaint Logged</p>
                            <p className="text-xs text-slate-500 mt-0.5">{comp.subject} by {comp.studentName || 'Student'}.</p>
                            <p className="text-[10px] text-slate-400 mt-2">{new Date(comp.created_at).toLocaleString()}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">No recent activity.</p>
                    )}
                  </div>
                </div>

                <div className="card p-8 bg-slate-900 text-white">
                  <h2 className="text-lg font-bold mb-2">Complaint Resolution Rate</h2>
                  <p className="text-slate-400 text-sm mb-8">Performance analysis for the current semester.</p>
                  
                  <div className="flex items-end gap-2 h-32 mb-6">
                    {[40, 70, 45, 90, 65, 80, 95].map((h, i) => (
                      <div key={i} className="flex-1 bg-primary-500 rounded-t-lg transition-all hover:bg-primary-400" style={{ height: `${h}%` }}></div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
