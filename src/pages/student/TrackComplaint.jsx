import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import Table from '../../components/Table';
import { getComplaints } from '../../services/complaintService';
import { useAuth } from '../../context/AuthContext';
import { Clock, CheckCircle, AlertCircle, MessageCircle } from 'lucide-react';

const TrackComplaint = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const data = await getComplaints(user?.uid);
        setComplaints(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, [user]);

  const getStatusBadge = (status) => {
    const styles = {
      'Pending': 'bg-yellow-100 text-yellow-700',
      'In Progress': 'bg-blue-100 text-blue-700',
      'Resolved': 'bg-green-100 text-green-700',
      'Rejected': 'bg-red-100 text-red-700',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status] || 'bg-slate-100'}`}>
        {status}
      </span>
    );
  };

  const columns = [
    { header: 'ID', accessor: 'complaintId' },
    { header: 'Subject', accessor: 'subject' },
    { header: 'Category', accessor: 'category' },
    { header: 'Date', accessor: 'createdAt', render: (row) => (
      row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'Recent'
    )},
    { header: 'Status', accessor: 'status', render: (row) => getStatusBadge(row.status) },
  ];

  const filteredComplaints = complaints.filter(c => 
    (c.complaintId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.subject || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="md:ml-64 pt-16 transition-all duration-300">
        <Navbar 
          onMenuClick={() => setIsSidebarOpen(true)} 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        <main className="p-4 md:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Track Complaints</h1>
            <p className="text-slate-500">Monitor the progress of your submitted complaints.</p>
          </div>

          <Table 
            columns={columns} 
            data={filteredComplaints} 
            loading={loading}
            emptyMessage={searchTerm ? "No complaints match your search." : "You haven't submitted any complaints yet."}
          />

          {filteredComplaints.length > 0 && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <h2 className="text-lg font-bold text-slate-900 col-span-full">Detailed Responses</h2>
              {filteredComplaints.filter(c => c.staffResponse).map(complaint => (
                <div key={complaint.id} className="card p-6 border-l-4 border-l-primary-500">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-slate-400">{complaint.complaintId}</span>
                    {getStatusBadge(complaint.status)}
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{complaint.subject}</h3>
                  <div className="bg-slate-50 p-4 rounded-xl relative">
                    <div className="absolute -top-2 left-4 text-primary-600 bg-white px-1">
                      <MessageCircle size={16} />
                    </div>
                    <p className="text-sm text-slate-700 italic">"{complaint.staffResponse}"</p>
                    <p className="text-[10px] text-slate-400 mt-2 font-medium">— Academic Affairs Office</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TrackComplaint;
