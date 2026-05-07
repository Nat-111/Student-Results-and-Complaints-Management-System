import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import { getResults, addResult, updateResult, deleteResult } from '../../services/resultService';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';

const ManageResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '',
    courseCode: '',
    courseName: '',
    grade: '',
    semester: 'Semester 1',
    year: '2023'
  });

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    setLoading(true);
    const data = await getResults();
    setResults(data);
    setLoading(false);
  };

  const handleOpenModal = (result = null) => {
    if (result) {
      setCurrentResult(result);
      setFormData(result);
    } else {
      setCurrentResult(null);
      setFormData({
        studentId: '',
        courseCode: '',
        courseName: '',
        grade: '',
        semester: 'Semester 1',
        year: '2023'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentResult) {
      await updateResult(currentResult.id, formData);
    } else {
      await addResult(formData);
    }
    setIsModalOpen(false);
    fetchResults();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this result?")) {
      await deleteResult(id);
      fetchResults();
    }
  };

  const columns = [
    { header: 'Student ID', accessor: 'studentId' },
    { header: 'Course Code', accessor: 'courseCode' },
    { header: 'Course', accessor: 'courseName' },
    { header: 'Grade', accessor: 'grade' },
    { header: 'Semester', accessor: 'semester' },
    { header: 'Actions', render: (row) => (
      <div className="flex gap-2">
        <button onClick={() => handleOpenModal(row)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
          <Edit2 size={16} />
        </button>
        <button onClick={() => handleDelete(row.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
          <Trash2 size={16} />
        </button>
      </div>
    )},
  ];

  const [searchTerm, setSearchTerm] = useState('');

  const filteredResults = results.filter(r => 
    (r.studentIdDisplay || r.studentId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.courseCode || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.courseName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="md:ml-64 pt-16 transition-all duration-300">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="p-4 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Manage Results</h1>
              <p className="text-slate-500">Add, edit, or remove student academic records.</p>
            </div>
            <button 
              onClick={() => handleOpenModal()}
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus size={18} />
              <span>Add New Result</span>
            </button>
          </div>

          <div className="card mb-6">
            <div className="p-4 border-b border-slate-100 flex items-center gap-3">
              <Search size={18} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by Student ID or Course..." 
                className="bg-transparent border-none focus:ring-0 text-sm w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Table columns={columns} data={filteredResults} loading={loading} />
          </div>

          <Modal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            title={currentResult ? 'Edit Result' : 'Add New Result'}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label-text">Student ID</label>
                <input 
                  type="text" 
                  className="input-field" 
                  required 
                  value={formData.studentId}
                  onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Course Code</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    required 
                    value={formData.courseCode}
                    onChange={(e) => setFormData({...formData, courseCode: e.target.value})}
                  />
                </div>
                <div>
                  <label className="label-text">Grade</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="e.g. A"
                    required 
                    value={formData.grade}
                    onChange={(e) => setFormData({...formData, grade: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="label-text">Course Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  required 
                  value={formData.courseName}
                  onChange={(e) => setFormData({...formData, courseName: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Semester</label>
                  <select 
                    className="input-field"
                    value={formData.semester}
                    onChange={(e) => setFormData({...formData, semester: e.target.value})}
                  >
                    <option>Semester 1</option>
                    <option>Semester 2</option>
                  </select>
                </div>
                <div>
                  <label className="label-text">Year</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn btn-primary flex-1">Save Changes</button>
              </div>
            </form>
          </Modal>
        </main>
      </div>
    </div>
  );
};

export default ManageResults;
