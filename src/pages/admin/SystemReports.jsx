import React, { useState, useEffect } from 'react';
import { Download, FileText, Loader2, AlertCircle } from 'lucide-react';
import SidebarComponent from '../../components/Sidebar';
import NavbarComponent from '../../components/Navbar';
import api from '../../services/api';

const SystemReports = () => {
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('complaints');

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/${reportType}/`);
      const data = response.data;
      if (!data || data.length === 0) {
        alert("No data available for this report.");
        return;
      }

      let csvContent = "";
      let filename = "";

      if (reportType === 'complaints') {
        const headers = ['ID', 'Student', 'Subject', 'Status', 'Date Logged'];
        csvContent = headers.join(',') + '\n' + data.map(c => 
          `"${c.complaint_id}","${c.student_details?.user?.username || ''}","${c.course_details ? c.course_details.code : 'General Issue'}","${c.status}","${new Date(c.created_at).toLocaleString()}"`
        ).join('\n');
        filename = "complaints_report.csv";
      } else if (reportType === 'results') {
        const headers = ['Course Code', 'Student ID', 'Grade', 'Semester'];
        csvContent = headers.join(',') + '\n' + data.map(r => 
          `"${r.course_details?.code || ''}","${r.student_details?.student_id || ''}","${r.grade}","${r.semester}"`
        ).join('\n');
        filename = "results_report.csv";
      }

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      alert("Failed to generate report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SidebarComponent />
      <div className="md:ml-64 pt-16 transition-all duration-300">
        <NavbarComponent />
        <main className="p-4 md:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">System Reports</h1>
            <p className="text-slate-500">Generate and download analytical reports in CSV format.</p>
          </div>

          <div className="max-w-2xl bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
            <div className="mb-6">
              <label className="label-text mb-2 block">Select Report Type</label>
              <div className="flex gap-4">
                <button 
                  onClick={() => setReportType('complaints')}
                  className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${reportType === 'complaints' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 hover:border-primary-200 text-slate-600'}`}
                >
                  <AlertCircle size={24} />
                  <span className="font-semibold">Complaints Log</span>
                </button>
                <button 
                  onClick={() => setReportType('results')}
                  className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${reportType === 'results' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 hover:border-primary-200 text-slate-600'}`}
                >
                  <FileText size={24} />
                  <span className="font-semibold">Academic Results</span>
                </button>
              </div>
            </div>

            <button 
              onClick={handleDownload}
              disabled={loading}
              className="w-full btn btn-primary py-3.5 flex items-center justify-center gap-2 text-lg font-bold"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
              <span>Generate & Download</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SystemReports;
