import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import Table from '../../components/Table';
import { getResults } from '../../services/resultService';
import { useAuth } from '../../context/AuthContext';
import { Download, Filter } from 'lucide-react';

const Results = () => {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await getResults(user?.uid);
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [user]);

  const columns = [
    { header: 'Course Code', accessor: 'courseCode' },
    { header: 'Course Name', accessor: 'courseName' },
    { header: 'Semester', accessor: 'semester' },
    { header: 'Year', accessor: 'year' },
    { header: 'Grade', accessor: 'grade', render: (row) => (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
        row.grade.startsWith('A') ? 'bg-green-100 text-green-700' : 
        row.grade.startsWith('B') ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
      }`}>
        {row.grade}
      </span>
    )},
  ];

  const safeSearchTerm = (searchTerm || '').toLowerCase();
  const filteredResults = results.filter(r => 
    String(r.courseCode || '').toLowerCase().includes(safeSearchTerm) ||
    String(r.courseName || '').toLowerCase().includes(safeSearchTerm) ||
    String(r.semester || '').toLowerCase().includes(safeSearchTerm)
  );

  const handleDownloadTranscript = () => {
    if (results.length === 0) return;
    
    const headers = ['Course Code', 'Course Name', 'Semester', 'Year', 'Grade'];
    const csvContent = [
      headers.join(','),
      ...results.map(r => `"${r.courseCode}","${r.courseName}","${r.semester}","${r.year}","${r.grade}"`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `transcript_${user?.displayName || 'student'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Academic Results</h1>
              <p className="text-slate-500">View and download your semester results.</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleDownloadTranscript} className="btn btn-primary flex items-center gap-2">
                <Download size={18} />
                <span>Download Transcript</span>
              </button>
            </div>
          </div>

          <Table 
            columns={columns} 
            data={filteredResults} 
            loading={loading}
            emptyMessage={searchTerm ? "No results match your search." : "No results found for your account."}
          />
        </main>
      </div>
    </div>
  );
};

export default Results;
