import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import Table from '../../components/Table';
import api from '../../services/api';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users/');
        setUsers(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const columns = [
    { header: 'Username', accessor: 'username', render: (row) => row.first_name ? `${row.first_name} ${row.last_name}` : row.username },
    { header: 'Email', accessor: 'email' },
    { header: 'Role', accessor: 'role', render: (row) => (
      <span className={`px-2 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
        row.role === 'admin' ? 'bg-red-100 text-red-700' :
        row.role === 'staff' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
      }`}>
        {row.role}
      </span>
    )},
  ];

  const safeSearchTerm = (searchTerm || '').toLowerCase();
  const filteredUsers = users.filter(u => 
    String(u.username || '').toLowerCase().includes(safeSearchTerm) ||
    String(u.email || '').toLowerCase().includes(safeSearchTerm) ||
    String(u.role || '').toLowerCase().includes(safeSearchTerm)
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="md:ml-64 pt-16 transition-all duration-300">
        <Navbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <main className="p-4 md:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Manage Users</h1>
            <p className="text-slate-500">View and manage system users across all roles.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <Table 
              columns={columns} 
              data={filteredUsers} 
              loading={loading}
              emptyMessage={searchTerm ? "No users match your search." : "No users found in the system."}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManageUsers;
