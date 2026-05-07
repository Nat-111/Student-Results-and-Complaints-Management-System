import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import { getComplaints, updateComplaintStatus } from '../../services/complaintService';
import { MessageSquare, CheckCircle, Clock, XCircle, Search } from 'lucide-react';

const HandleComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [response, setResponse] = useState('');
  const [status, setStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    const data = await getComplaints();
    setComplaints(data);
    setLoading(false);
  };

  const handleOpenModal = (complaint) => {
    setSelectedComplaint(complaint);
    setResponse(complaint.staffResponse || '');
    setStatus(complaint.status);
    setIsModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await updateComplaintStatus(selectedComplaint.id, status, response);
    setIsModalOpen(false);
    fetchComplaints();
  };

  const columns = [
    { header: 'ID', accessor: 'complaintId' },
    { header: 'Student', accessor: 'studentName' },
    { header: 'Subject', accessor: 'subject' },
    { header: 'Status', render: (row) => (
      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
        row.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
        row.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
      }`}>
        {row.status}
      </span>
    )},
    { header: 'Action', render: (row) => (
      <button 
        onClick={() => handleOpenModal(row)}
        className="text-primary-600 hover:underline text-sm font-semibold"
      >
        Handle
      </button>
    )},
  ];

  const filteredComplaints = complaints.filter(c => 
    (c.complaintId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.studentName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.subject || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="md:ml-64 pt-16 transition-all duration-300">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="p-4 md:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Handle Complaints</h1>
            <p className="text-slate-500">Review and resolve student grievances.</p>
          </div>

          <div className="card mb-6">
            <div className="p-4 border-b border-slate-100 flex items-center gap-3">
              <Search size={18} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by ID, Student or Subject..." 
                className="bg-transparent border-none focus:ring-0 text-sm w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Table columns={columns} data={filteredComplaints} loading={loading} />
          </div>

          <Modal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            title="Review Complaint"
          >
            {selectedComplaint && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase mb-1">Complaint from {selectedComplaint.studentName}</h3>
                  <p className="text-lg font-bold text-slate-900">{selectedComplaint.subject}</p>
                  <p className="text-sm text-slate-600 mt-2 p-4 bg-slate-50 rounded-xl italic">
                    "{selectedComplaint.description}"
                  </p>
                </div>

                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="label-text">Update Status</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Pending', 'In Progress', 'Resolved'].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setStatus(s)}
                          className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                            status === s 
                              ? 'bg-primary-600 border-primary-600 text-white' 
                              : 'bg-white border-slate-200 text-slate-600 hover:border-primary-300'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="label-text">Official Response</label>
                    <textarea 
                      className="input-field min-h-[100px] resize-none"
                      placeholder="Type your response to the student..."
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary flex-1">Close</button>
                    <button type="submit" className="btn btn-primary flex-1">Update Student</button>
                  </div>
                </form>
              </div>
            )}
          </Modal>
        </main>
      </div>
    </div>
  );
};

export default HandleComplaints;
